import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, Bell } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-[900px] mx-auto px-4 md:px-6 py-12 md:py-20 pb-28 md:pb-20">
      <div className="mb-12 border-b border-outline-variant/30 pb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Legal & Security</span>
        <h1 className="font-headline-xl text-3xl md:text-5xl font-bold text-on-surface mt-2 mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-on-surface-variant">
          Last updated: November 2026 · Effective Date: January 1, 2026
        </p>
      </div>

      <div className="space-y-10 text-on-surface-variant leading-relaxed text-sm md:text-base">
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
            1. Overview & Commitment
          </h2>
          <p>
            At <strong>NOVARIX</strong> (operating at <Link href="/" className="text-primary hover:underline">novarixshop.tech</Link>), we treat your personal privacy and data integrity with the highest standard of care. This Privacy Policy outlines what information we collect, how it is safeguarded, and how you retain complete control over your personal data when using our storefront and order services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary shrink-0" />
            2. Information We Collect
          </h2>
          <p>We only collect information essential for fulfilling your orders and improving your shopping experience:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Data:</strong> Name, email address, profile avatar, and encrypted credentials when you register or sign in using Google OAuth.</li>
            <li><strong>Delivery Information:</strong> Shipping street address, city, state, postal PIN code, and contact phone number.</li>
            <li><strong>Order History:</strong> Product items ordered, quantities, totals, reward scratch cards, and coupon usage records.</li>
            <li><strong>Technical Diagnostics:</strong> IP address, device browser type, and anonymous session telemetry to safeguard against fraud.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary shrink-0" />
            3. Payment Security & Razorpay
          </h2>
          <p>
            <strong>We NEVER store, log, or have access to your full credit/debit card numbers, CVVs, or bank net banking passwords.</strong>
          </p>
          <p>
            All online transactions are processed through our PCI-DSS Level 1 compliant payment partner, <strong>Razorpay</strong>, using standard 256-bit TLS/SSL encryption. When you complete checkout, your payment details are transmitted directly to Razorpay through their secure tokenized iframe.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary shrink-0" />
            4. How We Use Your Data
          </h2>
          <p>Your data is used strictly for legitimate business operations:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Processing, packing, and delivering your ordered goods.</li>
            <li>Generating invoices and dispatching SMS/email tracking updates.</li>
            <li>Managing your reward discounts, coupons, and scratch cards.</li>
            <li>Preventing fraudulent orders and maintaining platform security.</li>
          </ul>
          <p className="font-semibold text-on-surface">
            We will NEVER sell, rent, or trade your personal information to third-party advertisers or data brokers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary shrink-0" />
            5. Contacting Our Data Protection Officer
          </h2>
          <p>
            If you have questions about your data, wish to request data deletion, or want to update your preferences, please contact us at:
          </p>
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 text-sm">
            <p><strong>Email:</strong> privacy@novarixshop.tech / support@novarixshop.tech</p>
            <p><strong>Address:</strong> NOVARIX Technologies, Indiranagar, Bengaluru, Karnataka 560038, India</p>
          </div>
        </section>
      </div>
    </div>
  );
}
