"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProductImage from "@/components/products/ProductImage";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, CreditCard, Loader2, MapPin, Truck, Tag, X, Package, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { api, getErrorMessage } from "@/lib/api";
import { useCartStore, CartItem } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useGamificationStore } from "@/store/gamificationStore";
import { useIsClient } from "@/lib/useIsClient";
import { useLenis } from "@studio-freight/react-lenis";
import {
  openRazorpayCheckout,
  loadRazorpayCheckout,
  RazorpayDismissedError,
  type RazorpaySession,
} from "@/lib/razorpay";

interface ServerCartItem {
  product: { _id: string; name: string; price: number; images: string[]; stock: number; isActive: boolean };
  quantity: number;
}

interface ServerCart {
  items: ServerCartItem[];
  couponCode?: string | null;
  totals: { subtotal: number; discount: number; tax: number; shipping: number; grandTotal: number };
}

interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface PlacedOrder {
  _id: string;
  trackingNumber: string;
  totals: { grandTotal: number };
}

type PaymentMethod = "cod" | "razorpay";

const emptyAddress: Address = { street: "", city: "", state: "", postalCode: "", country: "India" };

const inputClass =
  "w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors";

const productIdOf = (item: ServerCartItem) =>
  typeof item.product === "object" ? item.product._id : String(item.product);

