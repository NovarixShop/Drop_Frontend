import Link from 'next/link';
import { RotateCcw, CheckCircle2, AlertCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="w-full max-w-[900px] mx-auto px-4 md:px-6 py-12 md:py-20 pb-28 md:pb-20">
      <div className="mb-12 border-b border-outline-variant/30 pb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Customer Satisfaction</span>
        <h1 className="font-headline-xl text-3xl md:text-5xl font-bold text-on-surface mt-2 mb-4">
          Returns & Refund Policy
        </h1>
        <p className="text-sm text-on-surface-variant">
          Simple, transparent 7-day return guarantee with door-step reverse pickup.
        </p>
      </div>

      <div className="space-y-10 text-on-surface-variant leading-relaxed text-sm md:text-base">
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-primary shrink-0" />
            1. 7-Day Hassle-Free Returns
          </h2>
          <p>
            We stand behind every product we sell. If you receive a product that is defective, damaged, or not as described, you may request a free replacement or full refund within <strong>7 days</strong> from the delivery date.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            2. Return Eligibility Guidelines
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>The product must be unused, unwashed, and in its original condition.</li>
            <li>Original manufacturer packaging, barcodes, tags, and all included accessories must be intact.</li>
            <li>Proof of purchase (Order ID or invoice generated from your account) must be provided.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary shrink-0" />
            3. How to Initiate a Return
          </h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Go to <Link href="/orders" className="text-primary font-semibold hover:underline">My Orders</Link> in your account.</li>
            <li>Select the order containing the item you wish to return.</li>
            <li>Click <strong>Request Return / Support</strong> and choose the reason.</li>
            <li>Our courier partner will schedule a doorstep pickup within 48 business hours.</li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
            4. Refund Timelines
          </h2>
          <p>
            Once our warehouse receives and inspects the returned item:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Online Payments (Razorpay/UPI/Cards):</strong> Refund will be credited back to the original payment source within <strong>3-5 business days</strong>.</li>
            <li><strong>Cash on Delivery (COD):</strong> You will receive a direct bank transfer (NEFT/IMPS) or store credit coupon within 24 hours of item verification.</li>
          </ul>
        </section>

        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-on-surface text-base">Have an item you need to return?</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">Visit your order history to initiate a claim right now.</p>
          </div>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-label-md text-sm hover:opacity-90 shrink-0"
          >
            <span>Go to My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
