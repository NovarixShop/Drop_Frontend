import { create } from 'zustand';
import api from '../lib/api';

export interface RewardCoupon {
  code: string;
  label: string;
  minOrderValue: number;
  expiryDate: string;
  status: 'available' | 'used' | 'expired';
}

export interface PlayResult {
  prize: string;
  segmentIndex: number;
  coupon: RewardCoupon | null;
}

// Must match SPIN_SEGMENTS in cart-service/src/services/reward.service.ts (the server picks the slice)
export const SPIN_SEGMENTS = ['10% OFF', 'Try Again', 'Free Shipping', '20% OFF', 'Try Again', '5% OFF'];

export interface GamificationState {
  loaded: boolean;
  hasPurchased: boolean;
  spinsAvailable: number;
  scratchCards: number;
  coupons: RewardCoupon[];
  fetchRewards: () => Promise<void>;
  spin: () => Promise<PlayResult>;
  scratch: () => Promise<PlayResult>;
  reset: () => void;
}

const initialState = {
  loaded: false,
  hasPurchased: false,
  spinsAvailable: 0,
  scratchCards: 0,
  coupons: [] as RewardCoupon[],
};

// Rewards used to live in localStorage, where they could be edited; drop the stale copy
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('gamification-storage');
  } catch {}
}

// Plays and prizes are decided by the server; this store only mirrors them
export const useGamificationStore = create<GamificationState>()((set) => ({
  ...initialState,

  fetchRewards: async () => {
    const res = await api.get('/rewards');
    const { hasPurchased, spinsAvailable, scratchCardsAvailable, coupons } = res.data.data.rewards;
    set({ loaded: true, hasPurchased, spinsAvailable, scratchCards: scratchCardsAvailable, coupons });
  },

  // Returns the prize without refreshing the coupon list, so the UI can reveal it first
  spin: async () => {
    const res = await api.post('/rewards/spin');
    set({ spinsAvailable: 0 });
    return res.data.data.result;
  },

  scratch: async () => {
    const res = await api.post('/rewards/scratch');
    set((state) => ({ scratchCards: Math.max(0, state.scratchCards - 1) }));
    return res.data.data.result;
  },

  reset: () => set(initialState),
}));
