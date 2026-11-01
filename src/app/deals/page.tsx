"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { CountdownTimer } from "@/components/deals/CountdownTimer";
import Link from "next/link";

interface DealProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images?: string[];
}

interface Deal {
  _id: string;
  name: string;
  description?: string;
  discountPercentage: number;
  startTime: string;
  endTime: string;
  products?: DealProduct[];
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await api.get('/deals/active');
        setDeals(res.data.data.deals);
      } catch (err) {
        console.error("Failed to fetch deals", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center pt-24 px-4">
        <p className="text-white">Loading deals...</p>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center pt-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-accent">Exclusive Deals</h1>
          <p className="text-gray-400 text-lg">Amazing offers are on their way! Check back soon.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-24 px-4 pb-20 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">Exclusive Deals</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Don&apos;t miss out on these limited-time offers!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {deals.map((deal) => {
          const now = new Date();
          const startTime = new Date(deal.startTime);
          const endTime = new Date(deal.endTime);
          
          const isScheduled = startTime > now;
          const isActive = startTime <= now && endTime > now;

          if (!isScheduled && !isActive) return null; // Skip expired deals if any snuck in

          return (
            <motion.div
              key={deal._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{deal.name}</h2>
                    <p className="text-gray-400 text-sm">{deal.description}</p>
                  </div>
                  <div className="bg-primary/20 text-primary font-bold px-3 py-1 rounded-full text-sm">
                    {deal.discountPercentage}% OFF
                  </div>
                </div>

                <div className="mt-8 mb-8 space-y-4">
                  {deal.products && deal.products.map((prod) => (
                    <div key={prod._id} className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-xl">
                      {prod.images && prod.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={prod.images[0]} alt={prod.name} className="w-16 h-16 object-cover rounded-lg" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Img</span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-white">{prod.name}</p>
                        <div className="flex gap-2 items-center text-sm">
                          <span className="text-gray-400 line-through">₹{prod.compareAtPrice || Math.round(prod.price / (1 - deal.discountPercentage/100))}</span>
                          <span className="text-accent font-bold">₹{prod.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {isScheduled ? (
                  <div className="bg-black/40 rounded-xl p-6 backdrop-blur-sm border border-gray-800/50">
                    <p className="text-center text-gray-400 text-sm mb-4 font-semibold uppercase tracking-wider">Unlocks In</p>
                    <CountdownTimer targetDate={startTime} />
                  </div>
                ) : (
                  <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
                    <p className="text-center text-primary text-sm mb-4 font-semibold uppercase tracking-wider">Ends In</p>
                    <CountdownTimer targetDate={endTime} />
                    {deal.products && deal.products.length > 0 && (
                      <Link 
                        href={`/products/${deal.products[0].slug}`}
                        className="mt-6 block w-full bg-primary hover:bg-primary/90 text-white text-center font-bold py-3 px-4 rounded-lg transition-colors"
                      >
                        Shop Now
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
