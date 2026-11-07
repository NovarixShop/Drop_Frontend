"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft, CreditCard, Loader2, MapPin, Truck } from "lucide-react";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useIsClient } from "@/lib/useIsClient";
import { Order, ORDER_STATUS_STYLES, needsPayment, shortOrderId } from "@/lib/orders";
import { useLenis } from "@studio-freight/react-lenis";
import {
  openRazorpayCheckout,
  loadRazorpayCheckout,
  RazorpayDismissedError,
  type RazorpaySession,
} from "@/lib/razorpay";

interface Checkpoint {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

interface Tracking {
  carrier: string;
  estimatedDelivery: string;
  checkpoints: Checkpoint[];
}

// The server marks the order paid inside the verify call, but Razorpay's own capture
// webhook can land a moment later; this pause keeps the refreshed view consistent.
const SETTLEMENT_DELAY_MS = 800;

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isClient = useIsClient();
  const { isAuthenticated, user } = useAuthStore();
  // Pausing Lenis keeps the Razorpay overlay's iframe clickable.
  const lenis = useLenis();

  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState<Tracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cancelling, setCancelling] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const fetchOrder = useCallback(async (): Promise<{ order: Order; tracking: Tracking | null }> => {
    const [orderRes, trackingRes] = await Promise.all([
      api.get(`/orders/${id}`),
      api.get(`/tracking/${id}`).catch(() => null),
    ]);
    return { order: orderRes.data.data.order, tracking: trackingRes?.data.data.tracking ?? null };
  }, [id]);

  // Re-read the order after cancelling or paying
  const reload = async () => {
    const data = await fetchOrder();
    setOrder(data.order);
    setTracking(data.tracking);
  };

  useEffect(() => {
    if (isClient && !isAuthenticated) router.replace(`/login?redirect=/orders/${id}`);
  }, [isClient, isAuthenticated, router, id]);

  useEffect(() => {
    if (!isClient || !isAuthenticated) return;
    let cancelled = false;

    fetchOrder()
      .then((data) => {
        if (cancelled) return;
        setOrder(data.order);
        setTracking(data.tracking);
      })
      .catch((err) => !cancelled && setError(getErrorMessage(err, "Failed to load this order.")))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [isClient, isAuthenticated, fetchOrder]);

  const handleCancel = async () => {
    if (!confirm("Cancel this order? This can't be undone.")) return;
    setCancelling(true);
    try {
      await api.put(`/orders/${id}/cancel`);
      toast.success("Order cancelled");
      // A failed refresh shouldn't be reported as a failed cancellation
      await reload().catch(() => {});
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to cancel the order."));
    } finally {
      setCancelling(false);
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayError("");
    setPaying(true);
    try {
      const res = await api.post(`/payments/razorpay/order/${id}`);
      const session: RazorpaySession = res.data.data;

      const handles = await openRazorpayCheckout(session, {
        description: `Order ${shortOrderId(String(id))}`,
        prefill: { name: user?.name, email: user?.email },
        pauseScroll: () => lenis?.stop(),
        resumeScroll: () => lenis?.start(),
      });

      await api.post("/payments/razorpay/verify", { orderId: id, ...handles });
      await new Promise((resolve) => setTimeout(resolve, SETTLEMENT_DELAY_MS));
      // A failed refresh shouldn't be reported as a failed payment
      await reload().catch(() => {});
      toast.success("Payment received. Thank you!");
    } catch (err) {
      if (err instanceof RazorpayDismissedError) {
        setPayError("Payment was cancelled. This order is still waiting for payment.");
      } else if (axios.isAxiosError(err) && err.response?.status === 503) {
        setPayError("Card payments are unavailable right now. Please try again later.");
      } else if (err instanceof Error && !axios.isAxiosError(err)) {
        setPayError(err.message);
      } else {
        setPayError(getErrorMessage(err, "Payment failed. Please try again."));
      }
    } finally {
      setPaying(false);
    }
  };

  // Warm the gateway script while the shopper reads the order, so Pay opens instantly.
  useEffect(() => {
    if (order && needsPayment(order)) loadRazorpayCheckout().catch(() => {});
  }, [order]);

  if (!isClient || !isAuthenticated || loading) {
    return (
      <div className="min-h-[60svh] flex items-center justify-center gap-3 text-on-surface-variant">
        <Loader2 className="animate-spin" /> Loading order...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60svh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Order not found</h1>
        <p className="text-on-surface-variant mb-8">{error}</p>
        <Link href="/orders" className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const status = ORDER_STATUS_STYLES[order.orderStatus];
  const { totals, shippingAddress: addr } = order;

  return (
    <div className="w-full max-w-[896px] mx-auto px-4 py-12 pb-28 md:pb-12">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 font-label-md"
      >
        <ArrowLeft size={16} /> My Orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-xl text-on-surface mb-2">Order {shortOrderId(order._id)}</h1>
          <p className="text-on-surface-variant font-caption">
            Placed {new Date(order.createdAt).toLocaleString()} · Tracking {order.trackingNumber}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${status.className}`}>{status.label}</span>
          {order.orderStatus === "pending" && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-4 py-2 rounded-xl border border-red-500/60 text-red-500 font-label-md hover:bg-red-500/10 disabled:opacity-50"
            >
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>
      </div>

      {needsPayment(order) && (
        <form onSubmit={handlePay} className="bg-surface-container-low rounded-2xl p-6 mb-8 border border-amber-500/40">
          <h2 className="flex items-center gap-2 font-headline-md text-headline-md mb-2">
            <CreditCard size={20} className="text-primary" /> Complete payment
          </h2>
          <p className="text-on-surface-variant font-caption mb-6">
            This order is waiting for payment of ₹{totals.grandTotal.toFixed(2)}.
          </p>
          <p className="text-on-surface-variant font-caption mb-6">
            Pressing Pay opens Razorpay&apos;s secure window, where you can pay by card, UPI,
            netbanking or wallet.
          </p>
          {payError && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
              {payError}
            </div>
          )}
          <button
            type="submit"
            disabled={paying}
            className="mt-6 flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md disabled:opacity-50"
          >
            {paying && <Loader2 size={16} className="animate-spin" />}
            Pay ₹{totals.grandTotal.toFixed(2)}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <section className="md:col-span-3 bg-surface-container-low rounded-2xl p-6">
          <h2 className="flex items-center gap-2 font-headline-md text-headline-md mb-6">
            <Truck size={20} className="text-primary" /> Tracking
          </h2>
          {tracking ? (
            <>
              {order.orderStatus !== "cancelled" && order.orderStatus !== "delivered" && (
                <p className="text-on-surface-variant font-caption mb-6">
                  {tracking.carrier} · Estimated delivery {new Date(tracking.estimatedDelivery).toLocaleDateString()}
                </p>
              )}
              <ol className="relative border-l border-outline-variant ml-2 space-y-6">
                {tracking.checkpoints.map((cp, idx) => (
                  <li key={`${cp.status}-${idx}`} className="ml-6">
                    <span
                      className={`absolute -left-[7px] w-3.5 h-3.5 rounded-full ${
                        idx === tracking.checkpoints.length - 1 ? "bg-primary" : "bg-outline-variant"
                      }`}
                    />
                    <p className="font-bold text-on-surface">{cp.status}</p>
                    <p className="font-caption text-on-surface-variant">
                      {new Date(cp.timestamp).toLocaleString()} · {cp.location}
                    </p>
                    <p className="font-body-md text-on-surface-variant mt-1">{cp.description}</p>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <p className="text-on-surface-variant">Tracking information isn&apos;t available yet.</p>
          )}
        </section>

        <div className="md:col-span-2 space-y-8">
          <section className="bg-surface-container-low rounded-2xl p-6">
            <h2 className="font-headline-md text-headline-md mb-4">Items</h2>
            <ul className="space-y-3 mb-6">
              {order.items.map((item) => (
                <li key={item.product} className="flex justify-between gap-3 font-body-md">
                  <span className="text-on-surface">
                    {item.name} <span className="text-on-surface-variant">× {item.quantity}</span>
                  </span>
                  <span className="text-on-surface whitespace-nowrap">₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-2 text-on-surface-variant font-body-md border-t border-outline-variant pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-on-surface">₹{totals.subtotal.toFixed(2)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-[#00C853]">
                  <span>Discount</span>
                  <span>-₹{totals.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="text-on-surface">₹{totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-on-surface">{totals.shipping === 0 ? "Free" : `₹${totals.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-on-surface pt-2 border-t border-outline-variant">
                <span>Total</span>
                <span>₹{totals.grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <p className="font-caption text-on-surface-variant mt-4">
              {order.paymentMethod === "cod" ? "Cash on delivery" : "Card"} ·{" "}
              {order.paymentStatus === "paid" ? "Paid" : order.paymentStatus === "failed" ? "Payment failed" : "Awaiting payment"}
            </p>
          </section>

          <section className="bg-surface-container-low rounded-2xl p-6">
            <h2 className="flex items-center gap-2 font-headline-md text-headline-md mb-4">
              <MapPin size={20} className="text-primary" /> Shipping to
            </h2>
            <p className="font-body-md text-on-surface">
              {addr.street}
              <br />
              {addr.city}, {addr.state} {addr.postalCode}
              <br />
              {addr.country}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
