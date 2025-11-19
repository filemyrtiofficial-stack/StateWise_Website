/**
 * Payment Hook
 * Manages payment state and flow
 */

import { useState, useCallback } from 'react';
import { paymentsAPI } from '../services/api';
import { initializePayment, formatAmountToPaise, RazorpayResponse } from '../services/payment';
import { RTIModel } from '../types/services';

export type PaymentStatus = 'idle' | 'creating_order' | 'processing' | 'verifying' | 'success' | 'failed';

export interface PaymentState {
  status: PaymentStatus;
  orderId: string | null;
  paymentId: string | null;
  error: string | null;
}

export interface UsePaymentReturn {
  paymentState: PaymentState;
  initiatePayment: (
    model: RTIModel,
    userData: {
      name: string;
      email: string;
      mobile: string;
    },
    onSuccess: (paymentId: string, orderId: string) => void | Promise<void>,
    onError?: (error: string) => void,
    onCancel?: () => void
  ) => Promise<void>;
  resetPayment: () => void;
}

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

export const usePayment = (): UsePaymentReturn => {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    status: 'idle',
    orderId: null,
    paymentId: null,
    error: null
  });

  const resetPayment = useCallback(() => {
    setPaymentState({
      status: 'idle',
      orderId: null,
      paymentId: null,
      error: null
    });
  }, []);

  const initiatePayment = useCallback(
    async (
      model: RTIModel,
      userData: { name: string; email: string; mobile: string },
      onSuccess: (paymentId: string, orderId: string) => void | Promise<void>,
      onError?: (error: string) => void,
      onCancel?: () => void
    ) => {
      try {
        // Reset previous state
        resetPayment();

        // Step 1: Create order
        setPaymentState(prev => ({ ...prev, status: 'creating_order', error: null }));

        const orderResponse = await paymentsAPI.createOrder({
          amount: formatAmountToPaise(model.price),
          currency: 'INR',
          receipt: `RTI_${model.id}_${Date.now()}`,
          notes: {
            service_id: model.id,
            service_name: model.name,
            user_name: userData.name,
            user_email: userData.email,
            user_mobile: userData.mobile
          }
        }) as any;

        if (!orderResponse?.success || !orderResponse?.data?.id) {
          throw new Error(orderResponse?.message || 'Failed to create payment order');
        }

        const orderId = orderResponse.data.id;
        setPaymentState(prev => ({ ...prev, orderId, status: 'processing' }));

        // Validate Razorpay key
        if (!RAZORPAY_KEY || RAZORPAY_KEY.trim() === '') {
          throw new Error('Razorpay Key ID is missing. Please configure VITE_RAZORPAY_KEY_ID in your .env file.');
        }

        // Step 2: Initialize Razorpay payment
        await initializePayment(
          {
            key: RAZORPAY_KEY,
            amount: formatAmountToPaise(model.price),
            currency: 'INR',
            name: 'FileMyRTI',
            description: `Payment for ${model.name}`,
            order_id: orderId,
            prefill: {
              name: userData.name,
              email: userData.email,
              contact: userData.mobile
            },
            theme: {
              color: '#4F46E5' // Primary color
            }
          },
          async (response: RazorpayResponse) => {
            try {
              // Step 3: Verify payment
              setPaymentState(prev => ({ ...prev, status: 'verifying' }));

              const verifyResponse = await paymentsAPI.verifyPayment({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                order_id: orderId
              }) as any;

              if (!verifyResponse?.success) {
                throw new Error(verifyResponse?.message || 'Payment verification failed');
              }

              // Payment successful
              setPaymentState(prev => ({
                ...prev,
                status: 'success',
                paymentId: response.razorpay_payment_id
              }));

              // Call success callback
              await onSuccess(response.razorpay_payment_id, orderId);
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
              setPaymentState(prev => ({
                ...prev,
                status: 'failed',
                error: errorMessage
              }));

              if (onError) {
                onError(errorMessage);
              } else {
                throw error;
              }
            }
          },
          () => {
            // Payment dismissed/cancelled
            setPaymentState(prev => ({
              ...prev,
              status: 'idle',
              error: null // Clear error on cancellation
            }));
            // Call onCancel callback to close modal and reset form
            if (onCancel) {
              onCancel();
            }
          }
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed';
        setPaymentState(prev => ({
          ...prev,
          status: 'failed',
          error: errorMessage
        }));

        if (onError) {
          onError(errorMessage);
        } else {
          console.error('Payment error:', error);
        }
      }
    },
    [resetPayment]
  );

  return {
    paymentState,
    initiatePayment,
    resetPayment
  };
};

