'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Banknote,
  CreditCard,
  Wallet,
} from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
  badge?: string;
  badgeType?: 'hot' | 'track';
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const navigationSections: FooterSection[] = [
  {
    title: 'SHOP',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'Trending Deals', href: '/deals', badge: 'HOT', badgeType: 'hot' },
      { label: 'Categories', href: '/categories' },
      { label: 'Rewards & Coupons', href: '/rewards' },
      { label: 'Wishlist', href: '/wishlist' },
    ],
  },
  {
    title: 'MY ACCOUNT',
    links: [
      { label: 'My Orders', href: '/orders', badge: 'Track', badgeType: 'track' },
      { label: 'Order Tracking', href: '/orders' },
      { label: 'Shopping Cart', href: '/cart' },
      { label: 'Sign In', href: '/login' },
      { label: 'Create Account', href: '/register' },
    ],
  },
  {
    title: 'CUSTOMER CARE',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping Policy', href: '/shipping' },
      { label: 'Returns & Refunds', href: '/returns' },
      { label: 'Help & FAQs', href: '/contact' },
    ],
  },
  {
    title: 'COMPANY',
    links: [
      { label: 'About NOVARIX', href: '/about' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Merchant Portal', href: 'https://admin.novarixshop.tech', external: true },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('Thank you for subscribing! Check your inbox for exclusive perks.');
    setEmail('');
  };

  return (
    <footer className="relative z-10 w-full bg-[#06070B] text-zinc-300 border-t border-white/[0.08] pb-28 md:pb-8 pt-16 md:pt-20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12">
        {/* Main Grid: Left Brand & Newsletter + Right 4 Nav Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left Column: Logo + Mission + Newsletter */}
          <div className="lg:col-span-5 max-w-md">
            {/* Logo Emblem */}
            <Link href="/" className="inline-block group" aria-label="NOVARIX Home">
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border border-white/10 bg-black/50 shadow-md">
                <Image
                  src="/logo-dark-full.jpg"
                  alt="NOVARIX"
                  fill
                  sizes="64px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Brand Mission Statement */}
            <p className="mt-5 text-xs md:text-sm text-zinc-400 leading-relaxed max-w-sm">
              NOVARIX is your curated destination for modern technology, everyday luxury, and lifestyle essentials. Engineered for precision, crafted to inspire.
            </p>

            {/* Newsletter */}
            <div className="mt-8 md:mt-10 max-w-sm">
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-white mb-2">
                STAY IN THE LOOP
              </span>
              <p className="text-xs text-zinc-400 mb-4 leading-normal">
                Subscribe for exclusive drops, private sale access, and reward coupons.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 p-3 rounded-full bg-[#00C853]/10 border border-[#00C853]/30 text-[#00C853] text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You&apos;re subscribed! Welcome to NOVARIX.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative">
                  <div className="flex items-center rounded-full bg-[#10121A] border border-white/10 p-1.5 focus-within:border-indigo-400/60 transition-colors">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="min-w-0 flex-1 bg-transparent px-3.5 py-1.5 text-xs md:text-sm text-white placeholder-zinc-500 outline-none"
                    />
                    <button
                      type="submit"
                      aria-label="Subscribe to newsletter"
                      className="shrink-0 rounded-full bg-[#9D9EF8] hover:bg-[#B3B4FF] text-[#0C0D1E] px-4 py-2 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all shadow-sm active:scale-95"
                    >
                      <span>Join</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Columns: 4 Nav Columns (2 cols on mobile, 4 on desktop) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-8 pt-2 lg:pt-0">
            {navigationSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs md:text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                          <span>{link.label}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="inline-flex items-center gap-1.5 text-xs md:text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                          <span>{link.label}</span>
                          {link.badge && link.badgeType === 'hot' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 uppercase tracking-wider">
                              {link.badge}
                            </span>
                          )}
                          {link.badge && link.badgeType === 'track' && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Legal & Payment Icons Bar */}
        <div className="border-t border-white/[0.08] mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500 text-center sm:text-left">
            © 2025 NOVARIX Luxury Commerce. All rights reserved.
          </p>
          <div className="flex items-center gap-3.5 text-zinc-500">
            <span title="Cash on Delivery">
              <Banknote className="w-5 h-5 hover:text-zinc-300 transition-colors" />
            </span>
            <span title="Debit & Credit Cards">
              <CreditCard className="w-5 h-5 hover:text-zinc-300 transition-colors" />
            </span>
            <span title="Digital Wallets & UPI">
              <Wallet className="w-5 h-5 hover:text-zinc-300 transition-colors" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
