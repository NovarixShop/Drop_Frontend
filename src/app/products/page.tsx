'use client';

import { useEffect, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Heart, Filter, X, SearchX } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import ProductSkeleton from '@/components/products/ProductSkeleton';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const { products, fetchProducts, isLoading, setFilter, filters, categories, fetchCategories } = useProductStore();
  const { addItem, setCartOpen } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Newest First');
  const [maxPrice, setMaxPrice] = useState<number>(50000);

  useEffect(() => {
    fetchCategories();
    if (categoryParam) {
      setFilter('category', categoryParam);
    } else {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryParam]);

  const handleCategoryChange = (cat: string) => {
    setFilter('category', filters.category === cat ? null : cat);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-surface text-on-surface font-body-md relative">
      
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="bg-primary text-white p-4 rounded-full shadow-lg active:scale-95 transition-transform"
        >
          {mobileFilterOpen ? <X size={24} /> : <Filter size={24} />}
        </button>
      </div>

      {/* SideNavBar (Filter Drawer) */}
      <aside className={`${mobileFilterOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-80 z-40 bg-surface border-r border-outline-variant/30 shadow-sm transition-transform duration-500 overflow-y-auto`}>
        <div className="flex flex-col h-full py-10 px-6">
          <div className="mb-10">
            <h2 className="font-headline-lg text-2xl text-on-surface font-bold">Filters</h2>
            <p className="text-on-surface-variant text-body-md mt-1">Refine your selection</p>
          </div>
          
          <div className="space-y-10 flex-grow">
            {/* Categories */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-on-surface font-bold border-l-4 border-primary pl-4 text-label-md uppercase tracking-wider">
                <span>Category</span>
              </div>
              <div className="pl-8 space-y-4 py-2">
                {categories.map((cat) => (
                  <label key={cat._id} className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors group">
                    <input 
                      type="checkbox" 
                      checked={filters.category === cat.slug}
                      onChange={() => handleCategoryChange(cat.slug)}
                      className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-transparent cursor-pointer" 
                    />
                    <span className="text-label-md capitalize group-hover:translate-x-1 transition-transform">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-on-surface-variant pl-4 hover:bg-surface-container-low transition-colors text-label-md py-2 uppercase tracking-wider font-bold">
                <span>Max Price: ₹{maxPrice}</span>
              </div>
              <div className="pl-8 py-2 pr-4">
                <input 
                  type="range" 
                  min="0"
                  max="50000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  onMouseUp={() => setFilter('priceRange', [0, maxPrice])}
                  onTouchEnd={() => setFilter('priceRange', [0, maxPrice])}
                  className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" 
                />
                <div className="flex justify-between mt-3 text-caption opacity-60">
                  <span>₹0</span>
                  <span>₹50000</span>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => {
              fetchProducts();
              setMobileFilterOpen(false);
            }}
            className="mt-10 w-full bg-primary text-on-primary py-4 rounded-xl font-label-md hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            Apply Filters
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 lg:px-12 py-12 lg:py-20 w-full overflow-x-hidden">
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="font-headline-xl text-on-surface mb-3 capitalize">
              {filters.category ? `${filters.category} Collection` : "Full Collection"}
            </h1>
            <p className="text-on-surface-variant max-w-2xl font-body-md text-lg">
              A curated fusion of cutting-edge technology and avant-garde fashion essentials. Every piece is selected for the discerning minimalist.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/30">
            <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Sort:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none py-1 focus:ring-0 font-label-md text-on-surface outline-none cursor-pointer"
            >
              <option className="text-black">Newest First</option>
              <option className="text-black">Price: High to Low</option>
              <option className="text-black">Price: Low to High</option>
              <option className="text-black">Popularity</option>
            </select>
          </div>
        </motion.header>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-12">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-12 pb-24 md:pb-0">
              {products.length > 0 ? (
                products.map((product, idx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: (idx % 4) * 0.1, duration: 0.5 }}
                    key={product._id || product.id || idx} 
                    className="product-card-hover group relative flex flex-col transition-all duration-500"
                  >
                    <div className="aspect-[4/5] relative overflow-hidden bg-surface-container-low rounded-2xl mb-6 soft-shadow">
                      <Link href={`/products/${product.slug}`}>
                        {product.images && product.images.length > 0 ? (
                          <Image 
                            src={product.images[0]} 
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-on-surface-variant/50">No Image</div>
                        )}
                      </Link>
                      
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
                      
                      <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
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
                          className="w-full bg-white text-black py-3 rounded-xl font-label-md hover:bg-primary hover:text-white transition-colors active:scale-95 shadow-lg"
                        >
                          Quick Add
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 flex-grow px-2">
                      <div className="flex justify-between items-start gap-4">
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="font-body-md font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 bg-surface-container-low px-2 py-1 rounded-md">
                          <p className="font-label-md text-[#00C853] font-bold whitespace-nowrap">
                            ₹{product.price.toFixed(2)}
                          </p>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <p className="font-label-md text-on-surface-variant line-through whitespace-nowrap opacity-60 text-xs">
                              ₹{product.compareAtPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-on-surface-variant font-caption line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full flex flex-col items-center justify-center py-32 text-center"
                >
                  <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
                    <SearchX className="w-10 h-10 text-on-surface-variant opacity-60" />
                  </div>
                  <h3 className="font-headline-lg mb-2 text-on-surface">No products found</h3>
                  <p className="text-on-surface-variant max-w-[384px] mx-auto mb-8 font-body-md text-lg">We couldn&apos;t find anything matching your current filters. Try adjusting your selection.</p>
                  <button 
                    onClick={() => setFilter('category', null)} 
                    className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label-md hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 shadow-lg shadow-primary/20"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-body-md text-on-surface-variant">Loading collection...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
