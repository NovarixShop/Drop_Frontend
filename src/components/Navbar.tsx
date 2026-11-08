'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import {
  ShoppingCart,
  LogOut,
  Search,
  Heart,
  User,
  Package,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { setCartOpen, items } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setUserMenuOpen(false);
  }

  const navLinks = [
    { label: 'Products', href: '/products' },
    { label: 'Deals', href: '/deals' },
    { label: 'Rewards', href: '/rewards' },
    { label: 'My Orders', href: '/orders' },
    { label: 'About Us', href: '/about' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full bg-surface/85 backdrop-blur-xl border-b border-outline-variant/30 transition-all duration-200 ease-in-out"
    >
      <div className="flex justify-between items-center px-4 md:px-6 py-3.5 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8 lg:gap-10">
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
          <div className="hidden md:flex items-center gap-5 lg:gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-body-md transition-colors duration-200 relative py-1 ${
                    isActive
                      ? 'text-primary font-semibold'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {link.label}
                  {link.label === 'My Orders' && (
                    <span className="ml-1 inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
                      Track
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          {pathname === '/products' && (
            <div className="flex relative">
              <div className={`flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant transition-all ${searchOpen ? 'w-48 md:w-64' : 'w-10 md:w-48'} overflow-hidden`}>
                <Search className="text-on-surface-variant text-[20px] w-5 h-5 flex-shrink-0 mr-2 cursor-pointer" onClick={() => setSearchOpen(true)} />
                <input 
                  className={`bg-transparent border-none focus:ring-0 text-label-md w-full outline-none placeholder:text-on-surface-variant/70 text-on-surface ${!searchOpen ? 'hidden md:block' : 'block'}`} 
                  placeholder="Search products..." 
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
            className="relative p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <button 
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all"
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in">
                {cartItemCount}
              </span>
            )}
          </button>
          
          {/* User Account Menu with interactive Dropdown */}
          <div className="relative" ref={userMenuRef}>
            {isAuthenticated ? (
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-full border border-outline-variant/60 bg-surface-container-low hover:border-primary/50 transition-all cursor-pointer focus:outline-none"
                aria-label="Account menu"
              >
                <div className="w-7 h-7 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline-block font-label-md text-xs text-on-surface max-w-[90px] truncate">
                  {user?.name?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-on-surface-variant transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 p-2 rounded-full border border-outline-variant/60 bg-surface-container text-on-surface-variant hover:text-primary hover:border-primary transition-all focus:outline-none"
                aria-label="Sign In or Register"
                title="Account"
              >
                <User className="w-4 h-4" />
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            )}

            {/* Dropdown Menu */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                >
                  {isAuthenticated ? (
                    <>
                      {/* User Header */}
                      <div className="px-3.5 py-3 border-b border-outline-variant/30 mb-1.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-xs text-on-surface truncate">
                              {user?.name || 'Customer'}
                            </p>
                            <p className="text-[11px] text-on-surface-variant truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Prominent My Orders Item */}
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 text-on-surface hover:text-primary transition-colors group mb-0.5"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          <Package className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs flex items-center justify-between">
                            <span>My Orders</span>
                            <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-primary/15 text-primary">Track</span>
                          </p>
                          <p className="text-[10px] text-on-surface-variant truncate">
                            History, status & invoices
                          </p>
                        </div>
                      </Link>

                      {/* Wishlist */}
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container text-on-surface hover:text-primary transition-colors group mb-0.5"
                      >
                        <div className="w-8 h-8 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0 group-hover:text-primary">
                          <Heart className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs flex items-center justify-between">
                            <span>Wishlist</span>
                            {wishlistItems.length > 0 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface font-bold">
                                {wishlistItems.length}
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-on-surface-variant truncate">Saved favorites</p>
                        </div>
                      </Link>

                      {/* Rewards */}
                      <Link
                        href="/rewards"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container text-on-surface hover:text-primary transition-colors group mb-1.5"
                      >
                        <div className="w-8 h-8 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0 group-hover:text-amber-500">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs">Rewards & Coupons</p>
                          <p className="text-[10px] text-on-surface-variant truncate">Scratch cards & discounts</p>
                        </div>
                      </Link>

                      {/* Divider & Logout */}
                      <div className="border-t border-outline-variant/30 pt-1.5">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-500 hover:bg-red-500/10 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-3.5 py-3 border-b border-outline-variant/30 mb-2">
                        <p className="font-bold text-xs text-on-surface">Welcome to NOVARIX</p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">
                          Sign in to manage orders and rewards.
                        </p>
                      </div>

                      <div className="p-1 space-y-1">
                        <Link
                          href="/login"
                          className="w-full flex items-center justify-center bg-primary text-on-primary py-2 px-3 rounded-xl font-label-md text-xs hover:opacity-90 transition-opacity"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          className="w-full flex items-center justify-center border border-outline-variant text-on-surface py-2 px-3 rounded-xl font-label-md text-xs hover:border-primary hover:text-primary transition-colors"
                        >
                          Create Account
                        </Link>
                      </div>

                      <div className="border-t border-outline-variant/30 mt-2 pt-2">
                        <Link
                          href="/orders"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                        >
                          <Package className="w-4 h-4 text-primary" />
                          <span>Track My Order</span>
                        </Link>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

