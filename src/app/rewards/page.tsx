'use client';

import { motion } from 'framer-motion';
import { SpinningWheel } from '@/components/gamification/SpinningWheel';
import { ScratchCard } from '@/components/gamification/ScratchCard';
import { useGamificationStore } from '@/store/gamificationStore';
import { Sparkles, Ticket, Lock, Copy } from 'lucide-react';
import { TiltCard } from '@/components/3DCard';
import { useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

const STATUS_LABEL = { available: 'Ready to use at checkout', used: 'Used', expired: 'Expired' } as const;

export default function RewardsPage() {
  const { coupons, hasPurchased, loaded, fetchRewards } = useGamificationStore();
  const { isAuthenticated } = useAuthStore();
  const loading = isAuthenticated && !loaded;

  useEffect(() => {
    if (isAuthenticated) {
      fetchRewards().catch((error) => console.error('Failed to load rewards:', error));
    }
  }, [isAuthenticated, fetchRewards]);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code).then(
      () => toast.success(`Copied ${code}`),
      () => toast.error('Could not copy the code')
    );
  };

  const lockTitle = !isAuthenticated ? 'Sign in to play' : null;
  const lockMessage = !isAuthenticated ? (
    <>
      <Link href="/login?redirect=/rewards" className="text-primary hover:underline">Sign in</Link> to see your rewards.
    </>
  ) : null;

  return (
    <div className="bg-surface min-h-svh pt-10 pb-40 md:pt-12">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 md:mb-20 text-center max-w-2xl mx-auto"
        >
          <span className="font-label-md text-primary uppercase tracking-[0.2em] mb-4 block">Exclusive Benefits</span>
          <h1 className="font-headline-xl text-on-surface mb-6 text-4xl md:text-5xl">LUXE Rewards</h1>
          <p className="font-body-md text-on-surface-variant text-base md:text-lg leading-relaxed">
            Engage with our ecosystem to unlock exclusive discounts, early access, and complimentary gifts. Your loyalty, rewarded with precision.
          </p>
        </motion.header>

        {/* Ambient Floating 3D Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-24 h-24 rounded-full bg-primary/10 blur-3xl"
          />
          <motion.div 
            animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }} 
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-40 right-20 w-32 h-32 rounded-full bg-primary-container/20 blur-3xl"
          />
          <motion.div 
            animate={{ y: [0, -40, 0], rotateX: [0, 180, 360], rotateY: [0, 180, 360] }} 
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/3 right-10 w-16 h-16 border border-primary/20 rounded-xl hidden lg:block"
            style={{ transformStyle: 'preserve-3d' }}
          />
          <motion.div 
            animate={{ y: [0, 50, 0], rotateZ: [0, 360] }} 
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 left-1/4 w-12 h-12 border border-outline-variant/30 rounded-full hidden lg:block"
          />
        </div>

        {/* Gamification Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-20 md:mb-32 relative z-10" style={{ perspective: "1000px" }}>
          
          {/* Wheel Section */}
          <TiltCard 
            className="w-full bg-surface-container-low rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-14 soft-shadow border border-outline-variant/30 flex flex-col items-center justify-center overflow-hidden relative"
          >
            {(!hasPurchased || loading) && (
              <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6">
                <Lock className="w-12 h-12 text-on-surface-variant mb-4" />
                <h3 className="font-headline-md text-xl mb-2">{lockTitle ?? 'Unlock Rewards'}</h3>
                <p className="text-on-surface-variant text-sm">{lockMessage ?? 'Make your first purchase to unlock the Daily Spin and Mystery Cards.'}</p>
              </div>
            )}
            <div className="bg-gradient-brand-soft pointer-events-none absolute inset-0"></div>
            <div className="text-center mb-8 md:mb-10 relative z-10">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <h2 className="font-headline-lg text-on-surface mb-2 md:mb-3 text-2xl md:text-3xl">The Daily Spin</h2>
              <p className="font-body-md text-on-surface-variant text-sm md:text-base">
                Test your luck every day to win exclusive percentages off your next order.
              </p>
            </div>
            
            <div className="relative z-10 w-full flex justify-center scale-90 md:scale-100 transform origin-center">
              <SpinningWheel />
            </div>
          </TiltCard>

          {/* Scratch Card Section */}
          <TiltCard 
            delay={0.1}
            className="w-full bg-surface-container-low rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-14 soft-shadow border border-outline-variant/30 flex flex-col items-center justify-center overflow-hidden relative"
          >
            {(!hasPurchased || loading) && (
              <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6">
                <Lock className="w-12 h-12 text-on-surface-variant mb-4" />
                <h3 className="font-headline-md text-xl mb-2">{lockTitle ?? 'Unlock Mystery Card'}</h3>
                <p className="text-on-surface-variant text-sm">{lockMessage ?? 'Make a purchase to unlock scratch cards with hidden offers.'}</p>
              </div>
            )}
            <div className="bg-gradient-brand-soft pointer-events-none absolute inset-0"></div>
             <div className="text-center mb-8 md:mb-10 relative z-10">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm">
                <Ticket className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <h2 className="font-headline-lg text-on-surface mb-2 md:mb-3 text-2xl md:text-3xl">Mystery Card</h2>
              <p className="font-body-md text-on-surface-variant text-sm md:text-base">
                Scratch to reveal hidden offers. You earn one card with every order.
              </p>
            </div>
            
            <div className="relative z-10 w-full flex justify-center overflow-hidden rounded-xl">
              <div className="scale-90 md:scale-100 transform origin-center max-w-full overflow-hidden">
                <ScratchCard />
              </div>
            </div>
          </TiltCard>

        </div>

        {/* Earned Rewards Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
            <h2 className="font-headline-lg text-on-surface whitespace-nowrap text-2xl md:text-3xl">
              Your Unlocked Offers
            </h2>
            <div className="h-[1px] w-full bg-outline-variant/30 hidden md:block"></div>
          </div>
          
          {coupons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {coupons.map((coupon, idx) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, type: "spring", stiffness: 200 }}
                  key={coupon.code} 
                  className={`bg-surface border border-outline-variant/50 rounded-2xl p-6 md:p-8 text-center shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors ${coupon.status !== 'available' ? 'opacity-50' : ''}`}
                >
                  <div className="bg-gradient-brand absolute top-0 left-0 h-1 w-full origin-left scale-x-100 transition-transform duration-500 group-hover:scale-x-0"></div>
                  <h3 className="font-headline-lg text-primary mb-2 font-bold text-xl md:text-2xl">{coupon.label}</h3>
                  <button
                    onClick={() => copyCode(coupon.code)}
                    disabled={coupon.status !== 'available'}
                    className="inline-flex items-center gap-2 font-label-md text-on-surface bg-surface-container-low border border-dashed border-outline-variant rounded-lg px-3 py-1.5 mb-3 hover:border-primary transition-colors"
                    title="Copy code"
                  >
                    {coupon.code} {coupon.status === 'available' && <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <p className="font-caption text-on-surface-variant text-[12px] md:text-[13px] uppercase tracking-wider">{STATUS_LABEL[coupon.status]}</p>
                  {coupon.status === 'available' && (
                    <p className="font-caption text-on-surface-variant text-[12px] mt-1">
                      {coupon.minOrderValue > 0 && `Min. order ₹${coupon.minOrderValue} · `}
                      Expires {new Date(coupon.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 md:py-24 bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/50">
              <p className="font-body-md text-on-surface-variant text-base md:text-lg max-w-[448px] mx-auto px-4">
                You haven&apos;t unlocked any offers yet. Spin the wheel or scratch a card to begin.
              </p>
            </div>
          )}
        </motion.section>

      </div>
    </div>
  );
}
