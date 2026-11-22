'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api, getErrorMessage } from '@/lib/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
  Package,
  Heart,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface ProfileAddress {
  _id?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser, fetchProfile } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login?redirect=/profile');
      return;
    }

    const init = async () => {
      try {
        const res = await api.get('/users/profile');
        const userData = res.data.data?.user;
        if (userData) {
          setName(userData.name || '');
          setPhone(userData.phone || '');
          const defaultAddr = userData.addresses?.find((a: ProfileAddress) => a.isDefault) || userData.addresses?.[0];
          if (defaultAddr) {
            setStreet(defaultAddr.street || '');
            setCity(defaultAddr.city || '');
            setState(defaultAddr.state || '');
            setPostalCode(defaultAddr.postalCode || '');
            setCountry(defaultAddr.country || 'India');
          }
          updateUser(userData);
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setInitialLoading(false);
      }
    };

    init();
  }, [isAuthenticated, router, updateUser]);

  const isProfileComplete = Boolean(
    name.trim() &&
    user?.email &&
    phone.trim() &&
    street.trim() &&
    city.trim() &&
    state.trim() &&
    postalCode.trim()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required.');
      return;
    }
    if (!phone.trim()) {
      toast.error('Phone number is required to place orders.');
      return;
    }

    setSaving(true);
    try {
      const res = await api.put('/users/profile', {
        name: name.trim(),
        phone: phone.trim(),
        address: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          country: country.trim() || 'India',
        },
      });

      const updated = res.data.data?.user;
      if (updated) {
        updateUser(updated);
      }
      toast.success('Profile credentials updated successfully!');
      fetchProfile();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update profile. Please try again.'));
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-[60svh] flex items-center justify-center gap-3 text-on-surface-variant">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span>Loading your profile details...</span>
      </div>
    );
  }

  return (
    <div className="min-h-below-nav bg-surface text-on-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-low border border-outline-variant/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl font-bold text-on-surface tracking-tight">
                {user?.name || 'Customer Account'}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
            <p className="text-sm text-on-surface-variant flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>{user?.email}</span>
            </p>
            <p className="text-xs text-on-surface-variant/80 pt-1">
              Complete your profile credentials (name, phone number, and delivery address) to enable 1-click checkout and seamless order deliveries.
            </p>
          </div>
        </motion.div>

        {/* Order Readiness Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-4 rounded-2xl border flex items-start sm:items-center gap-3.5 ${
            isProfileComplete
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}
        >
          {isProfileComplete ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          )}
          <div className="flex-1 text-xs sm:text-sm">
            {isProfileComplete ? (
              <span>
                <strong className="font-semibold text-white">Profile Complete:</strong> Your credentials are fully verified. You can place orders smoothly with express courier delivery.
              </span>
            ) : (
              <span>
                <strong className="font-semibold text-white">Action Required to Place Orders:</strong> Please provide your active phone number and default delivery address below before placing orders.
              </span>
            )}
          </div>
        </motion.div>

        {/* Profile Credentials Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-container-low border border-outline-variant/40 rounded-3xl p-6 sm:p-8 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg font-bold text-on-surface border-b border-outline-variant/30 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <span>Personal Credentials</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase text-on-surface-variant mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-surface border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Email (Read only) */}
              <div>
                <label className="block text-xs font-semibold uppercase text-on-surface-variant mb-2">
                  Signed-in Email (Account ID)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-on-surface-variant/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-surface-container-high/60 border border-outline-variant/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface-variant/80 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase text-on-surface-variant mb-2 flex items-center justify-between">
                  <span>Phone Number * (Required for Order Tracking & Delivery)</span>
                  <span className="text-[11px] text-primary lowercase font-normal">e.g. +91 9876543210</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full bg-surface border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant/70 mt-1">
                  Delivery couriers and dispatch partners will use this phone number for shipment coordination.
                </p>
              </div>
            </div>

            <h2 className="text-lg font-bold text-on-surface border-b border-outline-variant/30 pb-3 pt-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Default Shipping Address</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-on-surface-variant mb-1.5">
                  Street Address / Flat / Building *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. Flat 402, Lotus Residency, MG Road"
                  className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-on-surface-variant mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai, Bengaluru, Kolkata"
                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-on-surface-variant mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra, Karnataka, West Bengal"
                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-on-surface-variant mb-1.5">
                    PIN / Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 400001"
                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-on-surface-variant mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-on-surface-variant">
                Credentials are encrypted and safely stored in your account.
              </span>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all shadow-md shadow-primary/25 disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Profile Credentials</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/orders"
            className="p-5 bg-surface-container-low border border-outline-variant/40 rounded-2xl flex items-center justify-between hover:border-primary/50 transition-all group shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                  My Orders
                </h3>
                <p className="text-xs text-on-surface-variant">Track status, shipments & invoices</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/wishlist"
            className="p-5 bg-surface-container-low border border-outline-variant/40 rounded-2xl flex items-center justify-between hover:border-primary/50 transition-all group shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface group-hover:text-red-500 transition-colors">
                  Wishlist
                </h3>
                <p className="text-xs text-on-surface-variant">View your curated favorites</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

