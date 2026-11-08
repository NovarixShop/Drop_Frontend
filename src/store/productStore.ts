import { create } from 'zustand';
import api from '../lib/api';

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  images: string[];
  stock: number;
  slug: string;
  tax?: number;
  shippingCost?: number;
  isCodAvailable?: boolean;
}

interface ProductState {
  products: Product[];
  trendingProducts: Product[];
  productDetails: Record<string, Product>;
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  filters: {
    category: string | null;
    priceRange: [number, number] | null;
  };
  
  // Actions
  fetchProducts: (query?: Record<string, unknown>) => Promise<void>;
  fetchTrendingProducts: () => Promise<void>;
  fetchProductBySlug: (slug: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  setFilter: (key: keyof ProductState['filters'], value: unknown) => void;
  clearFilters: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  trendingProducts: [],
  productDetails: {},
  categories: [],
  isLoading: false,
  error: null,
  filters: {
    category: null,
    priceRange: null,
  },

  fetchProducts: async (query = {}) => {
    set({ isLoading: true, error: null });
    try {
      // Build query string from filters and passed query
      const { filters } = get();
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.priceRange) {
        params.append('minPrice', filters.priceRange[0].toString());
        params.append('maxPrice', filters.priceRange[1].toString());
      }
      
      // Merge with passed query
      Object.entries(query).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await api.get(`/products?${params.toString()}`);
      set({ products: response.data.data.products, isLoading: false });
    } catch (error: unknown) {
      const err = error as Error;
      set({ error: err.message || 'Failed to fetch products', isLoading: false });
    }
  },

  fetchTrendingProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      // Assuming sorting by -createdAt or a specific popularity flag. 
      // We limit to 4 for the trending section.
      const response = await api.get('/products?sort=-createdAt&limit=4');
      set({ trendingProducts: response.data.data.products, isLoading: false });
    } catch (error: unknown) {
      const err = error as Error;
      set({ error: err.message || 'Failed to fetch trending products', isLoading: false });
    }
  },

  fetchProductBySlug: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/products/slug/${slug}`);
      const product = response.data.data.product;
      set((state) => ({
        productDetails: { ...state.productDetails, [slug]: product },
        isLoading: false,
      }));
    } catch (error: unknown) {
      const err = error as Error;
      set({ error: err.message || 'Failed to fetch product details', isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await api.get('/categories');
      set({ categories: response.data.data.categories });
    } catch (error: unknown) {
      console.error('Failed to fetch categories:', error);
    }
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    }));
    // Automatically refetch when filters change
    get().fetchProducts();
  },

  clearFilters: () => {
    set({
      filters: {
        category: null,
        priceRange: null,
      },
    });
    get().fetchProducts();
  },
}));
