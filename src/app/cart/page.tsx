"use client";

import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useGamificationStore } from "@/store/gamificationStore";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import ProductImage from "@/components/products/ProductImage";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const { coupons, fetchRewards } = useGamificationStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const availableCoupons = coupons.filter((c) => c.status === "available");

  // Coupons are applied by the server at checkout, so the cart only shows the subtotal
  const subtotal = getTotal();

  useEffect(() => {
    if (isAuthenticated) fetchRewards().catch(() => {});
  }, [isAuthenticated, fetchRewards]);

  return (
    <div className="min-h-below-nav pt-12 pb-24 px-4 bg-zinc-50 dark:bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-10 text-black dark:text-white"
        >
          Your Cart
        </motion.h1>

        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5"
          >
            <p className="text-gray-500 text-xl mb-6">Your cart is currently empty.</p>
            <Link 
              href="/products"
              className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform"
            >
              Start Shopping <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5"
                >
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0">
                    <ProductImage sizes="128px" src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-black dark:text-white">{item.name}</h3>
                        <p className="text-accent font-medium">₹{item.price.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-100 dark:bg-zinc-800 w-fit rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 h-fit sticky top-24"
            >
              <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Discounts, tax & shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-white/10 pt-4 mb-8">
                <div className="flex justify-between items-center text-xl font-bold text-black dark:text-white">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>

              {availableCoupons.length > 0 && (
                <div className="mb-8">
                  <p className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
                    Your reward coupons (apply at checkout)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableCoupons.map((c) => (
                      <span
                        key={c.code}
                        className="text-xs font-medium bg-gray-100 dark:bg-zinc-800 border border-dashed border-gray-300 dark:border-zinc-600 rounded-lg px-2.5 py-1"
                      >
                        {c.label} · {c.code}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    router.push('/checkout');
                  } else {
                    router.push('/login?redirect=/checkout');
                  }
                }}
                className="w-full bg-accent text-black font-bold text-lg py-4 rounded-xl flex items-center justify-center hover:scale-[1.02] transition-transform"
              >
                Proceed to Checkout
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
