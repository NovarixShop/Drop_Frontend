/**
 * Razorpay Checkout loader and launcher.
 *
 * Card details are entered inside Razorpay's own overlay and never touch this app or our
 * API, which is what keeps the storefront out of PCI scope. We only ever handle the three
 * opaque ids the overlay returns, which the server then verifies by HMAC signature.
 */

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

export interface RazorpaySession {
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  orderId: string;
}

export interface RazorpayHandles {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on: (event: string, handler: (payload: unknown) => void) => void;
}

type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
    // Lenis instance, exposed by ReactLenis
    lenis?: { stop: () => void; start: () => void };
  }
}

let loader: Promise<void> | null = null;

/** Loads checkout.js once per page, reusing the in-flight promise for concurrent callers. */
export const loadRazorpayCheckout = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.reject(new Error("Not in a browser"));
  if (window.Razorpay) return Promise.resolve();
  if (loader) return loader;

  loader = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SRC}"]`);
    const script = existing ?? document.createElement("script");

    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener(
      "error",
      () => {
        // Let a later attempt retry rather than caching the failure forever.
        loader = null;
        script.remove();
        reject(new Error("Couldn't load the payment gateway. Check your connection and retry."));
      },
      { once: true }
    );

    if (!existing) {
      script.src = CHECKOUT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return loader;
};

export class RazorpayDismissedError extends Error {
  constructor() {
    super("Payment was cancelled before it completed.");
    this.name = "RazorpayDismissedError";
  }
}

/**
 * Opens the overlay and resolves with the handles to verify server-side.
 * Rejects with RazorpayDismissedError if the shopper closes it without paying.
 */
export const openRazorpayCheckout = async (
  session: RazorpaySession,
  options: {
    name?: string;
    description?: string;
    prefill?: { name?: string; email?: string; contact?: string };
    /** Pause/resume smooth scrolling while the overlay is open (see below). */
    pauseScroll?: () => void;
    resumeScroll?: () => void;
  } = {}
): Promise<RazorpayHandles> => {
  await loadRazorpayCheckout();

  const Razorpay = window.Razorpay;
  if (!Razorpay) throw new Error("The payment gateway failed to initialise. Please retry.");

  // Lenis sets `pointer-events: none` on every iframe while smooth scrolling, and keeps
  // scrolling the page behind the overlay. Pausing it for the duration fixes both. The
  // caller passes its useLenis() handle; window.lenis is a best-effort fallback.
  const pause = options.pauseScroll ?? (() => window.lenis?.stop());
  const resume = options.resumeScroll ?? (() => window.lenis?.start());
  pause();

  return new Promise<RazorpayHandles>((resolve, reject) => {
    let settled = false;
    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      resume();
      fn();
    };

    const instance = new Razorpay({
      key: session.keyId,
      order_id: session.razorpayOrderId,
      amount: session.amount,
      currency: session.currency,
      name: options.name || "NOVARIX",
      description: options.description,
      prefill: options.prefill,
      // Razorpay would otherwise retry inside its own overlay, which leaves this
      // promise hanging and our order state out of step with the gateway.
      retry: { enabled: false },
      theme: { color: "#4648d4" },
      handler: (response: unknown) => {
        const r = response as Partial<RazorpayHandles>;
        if (r.razorpay_order_id && r.razorpay_payment_id && r.razorpay_signature) {
          finish(() => resolve(r as RazorpayHandles));
        } else {
          finish(() => reject(new Error("The gateway returned an incomplete payment result.")));
        }
      },
      modal: {
        ondismiss: () => finish(() => reject(new RazorpayDismissedError())),
      },
    });

    instance.on("payment.failed", (payload: unknown) => {
      const description = (payload as { error?: { description?: string } })?.error?.description;
      finish(() => {
        instance.close();
        reject(new Error(description || "The payment could not be completed. Please try again."));
      });
    });

    instance.open();
  });
};
