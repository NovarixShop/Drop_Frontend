'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

const perks = [
  {
    icon: Truck,
    title: 'Free Express Shipping',
    subtitle: 'On all orders above ₹999 across India',
  },
  {
    icon: RotateCcw,
    title: '7-Day Easy Returns',
    subtitle: 'Doorstep pickup with instant refunds',
  },
  {
    icon: ShieldCheck,
    title: '100% Secure Checkout',
    subtitle: 'Razorpay 256-bit encrypted payments',
  },
  {
    icon: Headphones,
    title: '24/7 Priority Support',
    subtitle: 'Dedicated assistance via email & phone',
  },
];

interface FooterLink {
  label: string;
  href: string;
  badge?: string;
  highlighted?: boolean;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const navigationSections: FooterSection[] = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'Trending Deals', href: '/deals', badge: 'Hot' },
      { label: 'Categories', href: '/categories' },
      { label: 'Rewards & Coupons', href: '/rewards' },
      { label: 'Wishlist', href: '/wishlist' },
    ],
  },
  {
    title: 'My Account',
    links: [
      { label: 'My Orders', href: '/orders', highlighted: true },
      { label: 'Order Tracking', href: '/orders' },
      { label: 'Shopping Cart', href: '/cart' },
      { label: 'Sign In', href: '/login' },
      { label: 'Create Account', href: '/register' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping Policy', href: '/shipping' },
      { label: 'Returns & Refunds', href: '/returns' },
      { label: 'Help & FAQs', href: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About NOVARIX', href: '/about' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Merchant Portal', href: 'https://admin.novarixshop.tech', external: true },
    ],
  },
];

const paymentMethods = [
  'Razorpay',
  'UPI (GPay / PhonePe)',
  'Visa',
  'Mastercard',
  'RuPay',
  'Net Banking',
  'Cash on Delivery',
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
    // pb-28 on mobile keeps the last row clear of the fixed MobileBottomBar
    <footer className="relative z-10 w-full border-t border-outline-variant/30 bg-surface-container-lowest text-on-surface pb-28 md:pb-0">
      {/* 1. Value Proposition / Perks Strip */}
      <div className="border-b border-outline-variant/30 bg-surface-container-low/40">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.title}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-surface/50 border border-outline-variant/20 transition-all hover:border-primary/40"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-on-surface leading-tight">
                      {perk.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-normal">
                      {perk.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Footer Grid: Brand (4 cols) + 4 Link Columns (2 cols each) = 12 Columns */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand + Mission + Newsletter (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              <Link href="/" className="inline-block group" aria-label="NOVARIX Home">
                <Image
                  src="/logo-dark.png"
                  alt="NOVARIX"
                  width={160}
                  height={48}
                  className="h-10 md:h-11 w-auto object-contain hidden dark:block transition-transform duration-200 group-hover:scale-105"
                />
                <Image
                  src="/logo-light.png"
                  alt="NOVARIX"
                  width={160}
                  height={48}
                  className="h-10 md:h-11 w-auto object-contain block dark:hidden transition-transform duration-200 group-hover:scale-105"
                />
              </Link>
              <p className="mt-4 text-sm text-on-surface-variant max-w-sm leading-relaxed">
                NOVARIX is your curated destination for modern technology, everyday luxury, and lifestyle essentials. Engineered for precision, crafted to inspire.
              </p>
            </div>

            {/* Newsletter */}
            <div className="max-w-sm">
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
                Stay In The Loop
              </span>
              <p className="text-xs text-on-surface-variant mb-3">
                Subscribe for exclusive drops, private sale access, and reward coupons.
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#00C853]/10 border border-[#00C853]/40 text-[#00C853] text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You&apos;re subscribed! Welcome to the NOVARIX club.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative">
                  <div className="flex items-center rounded-xl border border-outline-variant bg-surface p-1 focus-within:border-primary transition-colors">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="min-w-0 flex-1 bg-transparent px-3.5 py-2 text-xs md:text-sm text-on-surface outline-none placeholder:text-on-surface-variant/70"
                    />
                    <button
                      type="submit"
                      aria-label="Subscribe to newsletter"
                      className="shrink-0 rounded-lg bg-primary text-on-primary px-3.5 py-2 flex items-center justify-center gap-1.5 text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      <span>Join</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Contact details */}
            <div className="space-y-2 text-xs text-on-surface-variant pt-2 border-t border-outline-variant/30">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:support@novarixshop.tech" className="hover:text-primary transition-colors">
                  support@novarixshop.tech
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+918041234567" className="hover:text-primary transition-colors">
                  +91 (80) 4123-4567 (Mon-Sat, 9AM-8PM)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Indiranagar, Bengaluru, Karnataka 560038, India</span>
              </div>
            </div>
          </div>

          {/* 4 Navigation Link Columns (lg:col-span-2 each = 8 cols total) */}
          {navigationSections.map((section) => (
            <div key={section.title} className="lg:col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface mb-4 pb-1 border-b border-outline-variant/30">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs md:text-sm text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <span>{link.label}</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className={`inline-flex items-center gap-1.5 text-xs md:text-sm transition-colors ${
                          link.highlighted
                            ? 'text-primary font-semibold hover:underline'
                            : 'text-on-surface-variant hover:text-primary'
                        }`}
                      >
                        <span>{link.label}</span>
                        {link.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-500/15 text-red-500 uppercase">
                            {link.badge}
                          </span>
                        )}
                        {link.highlighted && (
                          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-full bg-primary/15 text-primary">
                            Track
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

      {/* 3. Payment Methods & Trust Strip */}
      <div className="border-t border-outline-variant/30 bg-surface-container-low/30">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            <span className="font-semibold text-on-surface text-xs mr-1">Accepted Payments:</span>
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="px-2.5 py-1 rounded-md bg-surface border border-outline-variant/40 text-[11px] font-medium"
              >
                {method}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#00C853] shrink-0 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>256-Bit SSL Encrypted & Verified Checkout</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Legal & Copyright Bar */}
      <div className="border-t border-outline-variant/30">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <p>© {new Date().getFullYear()} NOVARIX Shop (novarixshop.tech). All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/shipping" className="hover:text-primary transition-colors">
              Shipping Policy
            </Link>
            <Link href="/returns" className="hover:text-primary transition-colors">
              Returns Policy
            </Link>
            <Link href="/orders" className="hover:text-primary font-semibold text-primary transition-colors">
              My Orders
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
