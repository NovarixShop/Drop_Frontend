export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  shippingAddress: { street: string; city: string; state: string; postalCode: string; country: string };
  totals: { subtotal: number; discount: number; tax: number; shipping: number; grandTotal: number };
  // "stripe"/"paypal" only appear on orders placed before the Razorpay switch.
  paymentMethod: "razorpay" | "cod" | "stripe" | "paypal";
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber: string;
  createdAt: string;
}

export const ORDER_STATUS_STYLES: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  processing: { label: "Payment Done", className: "bg-[#00C853]/15 text-[#00C853]" },
  shipped: { label: "Shipped", className: "bg-primary/15 text-primary" },
  delivered: { label: "Delivered", className: "bg-[#00C853]/15 text-[#00C853]" },
  cancelled: { label: "Cancelled", className: "bg-red-500/15 text-red-500" },
};

export const getOrderStatusDisplay = (order: Order): { label: string; className: string } => {
  if (order.orderStatus === "cancelled") {
    return { label: "Cancelled", className: "bg-red-500/15 text-red-500" };
  }
  if (order.orderStatus === "delivered") {
    return { label: "Delivered", className: "bg-[#00C853]/15 text-[#00C853]" };
  }
  if (order.orderStatus === "shipped") {
    return { label: "Shipped", className: "bg-primary/15 text-primary" };
  }
  if (order.paymentStatus === "paid" || order.orderStatus === "processing") {
    if (order.paymentMethod === "cod" && order.paymentStatus !== "paid") {
      return { label: "Order Confirmed", className: "bg-blue-500/15 text-blue-400" };
    }
    return { label: "Payment Done", className: "bg-[#00C853]/15 text-[#00C853]" };
  }
  if (order.orderStatus === "pending") {
    return { label: "Pending", className: "bg-amber-500/15 text-amber-600 dark:text-amber-400" };
  }
  return { label: "Payment Done", className: "bg-[#00C853]/15 text-[#00C853]" };
};

export const shortOrderId = (id: string) => id.slice(-8).toUpperCase();

// Online orders whose payment didn't go through can still be paid until they're cancelled.
// Anything that isn't COD is a gateway order, which keeps legacy "stripe" orders payable.
export const needsPayment = (order: Order) =>
  order.paymentMethod !== "cod" &&
  order.paymentStatus !== "paid" &&
  order.orderStatus !== "cancelled";
