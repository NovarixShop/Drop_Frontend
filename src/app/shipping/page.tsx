import Link from 'next/link';
import { Truck, Clock, ShieldCheck, MapPin, Package, ArrowRight } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="w-full max-w-[900px] mx-auto px-4 md:px-6 py-12 md:py-20 pb-28 md:pb-20">
      <div className="mb-12 border-b border-outline-variant/30 pb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Delivery Information</span>
        <h1 className="font-headline-xl text-3xl md:text-5xl font-bold text-on-surface mt-2 mb-4">
          Shipping & Delivery Policy
        </h1>
        <p className="text-sm text-on-surface-variant">
          Fast, reliable express shipping across all states & Union Territories in India.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
          <Truck className="w-6 h-6 text-primary mb-2" />
          <h3 className="font-bold text-on-surface text-sm">Free Express Shipping</h3>
          <p className="text-xs text-on-surface-variant mt-1">Available on all prepaid orders of ₹999 or above.</p>
        </div>
        <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
          <Clock className="w-6 h-6 text-primary mb-2" />
          <h3 className="font-bold text-on-surface text-sm">2-5 Business Days</h3>
          <p className="text-xs text-on-surface-variant mt-1">Metros: 2-3 days. Rest of India: 3-5 business days.</p>
        </div>
        <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
          <ShieldCheck className="w-6 h-6 text-primary mb-2" />
          <h3 className="font-bold text-on-surface text-sm">Insured In-Transit</h3>
          <p className="text-xs text-on-surface-variant mt-1">100% replacement guarantee if damaged during transit.</p>
        </div>
      </div>

      <div className="space-y-10 text-on-surface-variant leading-relaxed text-sm md:text-base">
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
            <Package className="w-5 h-5 text-primary shrink-0" />
            1. Order Dispatch & Timelines
          </h2>
          <p>
            All confirmed orders are processed and handed over to our national courier partners within <strong>24 business hours</strong>. Orders placed before 2:00 PM IST on weekdays are prioritized for same-day dispatch from our Bengaluru central fulfillment center.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary shrink-0" />
            2. Serviceable PIN Codes & Partners
          </h2>
          <p>
            We partner with leading logistics providers including <strong>Bluedart, Delhivery, DTDC, and Expressbees</strong> to cover over 27,000+ PIN codes across India. If your address is unserviceable, our system will notify you before order completion.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-on-surface flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary shrink-0" />
            3. How to Track Your Order
          </h2>
          <p>
            As soon as your package is dispatched, you will receive an automated tracking link. You can also view live real-time status anytime directly inside the website:
          </p>
          <div className="pt-2">
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md text-sm hover:opacity-90 transition-opacity"
            >
              <span>Track Orders in My Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 text-sm">
          <p className="font-semibold text-on-surface mb-1">Need special delivery assistance?</p>
          <p>Contact our dispatch team at <a href="mailto:support@novarixshop.tech" className="text-primary hover:underline">support@novarixshop.tech</a> with your order number.</p>
        </div>
      </div>
    </div>
  );
}
