import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';

export interface UserAddress {
  _id?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  addresses?: UserAddress[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setAccessToken: (token: string) => void;
  updateUser: (user: Partial<User>) => void;
  fetchProfile: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAccessToken: (token) => {
        set({ accessToken: token, isAuthenticated: !!token });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : (userData as User),
        }));
      },

      fetchProfile: async () => {
        try {
          const res = await api.get('/users/profile');
          const user = res.data.data?.user;
          if (user) {
            set((state) => ({
              user: {
                ...state.user,
                ...user,
              },
            }));
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
        }
      },

      clearError: () => set({ error: null }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/auth/login', { email, password });
          const { user, accessToken } = res.data.data;
          
          set({
            user,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string } } };
          const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/auth/register', { name, email, password });
          set({ isLoading: false, error: null });
          // Registration typically doesn't auto-login if email verification is required
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string } } };
          const message = err.response?.data?.message || 'Registration failed.';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          // Attempt to notify the server (ignore errors if token already expired)
          await api.post('/auth/logout').catch(() => {});
        } finally {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      partialize: (state) => ({ 
        user: state.user, 
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated 
      }), // only save these fields
    }
  )
);
