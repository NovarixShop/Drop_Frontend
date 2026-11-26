'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle2, Hexagon, Fingerprint } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#09090b] text-zinc-100 selection:bg-primary/30 min-h-svh w-full overflow-x-clip">
      {/* Background ambient gradients */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen" />
        </div>

        <div className="relative z-10 pt-10 md:pt-20">
          {/* Hero Section: The Philosophy */}
          <section className="relative md:min-h-[90svh] flex items-center py-10 md:py-0">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="lg:col-span-7 relative z-20"
              >
                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 md:mb-8 break-words bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-600">
                  Curating Modern Luxury, Made Effortless.
                </h1>
                <p className="font-body-lg text-lg md:text-2xl text-zinc-400 mb-10 md:mb-12 leading-relaxed max-w-2xl font-light">
                  NOVARIX was created with a simple belief: shopping for exceptional pieces shouldn&apos;t mean sifting through endless clutter. We curate a focused collection of fashion, accessories, and lifestyle essentials defined by quality, taste, and lasting value.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* <button className="bg-primary text-primary-foreground px-8 py-4 md:px-10 md:py-5 rounded-2xl font-label-md hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.4)] flex items-center justify-center gap-3 group">
                    View Lookbook
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="bg-white/5 border border-white/10 backdrop-blur-xl text-white px-8 py-4 md:px-10 md:py-5 rounded-2xl font-label-md hover:bg-white/10 transition-all duration-300">
                    Our Process
                  </button> */}
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                className="lg:col-span-5 hidden lg:block"
              >
                <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden p-2 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-2xl border border-white/10 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent mix-blend-overlay z-10 rounded-[2rem] md:rounded-[2.5rem]"></div>
                  <Image 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzGfZH-w_NcpmrPCH9U16Vwr7d5sfbXWwUz-5ncNPa8r37v4_ZnXslguXG0WmWYyAkywO23voEeyIYnNesu_gwL14IJFfZPhMPmijDC5PknDANeBo2jcZ-QZ1pT6BmIiDiIOPMe5ErFwkHuzSn5U42e4L2TnwB5qxxxQhIhkJvO3AmFvSHSsFp1H0qVMbiAkMGCuJFC6FduAp1Nq5pkCiad-CvOAFiPaF2ibK7lc6puPyeLCWbDl5U"
                    alt="Minimalist Luxury" 
                    fill
                    className="object-cover rounded-[2rem] md:rounded-[2.5rem] saturate-[0.8] contrast-[1.1]"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* The Hybrid Ethos: Bento Grid */}
          <section className="py-16 md:py-48 relative">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="mb-10 md:mb-20 text-center md:text-left"
              >
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight text-white break-words">The NOVARIX Standard</h2>
                {/* <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto md:mx-0 leading-relaxed">We do not accept the binary choice between performance and aesthetics. Every artifact we produce is a testament to perfect equilibrium.</p> */}
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[340px] md:auto-rows-[400px]">
                {/* Tech Block */}
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7 }}
                  className="md:col-span-8 relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group shadow-2xl"
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAANKf7Z8THc2bybIRTprCpkfGkTCzZS_EwL7iBrkIBTqRdpjKvyuQSzMZ9_TjWaiobHAoDemORpgy3XP5rVi3n3GiWJ4YVZpKRgvhaPW-gTvstZTT-6WqraUARnN_1gi2A40kd_NM1YyeG3jLSBNEd2VZUKdVKkBCs62NFBw1X3B5f7vR419hq9oJu8X3my1so6Gb5iWJUSt6DYgol2rx4nt0WkyUq1M0ywzQNMaxQGGanwELGVTYO')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent opacity-90"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12">
                    <div className="mb-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl inline-block border border-white/10">
                      <Hexagon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-bold mb-3 md:mb-4 text-white">Thoughtful Curation</h3>
                    <p className="text-base sm:text-xl text-zinc-300 max-w-[512px] leading-relaxed font-light">Every item is vetted for design, finish, and wearability so you only see pieces worth owning.</p>
                  </div>
                </motion.div>
                
                {/* Small Craft Block */}
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="md:col-span-4 bg-gradient-to-br from-zinc-900 to-black p-6 sm:p-12 flex flex-col justify-end rounded-[2rem] md:rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Fingerprint className="w-32 h-32 text-white" />
                  </div>
                  <div className="relative z-10">
                    <CheckCircle2 className="text-primary w-10 h-10 mb-8" />
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3 md:mb-4 text-white">Uncompromising Quality</h3>
                    <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">From supple leathers and heavyweight cottons to refined finishes, we prioritize materials that look and feel substantial.</p>
                  </div>
                </motion.div>
                
                {/* Fashion Block */}
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="md:col-span-4 relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group shadow-2xl"
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC30Aeaz4C1rX3wEfM_7rj84f4iQ1rd5YGUyZCik2XezFQL_4htsArSqQh914WIHyMunHvgGcmccjByu-a6ZL0TuYoo9KkAZL6YsqCsXx18joTy3A7_X8Y0ce-1zuIE2NFISzX7JhTrfwKTmhbd6hPsi_oi8Capoqw8J2Fv1UBKm7fONc9AM1jX-t6GFEnx66iNuzPYd81pNRMUNN0WDmmH3xysIvEjm4TKOub6vEjfICbkezZFYDJ6')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent opacity-90"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3 md:mb-4 text-white">Timeless Aesthetic</h3>
                    <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-light">We favor clean lines, versatile palettes, and enduring style over short lived micro trends.</p>
                  </div>
                </motion.div>
                
                {/* Tech Detail Block */}
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="md:col-span-8 relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group shadow-2xl"
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDNdB4r2DG7OtNiolk6oUco4XCMGY2lNFSZDhx0fke9CbjwzQm2pWYrTWrvq9onemWRsSJdKp3UIeIf15aFQvjP-toksICPWupW8ljsc3e_19l2dWrPP2tEQQNJQmzb50ZcMcguq-9epE8O6b9bgvnDRArx4inYZzCt2GWIsQCWrvx0VCsDhKWkZjqjVcGt_iUI9jiwoFDGhzb2iQgw6_VS4ONX1A6w_9zghCQsfgGnSYrZhrmaI-yU')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] to-transparent opacity-90"></div>
                  <div className="absolute inset-0 flex items-center p-6 sm:p-12">
                    <div className="max-w-[576px]">
                      <h3 className="text-2xl sm:text-4xl font-bold mb-3 md:mb-6 text-white">Seamless Experience</h3>
                      <p className="text-base sm:text-xl text-zinc-300 leading-relaxed font-light">From effortless browsing to reliable doorstep delivery, every step of your order is handled with care.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Our Manifesto: Text Heavy Editorial */}
          <section className="py-16 md:py-32 max-w-5xl mx-auto px-4 sm:px-6 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl md:text-7xl font-bold mb-10 md:mb-16 leading-tight break-words tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500"
            >
              Buy Better, Keep Longer.
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-8 md:space-y-12 text-zinc-300 font-light text-left leading-relaxed text-lg sm:text-2xl md:text-3xl max-w-4xl mx-auto"
            >
              <p className="text-center">
                Fast fashion and disposable goods fade after a single season. At NOVARIX, we focus on pieces with staying power versatile designs and dependable craftsmanship made to stay in your rotation year after year.
              </p>
              <p className="text-center zinc-500">
                NOVARIX is your curated online destination for contemporary fashion, refined accessories, and elevated lifestyle essentials. Quality first, always in style.
              </p>
            </motion.div>
          </section>
        </div>
    </div>
  );
}
