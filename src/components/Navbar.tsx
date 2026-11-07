'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { ShoppingCart, LogOut, Search, Heart, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { setCartOpen, items } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const [searchOpen, setSearchOpen] = useState(false);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 transition-all duration-200 ease-in-out"
    >
      <div className="flex justify-between items-center px-4 md:px-6 py-4 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label="NOVARIX Home">
            <Image
              src="/logo-dark.png"
              alt="NOVARIX"
              width={160}
              height={50}
              priority
              className="h-9 md:h-11 w-auto object-contain hidden dark:block transition-transform duration-200 group-hover:scale-105"
            />
            <Image
              src="/logo-light.png"
              alt="NOVARIX"
              width={160}
              height={50}
              priority
              className="h-9 md:h-11 w-auto object-contain block dark:hidden transition-transform duration-200 group-hover:scale-105"
            />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/products" className="font-body-md text-on-surface-variant hover:text-primary transition-colors duration-300">
              Products
            </Link>
            <Link href="/deals" className="font-body-md text-on-surface-variant hover:text-primary transition-colors duration-300">
              Deals
            </Link>
            <Link href="/rewards" className="font-body-md text-on-surface-variant hover:text-primary transition-colors duration-300">
              Rewards
            </Link>
            <Link href="/about" className="font-body-md text-on-surface-variant hover:text-primary transition-colors duration-300">
              About Us
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {pathname === '/products' && (
            <div className="flex relative">
              <div className={`flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant transition-all ${searchOpen ? 'w-48 md:w-64' : 'w-10 md:w-48'} overflow-hidden`}>
                <Search className="text-on-surface-variant text-[20px] w-5 h-5 flex-shrink-0 mr-2 cursor-pointer" onClick={() => setSearchOpen(true)} />
                <input 
                  className={`bg-transparent border-none focus:ring-0 text-label-md w-full outline-none placeholder:text-on-surface-variant/70 text-on-surface ${!searchOpen ? 'hidden md:block' : 'block'}`} 
                  placeholder="Search..." 
                  type="text"
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setSearchOpen(false)}
                />
              </div>
            </div>
          )}

          <ThemeToggle />
          
          <Link 
            href="/wishlist"
            className="relative text-on-surface-variant hover:text-primary transition-colors"
          >
            <Heart className="w-5 h-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <button 
            onClick={() => setCartOpen(true)}
            className="relative text-on-surface-variant hover:text-primary transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </button>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/orders"
                title="My Orders"
                aria-label="My Orders"
                className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-primary-container flex items-center justify-center hover:ring-2 hover:ring-primary transition-all"
              >
                <span className="text-on-primary-container font-label-md">{user?.name?.charAt(0).toUpperCase()}</span>
              </Link>
              <button 
                onClick={() => logout()}
                className="text-on-surface-variant hover:text-primary transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all"
              >
                <User className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
