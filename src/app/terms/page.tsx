import Link from 'next/link';
import { Scale, CheckCircle2, AlertCircle, ShoppingBag, Truck } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="w-full max-w-[900px] mx-auto px-4 md:px-6 py-12 md:py-20 pb-28 md:pb-20">
      <div className="mb-12 border-b border-outline-variant/30 pb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Customer Agreement</span>
        <h1 className="font-headline-xl text-3xl md:text-5xl font-bold text-on-surface mt-2 mb-4">
          Terms of Service
        </h1>
        <p className="text-sm text-on-surface-variant">
          Last revised: November 2026 · Governing Law: Karnataka, India
        </p>
      </div>

      <div className="space-y-10 text-on-surface-variant leading-relaxed text-sm md:text-base">
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary shrink-0" />
            1. Agreement to Terms
          </h2>
          <p>
            By accessing or purchasing from <strong>NOVARIX</strong> (<Link href="/" className="text-primary hover:underline">novarixshop.tech</Link>), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please do not use our website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary shrink-0" />
            2. Orders, Pricing & Payment
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Pricing:</strong> All prices are displayed in Indian Rupees (₹ INR) inclusive of applicable GST unless explicitly stated otherwise.</li>
            <li><strong>Order Confirmation:</strong> An order confirmation email or screen does not signify final acceptance of your order. We reserve the right to cancel or limit orders in case of pricing errors or unexpected inventory depletion.</li>
            <li><strong>Payments:</strong> We support online payments via Razorpay (UPI, Credit/Debit cards, Net Banking) and Cash on Delivery (COD) on eligible orders.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary shrink-0" />
            3. Shipping & Delivery
          </h2>
          <p>
            We ship to serviceable PIN codes throughout India. Standard transit times are <strong>2 to 5 business days</strong> depending on delivery location. You will receive active dispatch alerts and tracking numbers via your <Link href="/orders" className="text-primary font-medium hover:underline">My Orders</Link> dashboard.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            4. 7-Day Replacement & Returns
          </h2>
          <p>
            If a product arrives damaged, defective, or incorrect, you are entitled to a full replacement or refund within <strong>7 days</strong> of delivery. Returned items must remain in original packaging with all tags and accessories intact.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary shrink-0" />
            5. Limitation of Liability
          </h2>
          <p>
            In no event shall NOVARIX Technologies or its directors be liable for any indirect, incidental, or consequential damages resulting from product use or site downtime. Total liability is limited strictly to the amount paid for the specific order under question.
          </p>
        </section>

        <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 text-sm">
          <p className="font-semibold text-on-surface mb-1">Questions or Disputes?</p>
          <p>Reach out to our customer resolution desk at <a href="mailto:support@novarixshop.tech" className="text-primary hover:underline">support@novarixshop.tech</a> or call +91 (80) 4123-4567.</p>
        </div>
      </div>
    </div>
  );
}