// Make the server cart match the local cart, returning messages for items that couldn't be added
const syncCartToServer = async (localItems: CartItem[]): Promise<{ cart: ServerCart; issues: string[] }> => {
  const issues: string[] = [];
  const server: ServerCart = (await api.get("/cart")).data.data.cart;
  const serverQty = new Map(server.items.map((i) => [productIdOf(i), i.quantity]));
  const localIds = new Set(localItems.map((i) => i.id));

  for (const id of serverQty.keys()) {
    if (!localIds.has(id)) await api.delete(`/cart/${id}`);
  }

  for (const item of localItems) {
    try {
      const existing = serverQty.get(item.id);
      if (existing === undefined) {
        await api.post("/cart", { productId: item.id, quantity: item.quantity });
      } else if (existing !== item.quantity) {
        await api.put(`/cart/${item.id}`, { quantity: item.quantity });
      }
    } catch (err) {
      issues.push(`${item.name}: ${getErrorMessage(err, "could not be added")}`);
    }
  }

  const cart: ServerCart = (await api.get("/cart")).data.data.cart;
  return { cart, issues };
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const { coupons: rewardCoupons, fetchRewards } = useGamificationStore();
  const availableRewardCoupons = rewardCoupons.filter((c) => c.status === "available");

  const hydrated = useIsClient();
  // Pausing Lenis while the Razorpay overlay is open keeps its iframe clickable.
  const lenis = useLenis();
  const [cart, setCart] = useState<ServerCart | null>(null);
  const [syncing, setSyncing] = useState(true);
  const [syncError, setSyncError] = useState("");
  const syncStarted = useRef(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [newAddress, setNewAddress] = useState<Address>(emptyAddress);
  const [saveAddress, setSaveAddress] = useState(true);

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  // Set once the order exists, so a declined card can be retried without placing a second order
  const [pendingOrder, setPendingOrder] = useState<PlacedOrder | null>(null);
  const [completedOrder, setCompletedOrder] = useState<PlacedOrder | null>(null);

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.replace("/login?redirect=/checkout");
  }, [hydrated, isAuthenticated, router]);

  // Fetch checkout.js up front once card is selected, so pressing Pay opens the overlay
  // immediately instead of waiting on a network round trip. Failures surface at pay time.
  useEffect(() => {
    if (paymentMethod === "razorpay" || pendingOrder) {
      loadRazorpayCheckout().catch(() => {});
    }
  }, [paymentMethod, pendingOrder]);

  useEffect(() => {
    const localItems = useCartStore.getState().items;
    if (!hydrated || !isAuthenticated || syncStarted.current || localItems.length === 0) return;
    syncStarted.current = true;

    const load = async () => {
      try {
        const [{ cart: serverCart, issues }, addressRes] = await Promise.all([
          syncCartToServer(localItems),
          api.get("/users/addresses").catch(() => null),
        ]);

        setCart(serverCart);
        issues.forEach((msg) => toast.error(msg));

        // Mirror the server cart locally so prices and quantities match what will be charged
        useCartStore.setState({
          items: serverCart.items.map((i) => ({
            id: i.product._id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.images?.[0] || "",
          })),
        });

        fetchRewards().catch(() => {});

        const saved: Address[] = addressRes?.data?.data?.addresses ?? [];
        setAddresses(saved);
        if (saved.length > 0 && saved[0]._id) setSelectedAddressId(saved[0]._id);
      } catch (err) {
        setSyncError(getErrorMessage(err, "Failed to load your cart. Please try again."));
      } finally {
        setSyncing(false);
      }
    };
    load();
  }, [hydrated, isAuthenticated, fetchRewards]);

  const applyCoupon = async (code: string) => {
    if (!code) return;
    setCouponLoading(true);
    try {
      const res = await api.post("/cart/apply-coupon", { code });
      setCart(res.data.data.cart);
      setCouponCode("");
      toast.success("Coupon applied");
    } catch (err) {
      toast.error(getErrorMessage(err, "Invalid coupon code."));
    } finally {
      setCouponLoading(false);
    }
  };

  // Called from a button and the input's Enter key; preventDefault stops Enter from submitting the order form
  const handleApplyCoupon = (e: React.SyntheticEvent) => {
    e.preventDefault();
    applyCoupon(couponCode.trim());
  };

  const handleRemoveCoupon = async () => {
    setCouponLoading(true);
    try {
      const res = await api.post("/cart/remove-coupon");
      setCart(res.data.data.cart);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to remove coupon."));
    } finally {
      setCouponLoading(false);
    }
  };

  /**
   * Opens Razorpay Checkout for an order that already exists server-side, then has the
   * server verify the result. Returns false (with `error` set) if anything went wrong, so
   * the caller can keep the order around for a retry instead of placing a second one.
   */
  const payWithRazorpay = async (order: PlacedOrder): Promise<boolean> => {
    try {
      const res = await api.post(`/payments/razorpay/order/${order._id}`);
      const session: RazorpaySession = res.data.data;

      const handles = await openRazorpayCheckout(session, {
        description: `Order ${order._id.slice(-8).toUpperCase()}`,
        prefill: { name: user?.name, email: user?.email },
        pauseScroll: () => lenis?.stop(),
        resumeScroll: () => lenis?.start(),
      });

      // Only the server may decide an order is paid: it re-checks the signature and the
      // captured amount against the stored total before releasing anything.
      await api.post("/payments/razorpay/verify", { orderId: order._id, ...handles });
      return true;
    } catch (err) {
      if (err instanceof RazorpayDismissedError) {
        setError(
          "Payment was cancelled. Your order is saved \u2014 use Retry Payment when you're ready."
        );
      } else if (axios.isAxiosError(err) && err.response?.status === 503) {
        setError(
          "Card payments are unavailable right now. You can place this order as Cash on Delivery instead."
        );
      } else if (err instanceof Error && !axios.isAxiosError(err)) {
        setError(err.message);
      } else {
        setError(getErrorMessage(err, "Payment failed. Please try again."));
      }
      return false;
    }
  };

  const completeOrder = (order: PlacedOrder) => {
    useCartStore.getState().clearCart();
    // The order used up any reward coupon and earned a new scratch card
    fetchRewards().catch(() => {});
    setCompletedOrder(order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPlacing(true);

    try {
      // Retrying payment for an order that already exists
      if (pendingOrder) {
        if (await payWithRazorpay(pendingOrder)) completeOrder(pendingOrder);
        return;
      }

      const shippingAddress =
        selectedAddressId === "new"
          ? newAddress
          : addresses.find((a) => a._id === selectedAddressId) ?? newAddress;
      const { street, city, state, postalCode, country } = shippingAddress;

      if (selectedAddressId === "new" && saveAddress) {
        await api
          .post("/users/addresses", { street, city, state, postalCode, country })
          .catch(() => toast.error("Couldn't save the address for next time, continuing with your order."));
      }

      const res = await api.post("/orders/checkout", {
        paymentMethod,
        shippingAddress: { street, city, state, postalCode, country },
      });
      const order: PlacedOrder = res.data.data.order;

      if (paymentMethod === "razorpay") {
        if (!(await payWithRazorpay(order))) {
          // If payment was not completed: cancel the unpaid order immediately so it doesn't get placed!
          await api.post(`/orders/${order._id}/cancel`).catch(() => {});
          setPendingOrder(null);
          // Keep user's cart completely intact so they can retry without losing their items!
          setPlacing(false);
          return;
        }
      }

      completeOrder(order);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to place your order. Please try again."));
    } finally {
      setPlacing(false);
    }
  };

  // An empty local cart has nothing to sync, so it skips straight to the empty state
  if (!hydrated || !isAuthenticated || (syncing && items.length > 0)) {
    return (
      <div className="min-h-[60svh] flex items-center justify-center gap-3 text-on-surface-variant">
        <Loader2 className="animate-spin" /> Preparing checkout...
      </div>
    );
  }

  if (completedOrder) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[576px] mx-auto px-4 py-20 text-center"
      >
        <CheckCircle2 className="mx-auto text-[#00C853] mb-6" size={64} />
        <h1 className="font-headline-xl text-on-surface mb-3">Order confirmed!</h1>
        <p className="text-on-surface-variant mb-8">
          Thank you for shopping with us. We&apos;ll email you when your order ships.
        </p>
        <div className="bg-surface-container-low rounded-2xl p-6 text-left space-y-3 mb-8">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Order number</span>
            <span className="font-bold">{completedOrder._id.slice(-8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Tracking number</span>
            <span className="font-bold">{completedOrder.trackingNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Total</span>
            <span className="font-bold">₹{completedOrder.totals.grandTotal.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href={`/orders/${completedOrder._id}`}
            className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-7 py-3.5 rounded-xl font-label-md hover:opacity-90 shadow-lg shadow-primary/20 transition-all"
          >
            <Package size={18} /> View Order Details
          </Link>
          <Link
            href="/orders"
            className="inline-flex items-center justify-center gap-2 border border-outline-variant text-on-surface px-7 py-3.5 rounded-xl font-label-md hover:border-primary hover:text-primary transition-all"
          >
            My Orders Dashboard
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 border border-outline-variant text-on-surface-variant px-6 py-3.5 rounded-xl font-label-md hover:border-primary hover:text-primary transition-all"
          >
            Continue Shopping
          </Link>
        </div>
        <p className="text-xs text-on-surface-variant mt-8">
          You can track shipping updates and invoices anytime in the{" "}
          <Link href="/orders" className="text-primary font-semibold underline underline-offset-4 hover:opacity-80">
            My Orders
          </Link>{" "}
          dashboard.
        </p>
      </motion.div>
    );
  }

  if (!pendingOrder && (syncError || !cart || items.length === 0 || cart.items.length === 0)) {
    return (
      <div className="min-h-[60svh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-4">{syncError ? "Something went wrong" : "Your cart is empty"}</h1>
        <p className="text-on-surface-variant mb-8">{syncError || "Add some products before checking out."}</p>
        <Link href={syncError ? "/cart" : "/products"} className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md">
          {syncError ? "Back to Cart" : "Browse Products"}
        </Link>
      </div>
    );
  }

  const totals = cart?.totals;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 pb-28 md:pb-12">
      <h1 className="font-headline-xl text-on-surface mb-10">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {pendingOrder ? (
            <div className="p-4 rounded-xl border border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Your order <strong>{pendingOrder._id.slice(-8).toUpperCase()}</strong> has been placed and is awaiting
              payment. Enter your card details again to complete it.
            </div>
          ) : (
            <section className="bg-surface-container-low rounded-2xl p-6">
              <h2 className="flex items-center gap-2 font-headline-md text-headline-md mb-6">
                <MapPin size={20} className="text-primary" /> Shipping Address
              </h2>

              {addresses.length > 0 && (
                <div className="space-y-3 mb-6">
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`flex gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                        selectedAddressId === addr._id ? "border-primary bg-primary/5" : "border-outline-variant"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id!)}
                        className="accent-[var(--color-primary)]"
                      />
                      <span className="text-on-surface font-body-md">
                        {addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                      </span>
                    </label>
                  ))}
                  <label
                    className={`flex gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      selectedAddressId === "new" ? "border-primary bg-primary/5" : "border-outline-variant"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === "new"}
                      onChange={() => setSelectedAddressId("new")}
                      className="accent-[var(--color-primary)]"
                    />
                    <span className="text-on-surface font-body-md">Use a new address</span>
                  </label>
                </div>
              )}

              {selectedAddressId === "new" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    required
                    placeholder="Street address"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className={`${inputClass} sm:col-span-2`}
                    autoComplete="street-address"
                  />
                  <input
                    required
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className={inputClass}
                    autoComplete="address-level2"
                  />
                  <input
                    required
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className={inputClass}
                    autoComplete="address-level1"
                  />
                  <input
                    required
                    placeholder="Postal code"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    className={inputClass}
                    autoComplete="postal-code"
                  />
                  <input
                    required
                    placeholder="Country"
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    className={inputClass}
                    autoComplete="country-name"
                  />
                  <label className="flex items-center gap-2 text-on-surface-variant font-caption sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="accent-[var(--color-primary)]"
                    />
                    Save this address for next time
                  </label>
                </div>
              )}
            </section>
          )}

          <section className="bg-surface-container-low rounded-2xl p-6">
            <h2 className="flex items-center gap-2 font-headline-md text-headline-md mb-6">
              <CreditCard size={20} className="text-primary" /> Payment
            </h2>

            {!pendingOrder && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { value: "cod" as const, label: "Cash on Delivery", icon: Truck },
                  {
                    value: "razorpay" as const,
                    label: "Card / UPI / Netbanking",
                    icon: CreditCard,
                  },
                ].map(({ value, label, icon: Icon }) => (
                  <label
                    key={value}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === value ? "border-primary bg-primary/5" : "border-outline-variant"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === value}
                      onChange={() => setPaymentMethod(value)}
                      className="accent-[var(--color-primary)]"
                    />
                    <Icon size={18} className="text-on-surface-variant" />
                    <span className="text-on-surface font-body-md">{label}</span>
                  </label>
                ))}
              </div>
            )}

            {(paymentMethod === "razorpay" || pendingOrder) && (
              <div className="border-outline-variant/60 bg-surface rounded-xl border p-4">
                <p className="text-on-surface font-body-md mb-1">
                  You&apos;ll pay securely through Razorpay.
                </p>
                <p className="text-on-surface-variant font-caption">
                  Pressing {pendingOrder ? '"Retry Payment"' : '"Place Order & Pay"'} opens
                  Razorpay&apos;s secure window, where you can pay by card, UPI, netbanking or
                  wallet. Your card details go straight to Razorpay and are never sent to or
                  stored by this store.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Order summary */}
        <aside className="bg-surface-container-low rounded-2xl p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-headline-md text-headline-md mb-6">Order Summary</h2>

          {!pendingOrder && cart && (
            <>
              <ul className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <li key={item.product._id} className="flex gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-surface-container-high shrink-0">
                      {item.product.images?.[0] && (
                        <ProductImage src={item.product.images[0]} alt="" fill sizes="56px" className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body-md text-on-surface line-clamp-1">{item.product.name}</p>
                      <p className="font-caption text-on-surface-variant">Qty {item.quantity}</p>
                    </div>
                    <span className="font-body-md text-on-surface">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              {cart.couponCode ? (
                <div className="flex items-center justify-between bg-primary/10 text-primary rounded-xl px-4 py-3 mb-6">
                  <span className="flex items-center gap-2 font-label-md">
                    <Tag size={16} /> {cart.couponCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    disabled={couponLoading}
                    aria-label="Remove coupon"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mb-6">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleApplyCoupon(e);
                    }}
                    placeholder="Coupon code"
                    className={`${inputClass} py-2`}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 rounded-xl border border-outline-variant font-label-md hover:border-primary disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
              )}

              {!cart.couponCode && availableRewardCoupons.length > 0 && (
                <div className="mb-6 -mt-3">
                  <p className="font-caption text-on-surface-variant mb-2">Your reward coupons</p>
                  <div className="flex flex-wrap gap-2">
                    {availableRewardCoupons.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => applyCoupon(c.code)}
                        disabled={couponLoading}
                        title={c.minOrderValue > 0 ? `Min. order ₹${c.minOrderValue}` : undefined}
                        className="flex items-center gap-1.5 text-xs font-label-md border border-dashed border-primary/60 text-primary rounded-lg px-2.5 py-1.5 hover:bg-primary/10 disabled:opacity-50"
                      >
                        <Tag size={12} /> {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {pendingOrder ? (
            <div className="flex justify-between text-lg font-bold border-t border-outline-variant pt-4 mb-6">
              <span>Amount due</span>
              <span>₹{pendingOrder.totals.grandTotal.toFixed(2)}</span>
            </div>
          ) : (
            totals && (
              <div className="space-y-3 text-on-surface-variant font-body-md border-t border-outline-variant pt-4 mb-6">
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
                {totals.tax > 0 && (
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="text-on-surface">₹{totals.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-on-surface font-medium text-[#00C853]">
                    {totals.shipping === 0 ? "Free (Inclusive)" : `₹${totals.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-on-surface pt-3 border-t border-outline-variant">
                  <span>Total</span>
                  <span>₹{totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            )
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={placing}
            className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-4 rounded-xl font-label-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {placing && <Loader2 size={18} className="animate-spin" />}
            {pendingOrder ? "Retry Payment" : paymentMethod === "cod" ? "Place Order" : "Place Order & Pay"}
          </button>
        </aside>
      </form>
    </div>
  );
}
