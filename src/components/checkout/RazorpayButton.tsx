'use client';

import React, { useState } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import { loadRazorpayCheckout, openRazorpayCheckout, RazorpayDismissedError } from '@/lib/razorpay';
import { toast } from 'sonner';

interface RazorpayButtonProps {
  amount: number; // in INR (e.g. 499 for ₹499)
  currency?: string;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess?: (handles: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onError?: (err: unknown) => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function RazorpayButton({
  amount,
  currency = 'INR',
  name = 'NOVARIX',
  description = 'Online Payment',
  prefill,
  onSuccess,
  onError,
  className,
  disabled = false,
  children,
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (disabled || loading) return;
    setLoading(true);

    try {
      // 1. Ensure checkout.js is loaded
      await loadRazorpayCheckout();

      // 2. Call backend to create Razorpay Order (converting INR to paise: min 100 paise)
      const amountInPaise = Math.max(100, Math.round(amount * 100));
      const res = await api.post('/create-order', {
        amount: amountInPaise,
        currency,
        receipt: `rcpt_${Date.now()}`,
      });

      const { order_id, key_id } = res.data;

      // 3. Open Razorpay Standard Checkout Modal
      const handles = await openRazorpayCheckout(
        {
          keyId: key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
          razorpayOrderId: order_id,
          amount: amountInPaise,
          currency,
          orderId: order_id,
        },
        {
          name,
          description,
          prefill,
        }
      );

      // 4. Verify payment signature on backend
      const verifyRes = await api.post('/verify-payment', {
        order_id: handles.razorpay_order_id,
        payment_id: handles.razorpay_payment_id,
        signature: handles.razorpay_signature,
      });

      if (verifyRes.data.success) {
        toast.success('Payment completed successfully!');
        onSuccess?.(handles);
      } else {
        throw new Error('Payment verification failed.');
      }
    } catch (err: unknown) {
      if (err instanceof RazorpayDismissedError) {
        toast.info('Payment was cancelled.');
      } else {
        const msg = getErrorMessage(err, 'Payment failed. Please try again.');
        toast.error(msg);
      }
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={disabled || loading}
      className={
        className ||
        'w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
      }
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      ) : (
        children || (
          <>
            <span>Pay with Razorpay</span>
            <span>₹{amount.toFixed(2)}</span>
          </>
        )
      )}
    </button>
  );
}
