"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Loader2, Package } from "lucide-react";
import { api, getErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useIsClient } from "@/lib/useIsClient";
import { Order, ORDER_STATUS_STYLES, needsPayment, shortOrderId } from "@/lib/orders";

const PAGE_SIZE = 10;

export default function OrdersPage() {
  const router = useRouter();
  const isClient = useIsClient();
  const { isAuthenticated } = useAuthStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isClient && !isAuthenticated) router.replace("/login?redirect=/orders");
  }, [isClient, isAuthenticated, router]);

  useEffect(() => {
    if (!isClient || !isAuthenticated) return;
    let cancelled = false;

    api
      .get("/orders/history", { params: { page, limit: PAGE_SIZE } })
      .then((res) => {
        if (cancelled) return;
        setOrders(res.data.data.orders);
        setPages(Math.max(res.data.data.pages, 1));
        setError("");
      })
      .catch((err) => !cancelled && setError(getErrorMessage(err, "Failed to load your orders.")))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [isClient, isAuthenticated, page]);

  const goToPage = (next: number) => {
    setLoading(true);
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isClient || !isAuthenticated || loading) {
    return (
      <div className="min-h-[60svh] flex items-center justify-center gap-3 text-on-surface-variant">
        <Loader2 className="animate-spin" /> Loading your orders...
      </div>
    );
  }

  return (
    <div className="w-full max-w-[896px] mx-auto px-4 py-12 pb-28 md:pb-12">
      <h1 className="font-headline-xl text-on-surface mb-10">My Orders</h1>

      {error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-low rounded-2xl">
          <Package className="mx-auto mb-4 text-on-surface-variant" size={48} />
          <p className="text-on-surface-variant mb-6">You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md">
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {orders.map((order, idx) => {
              const status = ORDER_STATUS_STYLES[order.orderStatus];
              const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
              return (
                <motion.li
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Link
                    href={`/orders/${order._id}`}
                    className="flex items-center gap-4 bg-surface-container-low rounded-2xl p-5 hover:bg-surface-container transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-on-surface">Order {shortOrderId(order._id)}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${status.className}`}>
                          {status.label}
                        </span>
                        {needsPayment(order) && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-500">
                            Payment needed
                          </span>
                        )}
                      </div>
                      <p className="font-caption text-on-surface-variant line-clamp-1">
                        {new Date(order.createdAt).toLocaleDateString()} · {itemCount} item{itemCount === 1 ? "" : "s"} ·{" "}
                        {order.items.map((i) => i.name).join(", ")}
                      </p>
                    </div>
                    <span className="font-bold text-on-surface whitespace-nowrap">
                      ₹{order.totals.grandTotal.toFixed(2)}
                    </span>
                    <ChevronRight className="text-on-surface-variant shrink-0" size={20} />
                  </Link>
                </motion.li>
              );
            })}
          </ul>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 rounded-xl border border-outline-variant font-label-md disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-on-surface-variant font-caption">
                Page {page} of {pages}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= pages}
                className="px-4 py-2 rounded-xl border border-outline-variant font-label-md disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
