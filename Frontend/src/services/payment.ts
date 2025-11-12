/**
 * Payment Service
 * Razorpay payment integration
 */

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number; // Amount in paise
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentOrderData {
  amount: number;
  currency: string;
  receipt?: string;
  notes?: Record<string, string>;
}

/**
 * Load Razorpay script dynamically
 */
export const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });
};

/**
 * Initialize Razorpay payment
 */
export const initializePayment = async (
  options: Omit<RazorpayOptions, 'handler' | 'modal'>,
  onSuccess: (response: RazorpayResponse) => void | Promise<void>,
  onDismiss?: () => void
): Promise<void> => {
  try {
    // Load Razorpay script if not already loaded
    await loadRazorpayScript();

    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not loaded');
    }

    const razorpayOptions: RazorpayOptions = {
      ...options,
      handler: async (response: RazorpayResponse) => {
        try {
          await onSuccess(response);
        } catch (error) {
          console.error('Payment success handler error:', error);
          throw error;
        }
      },
      modal: {
        ondismiss: () => {
          if (onDismiss) {
            onDismiss();
          }
        }
      }
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  } catch (error) {
    console.error('Failed to initialize Razorpay payment:', error);
    throw error;
  }
};

/**
 * Format amount to paise (multiply by 100)
 */
export const formatAmountToPaise = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Format amount from paise to rupees (divide by 100)
 */
export const formatAmountFromPaise = (paise: number): number => {
  return paise / 100;
};

