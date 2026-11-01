'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
  const { items, isCartOpen, setCartOpen, removeItem, updateQuantity, getTotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-[448px] bg-surface border-l border-outline-variant shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-outline-variant">
              <h2 className="font-headline-lg text-on-surface flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" /> Your Cart
              </h2>
              <button 
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                  <ShoppingBag className="w-16 h-16 mb-4 text-on-surface-variant" />
                  <p className="font-headline-sm mb-2 text-on-surface">Your cart is empty.</p>
                  <p className="font-body-md text-on-surface-variant">Looks like you haven&apos;t added anything yet.</p>
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="mt-8 text-primary font-label-md hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
                    <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-surface-container shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs opacity-50">No Img</div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h4 className="font-label-md text-on-surface line-clamp-2 pr-2">{item.name}</h4>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-on-surface-variant hover:text-error transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <p className="font-label-md text-primary font-bold">₹{item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-3 bg-surface border border-outline-variant rounded-full px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface"
                          >
                            -
                          </button>
                          <span className="font-label-md min-w-[1ch] text-center text-on-surface">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-surface-container-lowest border-t border-outline-variant">
                <div className="flex justify-between mb-2">
                  <span className="font-body-md text-on-surface-variant">Subtotal</span>
                  <span className="font-label-md text-on-surface">₹{getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="font-body-md text-on-surface-variant">Shipping</span>
                  <span className="font-label-md text-on-surface">Calculated at checkout</span>
                </div>
                <button 
                  onClick={() => {
                    setCartOpen(false);
                    if (isAuthenticated) {
                      router.push('/checkout');
                    } else {
                      router.push('/login?redirect=/checkout');
                    }
                  }}
                  className="w-full bg-primary text-on-primary py-4 rounded-xl font-label-md flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-all hover:gap-3 group shadow-lg shadow-primary/20"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
