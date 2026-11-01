'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { Heart, HeartOff, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { items: wishlistItems, removeItem, clearWishlist } = useWishlistStore();
  const { addItem, setCartOpen } = useCartStore();

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 pt-24 pb-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="font-headline-lg text-4xl md:text-5xl font-bold text-on-surface mb-2">My Wishlist</h1>
            <p className="text-on-surface-variant font-body-md text-lg">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <button 
              onClick={() => {
                clearWishlist();
                toast('Wishlist cleared');
              }}
              className="px-6 py-3 border border-outline-variant rounded-full text-on-surface hover:border-primary hover:text-primary transition-all active:scale-95 font-label-md"
            >
              Clear Wishlist
            </button>
          )}
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {wishlistItems.map((product, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: (idx % 4) * 0.1, duration: 0.4 }}
                key={product.id} 
                className="product-card-hover group relative flex flex-col transition-all duration-500"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-surface-container-low rounded-2xl mb-6 soft-shadow">
                  <Link href={`/products/${product.slug}`}>
                    {product.image ? (
                      <Image 
                        src={product.image} 
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant/50">No Image</div>
                    )}
                  </Link>
                  
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      removeItem(product.id);
                      toast('Removed from Wishlist');
                    }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md flex items-center justify-center text-red-500 md:opacity-0 transform md:translate-y-4 transition-all duration-300 hover:bg-white dark:hover:bg-black hover:text-red-600 md:group-hover:opacity-100 md:group-hover:translate-y-0 z-20 active:scale-90"
                    title="Remove from wishlist"
                  >
                    <HeartOff className="w-5 h-5" />
                  </button>
                  
                  <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          quantity: 1,
                          image: product.image
                        });
                        removeItem(product.id);
                        toast.success(`${product.name} moved to cart`, {
                          action: {
                            label: 'View Cart',
                            onClick: () => setCartOpen(true)
                          },
                        });
                      }}
                      className="w-full bg-white text-black py-3 rounded-xl font-label-md hover:bg-primary hover:text-white transition-colors active:scale-95 shadow-lg flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" /> Move to Cart
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 flex-grow px-2">
                  <div className="flex justify-between items-start gap-4">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-body-md font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 bg-surface-container-low px-2 py-1 rounded-md">
                      <p className="font-label-md text-[#00C853] font-bold whitespace-nowrap">
                        ₹{product.price.toFixed(2)}
                      </p>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <p className="font-label-md text-on-surface-variant line-through whitespace-nowrap opacity-60 text-xs">
                          ₹{product.compareAtPrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-32 h-32 bg-surface-container-low rounded-full flex items-center justify-center mb-8 relative">
              <Heart className="w-12 h-12 text-on-surface-variant opacity-60" />
              <div className="absolute -bottom-2 -right-2 bg-surface rounded-full p-2">
                <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
            <h3 className="font-headline-lg mb-3 text-on-surface text-3xl font-bold">Your wishlist is empty</h3>
            <p className="text-on-surface-variant max-w-[420px] mx-auto mb-10 font-body-md text-lg">Save items you love to your wishlist. Review them anytime and easily move them to your cart when you&apos;re ready.</p>
            <Link 
              href="/products"
              className="px-8 py-4 bg-primary text-on-primary font-label-lg rounded-full hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center gap-3"
            >
              Explore Products
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
