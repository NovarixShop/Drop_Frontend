'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles, Hexagon, Fingerprint } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#09090b] text-zinc-100 selection:bg-primary/30 min-h-svh pb-32 md:pb-0">
      {/* Background ambient gradients */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen" />
        </div>

        <main className="relative z-10 pt-20">
          {/* Hero Section: The Philosophy */}
          <section className="relative min-h-[90svh] flex items-center">
            <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="lg:col-span-7 relative z-20"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="font-label-md text-zinc-300 uppercase tracking-[0.2em] text-xs">ESTABLISHED 2024</span>
                </div>
                <h1 className="font-display-lg-mobile md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-600">
                  Defining the architecture of modern luxury.
                </h1>
                <p className="font-body-lg text-xl md:text-2xl text-zinc-400 mb-12 leading-relaxed max-w-2xl font-light">
                  LUXE was born from a singular obsession: to engineer artifacts that transcend the disposable nature of modern consumerism. We merge uncompromising technological rigor with the soul of haute couture.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-label-md hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.4)] flex items-center justify-center gap-3 group">
                    View Lookbook
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="bg-white/5 border border-white/10 backdrop-blur-xl text-white px-10 py-5 rounded-2xl font-label-md hover:bg-white/10 transition-all duration-300">
                    Our Process
                  </button>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                className="lg:col-span-5 hidden lg:block"
              >
                <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden p-2 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-2xl border border-white/10 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent mix-blend-overlay z-10 rounded-[2.5rem]"></div>
                  <Image 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzGfZH-w_NcpmrPCH9U16Vwr7d5sfbXWwUz-5ncNPa8r37v4_ZnXslguXG0WmWYyAkywO23voEeyIYnNesu_gwL14IJFfZPhMPmijDC5PknDANeBo2jcZ-QZ1pT6BmIiDiIOPMe5ErFwkHuzSn5U42e4L2TnwB5qxxxQhIhkJvO3AmFvSHSsFp1H0qVMbiAkMGCuJFC6FduAp1Nq5pkCiad-CvOAFiPaF2ibK7lc6puPyeLCWbDl5U"
                    alt="Minimalist Luxury" 
                    fill
                    className="object-cover rounded-[2.5rem] saturate-[0.8] contrast-[1.1]"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* The Hybrid Ethos: Bento Grid */}
          <section className="py-32 md:py-48 relative">
            <div className="max-w-[1440px] mx-auto px-6">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="mb-20 text-center md:text-left"
              >
                <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">An uncompromising synthesis.</h2>
                <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">We do not accept the binary choice between performance and aesthetics. Every artifact we produce is a testament to perfect equilibrium.</p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[400px]">
                {/* Tech Block */}
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7 }}
                  className="md:col-span-8 relative rounded-[2.5rem] overflow-hidden group shadow-2xl"
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAANKf7Z8THc2bybIRTprCpkfGkTCzZS_EwL7iBrkIBTqRdpjKvyuQSzMZ9_TjWaiobHAoDemORpgy3XP5rVi3n3GiWJ4YVZpKRgvhaPW-gTvstZTT-6WqraUARnN_1gi2A40kd_NM1YyeG3jLSBNEd2VZUKdVKkBCs62NFBw1X3B5f7vR419hq9oJu8X3my1so6Gb5iWJUSt6DYgol2rx4nt0WkyUq1M0ywzQNMaxQGGanwELGVTYO')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent opacity-90"></div>
                  <div className="absolute bottom-0 left-0 p-12">
                    <div className="mb-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl inline-block border border-white/10">
                      <Hexagon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-4xl font-bold mb-4 text-white">Advanced Tech</h3>
                    <p className="text-xl text-zinc-300 max-w-[512px] leading-relaxed font-light">Engineered with absolute precision. Our technological hardware is designed to deliver unprecedented, frictionless performance.</p>
                  </div>
                </motion.div>
                
                {/* Small Craft Block */}
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="md:col-span-4 bg-gradient-to-br from-zinc-900 to-black p-12 flex flex-col justify-end rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Fingerprint className="w-32 h-32 text-white" />
                  </div>
                  <div className="relative z-10">
                    <CheckCircle2 className="text-primary w-10 h-10 mb-8" />
                    <h3 className="text-3xl font-bold mb-4 text-white">Material Purity</h3>
                    <p className="text-lg text-zinc-400 leading-relaxed">Sourced globally, refined meticulously. Only the highest-grade materials earn the LUXE hallmark.</p>
                  </div>
                </motion.div>
                
                {/* Fashion Block */}
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="md:col-span-4 relative rounded-[2.5rem] overflow-hidden group shadow-2xl"
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC30Aeaz4C1rX3wEfM_7rj84f4iQ1rd5YGUyZCik2XezFQL_4htsArSqQh914WIHyMunHvgGcmccjByu-a6ZL0TuYoo9KkAZL6YsqCsXx18joTy3A7_X8Y0ce-1zuIE2NFISzX7JhTrfwKTmhbd6hPsi_oi8Capoqw8J2Fv1UBKm7fONc9AM1jX-t6GFEnx66iNuzPYd81pNRMUNN0WDmmH3xysIvEjm4TKOub6vEjfICbkezZFYDJ6')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent opacity-90"></div>
                  <div className="absolute bottom-0 left-0 p-10">
                    <h3 className="text-3xl font-bold mb-4 text-white">Avant-Garde</h3>
                    <p className="text-lg text-zinc-300 leading-relaxed font-light">Silhouettes defined by architectural structure, comfort, and an unapologetic, refined palette.</p>
                  </div>
                </motion.div>
                
                {/* Tech Detail Block */}
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="md:col-span-8 relative rounded-[2.5rem] overflow-hidden group shadow-2xl"
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDNdB4r2DG7OtNiolk6oUco4XCMGY2lNFSZDhx0fke9CbjwzQm2pWYrTWrvq9onemWRsSJdKp3UIeIf15aFQvjP-toksICPWupW8ljsc3e_19l2dWrPP2tEQQNJQmzb50ZcMcguq-9epE8O6b9bgvnDRArx4inYZzCt2GWIsQCWrvx0VCsDhKWkZjqjVcGt_iUI9jiwoFDGhzb2iQgw6_VS4ONX1A6w_9zghCQsfgGnSYrZhrmaI-yU')" }}></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] to-transparent opacity-90"></div>
                  <div className="absolute inset-0 flex items-center p-12">
                    <div className="max-w-[576px]">
                      <h3 className="text-4xl font-bold mb-6 text-white">Curated Environments</h3>
                      <p className="text-xl text-zinc-300 leading-relaxed font-light">We design digital and physical ecosystems that respect your attention, offering profound breathing room in an overcrowded world.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Our Manifesto: Text Heavy Editorial */}
          <section className="py-32 md:py-48 max-w-5xl mx-auto px-6 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-bold mb-16 leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500"
            >
              Sustainability is not a feature. <br/> It is our foundation.
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-12 text-zinc-300 font-light text-left leading-relaxed text-2xl md:text-3xl max-w-4xl mx-auto"
            >
              <p>
                The modern landscape is saturated with noise and planned obsolescence. LUXE serves as the antidote. We operate on a philosophy of radical subtraction—stripping away the superfluous until only absolute perfection remains. 
              </p>
              <p className="text-zinc-500">
                From the molecular structure of our aerospace-grade alloys to the ethically sourced organic textiles woven into our garments, our material science is as rigorous as our design ethos. We do not chase seasonal trends; we architect enduring icons designed to outlive their creators.
              </p>
              <div className="pt-16 flex justify-center">
                <Link href="#" className="text-white font-medium inline-flex items-center gap-3 group hover:bg-white/10 transition-all px-10 py-5 border border-white/20 rounded-full bg-white/5 backdrop-blur-md">
                  Examine our 2024 Transparency Report 
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                </Link>
              </div>
            </motion.div>
          </section>

          {/* Team / Leadership Section */}
          <section className="py-32 md:py-48 mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black pointer-events-none" />
            <div className="max-w-[1440px] mx-auto px-6 relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-6xl font-bold mb-24 text-center tracking-tight text-white"
              >
                The Visionaries
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { name: "Elena Vane", role: "Creative Director", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoFxuiKnim2RbCcfLRZ3F9NWeY5xAIoeKzHfAfQp-zMfIa4SFCObuSufbrhsFkJG4NOrY-0nlLhsOcYccByxB-TQxAJN3RogRlM20F9x2SokIoF_-7PEgASk1J4tBZxwEEsdFNDtTC0NRfzWgFL3tMZbiKjncJwj7ciEM2SxMP1dCpBvfAHeeTZl4_FxOGaw0lIvmJpRXbZNz9AzLB83sOM_BViCtNnLAXrr1udL4WxRtHkpIVgrik" },
                  { name: "Marcus Thorne", role: "Head of Product", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNdB4r2DG7OtNiolk6oUco4XCMGY2lNFSZDhx0fke9CbjwzQm2pWYrTWrvq9onemWRsSJdKp3UIeIf15aFQvjP-toksICPWupW8ljsc3e_19l2dWrPP2tEQQNJQmzb50ZcMcguq-9epE8O6b9bgvnDRArx4inYZzCt2GWIsQCWrvx0VCsDhKWkZjqjVcGt_iUI9jiwoFDGhzb2iQgw6_VS4ONX1A6w_9zghCQsfgGnSYrZhrmaI-yU" }, // Reusing an image as placeholder for aesthetics
                  { name: "Sarah Lin", role: "Chief Technology Officer", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzGfZH-w_NcpmrPCH9U16Vwr7d5sfbXWwUz-5ncNPa8r37v4_ZnXslguXG0WmWYyAkywO23voEeyIYnNesu_gwL14IJFfZPhMPmijDC5PknDANeBo2jcZ-QZ1pT6BmIiDiIOPMe5ErFwkHuzSn5U42e4L2TnwB5qxxxQhIhkJvO3AmFvSHSsFp1H0qVMbiAkMGCuJFC6FduAp1Nq5pkCiad-CvOAFiPaF2ibK7lc6puPyeLCWbDl5U" },
                  { name: "David Chen", role: "Lead Designer", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC30Aeaz4C1rX3wEfM_7rj84f4iQ1rd5YGUyZCik2XezFQL_4htsArSqQh914WIHyMunHvgGcmccjByu-a6ZL0TuYoo9KkAZL6YsqCsXx18joTy3A7_X8Y0ce-1zuIE2NFISzX7JhTrfwKTmhbd6hPsi_oi8Capoqw8J2Fv1UBKm7fONc9AM1jX-t6GFEnx66iNuzPYd81pNRMUNN0WDmmH3xysIvEjm4TKOub6vEjfICbkezZFYDJ6" }
                ].map((member, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: idx * 0.15 }}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[3/4] rounded-[2rem] overflow-hidden mb-8 relative border border-white/10 shadow-2xl">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                      {member.img ? (
                        <Image 
                          src={member.img}
                          alt={member.name}
                          fill
                          className="object-cover transition-transform duration-[1.5s] group-hover:scale-110 saturate-[0.7] group-hover:saturate-100"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                          <span className="text-zinc-600">Image</span>
                        </div>
                      )}
                    </div>
                    <h4 className="text-2xl font-bold mb-2 text-white group-hover:text-primary transition-colors">{member.name}</h4>
                    <p className="font-label-md text-zinc-500 uppercase tracking-widest text-sm">{member.role}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>
    </div>
  );
}
