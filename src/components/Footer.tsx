'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight, Mail, MapPin, Phone, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const linkGroups = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'Categories', href: '/categories' },
      { label: 'Deals', href: '/deals' },
      { label: 'Rewards', href: '/rewards' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'My Orders', href: '/orders' },
      { label: 'Wishlist', href: '/wishlist' },
      { label: 'Cart', href: '/cart' },
      { label: 'Sign In', href: '/login' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Create Account', href: '/register' },
    ],
  },
];

const perks = [
  { icon: Truck, label: 'Free shipping over ₹999' },
  { icon: RotateCcw, label: '7-day easy returns' },
  { icon: ShieldCheck, label: 'Secure payments' },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  return (
    // pb-28 on mobile keeps the last row clear of the fixed MobileBottomBar
    <footer className="relative z-10 w-full border-t border-outline-variant/30 bg-surface-container-lowest text-on-surface pb-28 md:pb-0">
      {/* Perks strip */}
      <div className="border-b border-outline-variant/30">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          {perks.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-sm text-on-surface-variant sm:justify-center">
              <Icon className="w-5 h-5 text-primary shrink-0" aria-hidden />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-12 md:py-16 grid grid-cols-2 md:grid-cols-12 gap-x-6 gap-y-10">
        {/* Brand + newsletter */}
        <div className="col-span-2 md:col-span-5">
          <Link href="/" className="inline-block group" aria-label="NOVARIX Home">
            <Image
              src="/logo-dark.png"
              alt="NOVARIX"
              width={160}
              height={48}
              className="h-10 md:h-12 w-auto object-contain hidden dark:block transition-transform duration-200 group-hover:scale-105"
            />
            <Image
              src="/logo-light.png"
              alt="NOVARIX"
              width={160}
              height={48}
              className="h-10 md:h-12 w-auto object-contain block dark:hidden transition-transform duration-200 group-hover:scale-105"
            />
          </Link>
          <p className="mt-3 text-sm text-on-surface-variant max-w-sm leading-relaxed">
            The silent precision of modern elegance. Curated tech and fashion, built to last.
          </p>

          <form onSubmit={handleSubscribe} className="mt-6 max-w-sm">
            <label htmlFor="footer-email" className="block text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant mb-3">
              Join our newsletter
            </label>
            <div className="flex items-center rounded-full border border-outline-variant bg-surface-container-low p-1 focus-within:border-primary transition-colors">
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/70"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="shrink-0 rounded-full bg-primary text-on-primary w-9 h-9 flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Link columns */}
        {linkGroups.map((group) => (
          <div key={group.title} className={group.title === 'Company' ? 'col-span-2 sm:col-span-1 md:col-span-2' : 'md:col-span-2'}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant mb-4">{group.title}</h3>
            <ul className="space-y-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-on-surface hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      {/* Contact + legal */}
      <div className="border-t border-outline-variant/30">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between text-xs text-on-surface-variant">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" aria-hidden /> support@novarix.com</span>
            <span className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" aria-hidden /> +91 98765 43210</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" aria-hidden /> Bengaluru, India</span>
          </div>
          <p>© {new Date().getFullYear()} NOVARIX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
