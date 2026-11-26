'use client';

import { useEffect, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ProductImage from '@/components/products/ProductImage';
import { useProductStore, Category } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Heart, Filter, X, SearchX } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import { productHref } from '@/lib/productHref';

// Values the catalog service understands (catalog-service product.service.ts).
const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest First' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'rating', label: 'Popularity' },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]['key'];

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const { products, fetchProducts, isLoading, setFilter, filters, categories, fetchCategories } = useProductStore();
  const { addItem, setCartOpen } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(50000);

  useEffect(() => {
    fetchCategories();
    if (categoryParam) {
      setFilter('category', categoryParam);
    } else {
      fetchProducts({ sort: sortBy });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryParam]);

  // Re-query the server when the sort changes, rather than leaving the control inert.
  const handleSortChange = (key: SortKey) => {
    setSortBy(key);
    fetchProducts({ sort: key });
  };

  // Helper to find a category anywhere in the tree
  const findCategory = (slug: string, nodes: Category[]): Category | null => {
    for (const node of nodes) {
      if (node.slug === slug) return node;
      if (node.children && node.children.length > 0) {
        const found = findCategory(slug, node.children);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper to find parent of a category
  const findParentCategory = (slug: string, nodes: Category[]): Category | null => {
    for (const parent of nodes) {
      if (parent.children?.some((c) => c.slug === slug)) return parent;
      if (parent.children && parent.children.length > 0) {
        const nested = findParentCategory(slug, parent.children);
        if (nested) return nested;
      }
    }
    return null;
  };

  const currentSlug = filters.category;
  const currentCategory = currentSlug ? findCategory(currentSlug, categories) : null;
  const parentOfCurrent = currentSlug ? findParentCategory(currentSlug, categories) : null;

  // Active top-level category:
  const activeParentCategory = parentOfCurrent || (currentCategory && !currentCategory.parentCategory ? currentCategory : null);

  // Active subcategory (if any):
  const activeSubcategory = parentOfCurrent ? currentCategory : null;

  // Flatten all subcategories across the catalog when no parent is selected
  const allCatalogSubcategories = categories.flatMap((c) => c.children || []);

  const handleTopLevelCategorySelect = (catSlug: string) => {
    if (activeParentCategory?.slug === catSlug && !activeSubcategory) {
      // Toggle off if already selected and no subcategory
      setFilter('category', null);
    } else {
      setFilter('category', catSlug);
    }
  };

  const handleSubcategorySelect = (subSlug: string) => {
    if (filters.category === subSlug) {
      // If clicking active subcategory again, fall back to its parent category
      setFilter('category', activeParentCategory ? activeParentCategory.slug : null);
    } else {
      setFilter('category', subSlug);
    }
  };

  return (
    <div className="min-h-below-nav bg-surface text-on-surface font-body-md relative flex">
      
      {/* Mobile Filter Toggle */}
      <div className="fixed right-6 bottom-24 z-50 lg:hidden">
        <button 
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="bg-primary text-white p-4 rounded-full shadow-lg active:scale-95 transition-transform"
        >
          {mobileFilterOpen ? <X size={24} /> : <Filter size={24} />}
        </button>
      </div>

      {/* SideNavBar (Filter Drawer) - Categories on Left */}
      <aside className={`${mobileFilterOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 top-nav h-below-nav fixed left-0 z-40 w-80 lg:sticky bg-surface border-r border-outline-variant/30 shadow-sm transition-transform duration-500 overflow-y-auto`}>
        <div className="flex flex-col h-full py-10 px-6">
          <div className="mb-8">
            <h2 className="font-headline-lg text-2xl text-on-surface font-bold">Filters</h2>
            <p className="text-on-surface-variant text-body-md mt-1">Refine your selection</p>
          </div>
          
          <div className="space-y-8 flex-grow">
            {/* Categories Section on the Left */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-l-4 border-primary pl-4 py-0.5">
                <span className="text-on-surface font-bold text-label-md uppercase tracking-wider">
                  Category
                </span>
                {activeParentCategory && (
                  <button
                    onClick={() => setFilter('category', null)}
                    className="text-[11px] text-primary hover:underline font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="pl-4 space-y-1.5 py-1">
                {/* All Categories Option */}
                <div 
                  onClick={() => setFilter('category', null)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    !activeParentCategory
                      ? 'bg-primary/15 text-primary font-bold'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="category-left"
                      checked={!activeParentCategory}
                      onChange={() => setFilter('category', null)}
                      className="w-4 h-4 text-primary focus:ring-primary bg-transparent cursor-pointer" 
                    />
                    <span className="text-label-md">All Categories</span>
                  </div>
                </div>

                {/* Top-Level Categories */}
                {categories.map((cat) => {
                  const isSelected = activeParentCategory?.slug === cat.slug;
                  const subCount = cat.children?.length || 0;
                  return (
                    <div 
                      key={cat._id} 
                      onClick={() => handleTopLevelCategorySelect(cat.slug)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all group ${
                        isSelected
                          ? 'bg-primary/15 text-primary font-bold'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="category-left"
                          checked={isSelected}
                          onChange={() => handleTopLevelCategorySelect(cat.slug)}
                          className="w-4 h-4 text-primary focus:ring-primary bg-transparent cursor-pointer" 
                        />
                        <span className="text-label-md capitalize group-hover:translate-x-0.5 transition-transform">
                          {cat.name}
                        </span>
                      </div>
                      {subCount > 0 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container-high/70 text-on-surface-variant font-medium">
                          {subCount}
                        </span>
                      )}
                    </div>
                  );
                })}
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
              fetchProducts({ sort: sortBy });
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
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="font-headline-xl text-on-surface mb-3 capitalize">
              {activeSubcategory
                ? `${activeSubcategory.name}`
                : activeParentCategory
                ? `${activeParentCategory.name} Collection`
                : "Full Collection"}
            </h1>
            <p className="text-on-surface-variant max-w-2xl font-body-md text-lg">
              {activeSubcategory
                ? `Explore our collection of ${activeSubcategory.name} in ${activeParentCategory?.name || 'our catalog'}.`
                : activeParentCategory
                ? `Explore all products in ${activeParentCategory.name}. Browse sub-categories above to narrow down your view.`
                : 'A curated fusion of cutting-edge technology and avant-garde fashion essentials. Every piece is selected for the discerning minimalist.'}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/30">
            <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortKey)}
              aria-label="Sort products"
              className="font-label-md text-on-surface cursor-pointer border-none bg-transparent py-1 outline-none focus:ring-0"
            >
              {SORT_OPTIONS.map(({ key, label }) => (
                <option key={key} value={key} className="text-black">
                  {label}
                </option>
              ))}
            </select>
          </div>
        </motion.header>

        {/* Top Horizontal Sub-categories Section */}
        <div className="mb-10 space-y-3">
          {activeSubcategory && (
            <div className="flex items-center justify-end">
              <button
                onClick={() => setFilter('category', activeParentCategory ? activeParentCategory.slug : null)}
                className="text-xs text-primary hover:underline font-medium"
              >
                View all in {activeParentCategory?.name || 'all'}
              </button>
            </div>
          )}

          {/* Horizontal Pills for Sub-categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {activeParentCategory ? (
              <>
                {/* "All in <Category>" pill */}
                <button
                  onClick={() => setFilter('category', activeParentCategory.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap capitalize ${
                    !activeSubcategory
                      ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105'
                      : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
                  }`}
                >
                  All {activeParentCategory.name}
                </button>

                {/* Subcategories belonging to active parent category */}
                {activeParentCategory.children && activeParentCategory.children.length > 0 ? (
                  activeParentCategory.children.map((sub) => {
                    const isSelected = activeSubcategory?.slug === sub.slug;
                    return (
                      <button
                        key={sub._id}
                        onClick={() => handleSubcategorySelect(sub.slug)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap capitalize ${
                          isSelected
                            ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105'
                            : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
                        }`}
                      >
                        {sub.name}
                      </button>
                    );
                  })
                ) : (
                  <span className="text-xs text-on-surface-variant/70 italic py-1 px-3 bg-surface-container-low rounded-full border border-outline-variant/20">
                    No sub-categories created for {activeParentCategory.name} yet
                  </span>
                )}
              </>
            ) : (
              <>
                {/* When no category is selected on the left: All Products + all catalog subcategories */}
                <button
                  onClick={() => setFilter('category', null)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    !filters.category
                      ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105'
                      : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
                  }`}
                >
                  All Products
                </button>

                {allCatalogSubcategories.map((sub) => {
                  const isSelected = filters.category === sub.slug;
                  return (
                    <button
                      key={sub._id}
                      onClick={() => handleSubcategorySelect(sub.slug)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap capitalize ${
                        isSelected
                          ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105'
                          : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
                      }`}
                    >
                      {sub.name}
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>

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
                      <Link href={productHref(product.slug) ?? "/products"}>
                        {product.images && product.images.length > 0 ? (
                          <ProductImage 
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" 
                            src={product.images[0]} 
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-on-surface-variant/50">No Image</div>
                        )}
                      </Link>

                      {/* Stock Badges */}
                      {product.stock !== undefined && product.stock <= (product.lowStockThreshold || 5) && product.stock > 0 && (
                        <span className="absolute top-4 left-4 z-20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-amber-500/90 text-black backdrop-blur-sm shadow-md animate-pulse">
                          Only {product.stock} left!
                        </span>
                      )}
                      {product.stock === 0 && (
                        <span className="absolute top-4 left-4 z-20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-rose-600/90 text-white backdrop-blur-sm shadow-md">
                          Out of Stock
                        </span>
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
                      
                      <div className="scrim-bottom absolute bottom-0 left-0 w-full p-4 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
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
                        <Link href={productHref(product.slug) ?? "/products"} className="flex-1 min-w-0">
                          <h3 className="font-body-md font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 bg-surface-container-low px-2 py-1 rounded-md shrink-0">
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
                      <p className="text-on-surface-variant font-caption line-clamp-3 mt-1 leading-relaxed">
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
    <Suspense fallback={<div className="min-h-svh flex items-center justify-center font-body-md text-on-surface-variant">Loading collection...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
