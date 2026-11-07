'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import ProductImage from '@/components/products/ProductImage';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ShoppingCart, Heart } from 'lucide-react';
import { toast } from 'sonner';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import { productHref } from '@/lib/productHref';

export default function Home() {
  const { trendingProducts, fetchTrendingProducts, isLoading } = useProductStore();
  const { addItem, setCartOpen } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 150]);

  useEffect(() => {
    fetchTrendingProducts();
  }, [fetchTrendingProducts]);

  return (
    <div className="pt-2 md:pt-4">
      {/* Hero Collage Section */}
      <section ref={heroRef} className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="flex flex-col gap-4 md:grid md:h-[clamp(32rem,calc(100svh-var(--nav-h)-3rem),50rem)] md:grid-cols-12 md:grid-rows-2">
          {/* Main Large Feature: Fashion */}
          <div className="md:col-span-7 md:row-span-2 relative overflow-hidden rounded-2xl group hero-collage-item h-[480px] md:h-auto">
            <div className="scrim-bottom-soft absolute inset-0 z-10"></div>
            <motion.div 
              className="absolute -inset-x-8 -bottom-8 top-0 bg-cover bg-[center_top] transition-transform duration-1000 group-hover:scale-105" 
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ y: y1, backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCX3F2C5aka18RZtJ5yd0KTYBdvMe5_MfVP3oGZUOoPNZZbiBz1rEf_GKz6xuqbhcDD7dppvssJtqkHbIsIkEXAjhgn3aZYWtNJFH2zli46um0RS_amfF07Vht4yWURf0PcAV2nezBDOctbWn4N6xdZNGhsPUILKIlFR5TGIC7FD5u5o9CEyEKS1ZsZAzt7PeCUvXzSSHSQQ2xcK1ZG9_8zIY4zpja8zjB-FshWasieAJrAQVUm-DhX')" }}
            ></motion.div>
            <div className="absolute bottom-6 left-6 right-6 z-20 md:bottom-10 md:left-10 md:right-10">
              <span className="bg-primary px-2.5 py-1 rounded-full text-white font-label-md text-[10px] tracking-widest uppercase mb-2 inline-block">Fashion</span>
              <h1 className="font-display-lg text-white mb-4">The New <br />Standard</h1>
              <Link href="/products?category=fashion">
                <button className="bg-white text-black px-8 py-3.5 rounded-xl font-label-md hover:bg-primary-container hover:text-white transition-all duration-300 active:scale-95 shadow-lg">Explore Collection</button>
              </Link>
            </div>
          </div>
          
          {/* Secondary: Tech */}
          <div className="md:col-span-5 md:row-span-1 relative overflow-hidden rounded-2xl group hero-collage-item h-[260px] md:h-auto">
            <div className="scrim-left absolute inset-0 z-10"></div>
            <motion.div 
              className="absolute -inset-6 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" 
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              style={{ y: y2, backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAogO9w9FGXtQ5_ueTVMaY9Na3X2_URRO5zqqRVwd0KkzZG3NkzviHo_Idw5_1l1oXHtm8CP2-jok1K90zuX6CK_B42NlUtTiJcfwxfjoOgc09jWcL-_ZZMsqQ6M7aNlaoYywD__XwXyfMhmmgwTS1k65vsZlAhiViLl4IbU5oXMjcEO-vG-fTG2xpKGLTQfMY6n9CBeW-0wkh7TldqfRzf-nW8_tdkpW8yXD3_cPYBzm1rgEKdW4Pd')" }}
            ></motion.div>
            <div className="absolute inset-y-0 left-8 flex flex-col justify-center z-20">
              <span className="text-white/80 font-label-md text-[10px] tracking-widest uppercase mb-1">Tech</span>
              <h2 className="font-headline-xl text-white">Precision Gear</h2>
              <Link href="/products?category=tech" className="text-white font-label-md underline underline-offset-8 mt-2 hover:text-primary-fixed transition-colors">Shop Tech</Link>
            </div>
          </div>

          {/* Tertiary: Accessories */}
          <div className="md:col-span-5 md:row-span-1 relative overflow-hidden rounded-2xl group hero-collage-item h-[260px] md:h-auto">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
            <motion.div 
              className="absolute -inset-6 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" 
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
              style={{ y: y3, backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAMIlOSJ-S3DfXE-j911pCpmUNRzybO7vqYhVUOGfITb6LY4z2ZDAXERcI1DDqicxgk8KtzlZZvUHx32H1UnWVA7W6QI8Gvvxwxiir0iWbbgf9lo5LOkgEvzpfiyZcwADXabTBFU2y83_-ovZ4WihZXOCJ-ZhKCguK7_xvQJaaDVrVCbjKB4YYgxXyBYTYX2st8aSOe-ARW-20QnoikN7qrpzam9QQvqbAxidVt1c5Gw6tmmn8LCzRb')" }}
            ></motion.div>
            <div className="absolute top-8 right-8 text-right z-20">
              <span className="text-white font-label-md text-[10px] tracking-widest uppercase mb-1 block">Accessories</span>
              <h2 className="font-headline-xl text-white">Curated Details</h2>
            </div>
          </div>
        </div>
      </section>

      {/* The Essence of LUXE (Editorial) */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center md:py-40">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display-sm text-on-surface mb-8"
        >
          Redefining the baseline.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-body-lg text-on-surface-variant text-xl md:text-2xl leading-relaxed"
        >
          We architect artifacts that bridge the gap between high-performance technology and high-fashion aesthetics. Uncompromising material quality combined with silent, seamless utility.
        </motion.p>
      </section>

      {/* Featured Categories - Sticky Overlap */}
      <section className="relative mx-auto mb-20 max-w-[1440px] px-4 md:px-6 py-8 md:mb-32">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-12">
          <h2 className="font-headline-xl text-on-surface text-3xl md:text-5xl">Explore by Discipline</h2>
        </div>
        
        <div className="flex flex-col gap-8 relative">
          {[
            { 
              title: "Technology", 
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAogO9w9FGXtQ5_ueTVMaY9Na3X2_URRO5zqqRVwd0KkzZG3NkzviHo_Idw5_1l1oXHtm8CP2-jok1K90zuX6CK_B42NlUtTiJcfwxfjoOgc09jWcL-_ZZMsqQ6M7aNlaoYywD__XwXyfMhmmgwTS1k65vsZlAhiViLl4IbU5oXMjcEO-vG-fTG2xpKGLTQfMY6n9CBeW-0wkh7TldqfRzf-nW8_tdkpW8yXD3_cPYBzm1rgEKdW4Pd", 
              link: "/products?category=tech",
              bgPos: "bg-center"
            },
            { 
              title: "Fashion", 
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCX3F2C5aka18RZtJ5yd0KTYBdvMe5_MfVP3oGZUOoPNZZbiBz1rEf_GKz6xuqbhcDD7dppvssJtqkHbIsIkEXAjhgn3aZYWtNJFH2zli46um0RS_amfF07Vht4yWURf0PcAV2nezBDOctbWn4N6xdZNGhsPUILKIlFR5TGIC7FD5u5o9CEyEKS1ZsZAzt7PeCUvXzSSHSQQ2xcK1ZG9_8zIY4zpja8zjB-FshWasieAJrAQVUm-DhX", 
              link: "/products?category=fashion",
              bgPos: "bg-[center_top]"
            },
            { 
              title: "Accessories", 
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMIlOSJ-S3DfXE-j911pCpmUNRzybO7vqYhVUOGfITb6LY4z2ZDAXERcI1DDqicxgk8KtzlZZvUHx32H1UnWVA7W6QI8Gvvxwxiir0iWbbgf9lo5LOkgEvzpfiyZcwADXabTBFU2y83_-ovZ4WihZXOCJ-ZhKCguK7_xvQJaaDVrVCbjKB4YYgxXyBYTYX2st8aSOe-ARW-20QnoikN7qrpzam9QQvqbAxidVt1c5Gw6tmmn8LCzRb", 
              link: "/products?category=accessories",
              bgPos: "bg-center"
            },
          ].map((cat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="sticky w-full origin-top"
              style={{
                top: `calc(var(--nav-h) + 1rem + ${i * 2}rem)`,
                zIndex: i + 1,
              }}
            >
              <Link href={cat.link} className="relative block w-full h-[clamp(18rem,48svh,32rem)] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] border border-outline-variant/30 bg-surface">
                <div className={`absolute inset-0 bg-cover ${cat.bgPos} transition-transform duration-[1.5s] group-hover:scale-105`} style={{ backgroundImage: `url('${cat.img}')` }}></div>
                <div className="scrim-bottom absolute inset-0"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
                  <span className="text-white/80 font-label-md tracking-widest uppercase mb-4 block transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">Shop Collection</span>
                  <h3 className="font-headline-xl text-white text-4xl md:text-7xl transform translate-y-0 group-hover:-translate-y-4 transition-transform duration-500">{cat.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Now / Bento Grid Section */}
      <section className="bg-surface relative mx-auto mt-10 max-w-[1440px] rounded-t-[2rem] px-6 py-20 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.05)] md:rounded-t-[3rem] md:py-32">
        <div className="hairline absolute top-0 left-1/2 h-px w-[80%] -translate-x-1/2"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-16"
        >
          <div>
            <h2 className="font-headline-xl text-on-surface text-3xl md:text-5xl">Trending Now</h2>
            <p className="text-on-surface-variant font-body-md mt-2">Highly-coveted pieces curated for this week.</p>
          </div>
          <Link href="/products" className="font-label-md text-primary flex items-center gap-2 hover:gap-3 transition-all duration-300 group">
            View All <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {trendingProducts.length > 0 ? (
              trendingProducts.map((product, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                  key={product._id || product.id || index}
                  className="group cursor-pointer flex flex-col"
                >
                  <Link href={productHref(product.slug) ?? "/products"} className="flex-1 flex flex-col">
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-surface-container-low mb-6 soft-shadow">
                      {product.images && product.images.length > 0 ? (
                        <ProductImage 
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" 
                          src={product.images[0]} 
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant/50">No image</div>
                      )}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleItem({
                            id: product._id || product.id || '',
                            name: product.name,
                            price: product.price,
                            compareAtPrice: product.compareAtPrice,
                            image: product.images?.[0] || '',
                            slug: product.slug,
                          });
                          if (!isInWishlist(product._id || product.id || '')) {
                            toast.success('Added to Wishlist', { icon: '❤️' });
                          } else {
                            toast('Removed from Wishlist');
                          }
                        }}
                        className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md flex items-center justify-center transition-all duration-300 md:opacity-0 transform md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 z-20 active:scale-90 ${isInWishlist(product._id || product.id || '') ? 'text-red-500 opacity-100 translate-y-0' : 'text-white hover:bg-primary hover:text-white'}`}
                      >
                        <Heart className="w-5 h-5" fill={isInWishlist(product._id || product.id || '') ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          addItem({
                            id: product._id || product.id || '',
                            name: product.name,
                            price: product.price,
                            quantity: 1,
                            image: product.images?.[0] || ''
                          });
                          toast.success(`${product.name} added to cart`, {
                            action: {
                              label: 'View Cart',
                              onClick: () => setCartOpen(true)
                            },
                          });
                        }}
                        className="absolute bottom-4 right-4 w-12 h-12 bg-surface rounded-full flex items-center justify-center shadow-lg md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 z-10 hover:bg-primary hover:text-white active:scale-90 text-on-surface"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-[#00C853] font-label-md font-bold whitespace-nowrap">₹{product.price.toFixed(2)}</p>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <p className="text-on-surface-variant font-label-md line-through opacity-60 text-xs whitespace-nowrap">
                              ₹{product.compareAtPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-on-surface-variant font-body-md border border-dashed border-outline-variant/50 rounded-2xl">
                No trending products available at the moment.
              </div>
            )}
          </div>
        )}
      </section>

      {/* The Private Club (Newsletter) */}
      <section className="bg-surface-container-low border-outline-variant/30 relative overflow-hidden border-y py-20 md:py-32">
        <div className="bg-gradient-brand-soft absolute inset-0"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-label-md text-primary uppercase tracking-[0.3em] mb-6 block">The Inner Circle</span>
            <h2 className="font-display-sm text-on-surface mb-6 text-4xl md:text-5xl">Unparalleled access.</h2>
            <p className="font-body-lg text-on-surface-variant mb-12 text-lg md:text-xl max-w-2xl mx-auto">
              Join the LUXE private registry to unlock early access to our seasonal drops, exclusive members-only hardware, and curated architectural insights.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-[512px] mx-auto" onSubmit={(e) => { e.preventDefault(); toast.success('Welcome to the inner circle.'); }}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                className="flex-1 bg-surface border border-outline-variant/50 rounded-xl px-6 py-4 font-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
              <button 
                type="submit"
                className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label-md hover:bg-primary-container hover:text-on-primary-container active:scale-95 transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
              >
                Request Access
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
