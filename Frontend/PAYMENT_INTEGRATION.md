# Payment Integration Guide

## Overview

Payment integration has been successfully implemented across all RTI service models using Razorpay. The payment flow is integrated into the consultation form submission process.

## Architecture

### Components Created

1. **Payment Service** (`src/services/payment.ts`)
   - Razorpay SDK integration
   - Payment initialization and handling
   - Amount formatting utilities

2. **Payment Hook** (`src/hooks/usePayment.ts`)
   - Payment state management
   - Payment flow orchestration
   - Error handling

3. **Payment API** (`src/services/api.ts`)
   - Backend API integration for payment orders
   - Payment verification
   - Order status checking

### Integration Points

1. **ConsultationModal Component**
   - Displays payment status
   - Shows payment errors
   - Updates button text based on payment state

2. **RTIModelPage Component**
   - Initiates payment before form submission
   - Handles payment success/failure
   - Submits application after successful payment

## Payment Flow

```
1. User fills consultation form
2. User clicks "Pay & Book Consultation"
3. Payment order is created on backend
4. Razorpay payment modal opens
5. User completes payment
6. Payment is verified on backend
7. Application is submitted with payment details
8. Success message shown to user
```

## Environment Variables

Add the following to your `.env` file:

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Backend Requirements

The backend needs to implement the following endpoints:

### 1. Create Payment Order
```
POST /api/v1/payments/create-order
Body: {
  amount: number (in paise),
  currency: string,
  receipt?: string,
  notes?: Record<string, string>
}
Response: {
  success: boolean,
  data: {
    id: string (order_id)
  }
}
```

### 2. Verify Payment
```
POST /api/v1/payments/verify
Body: {
  razorpay_payment_id: string,
  razorpay_order_id: string,
  razorpay_signature: string,
  order_id: string
}
Response: {
  success: boolean,
  message?: string
}
```

### 3. Get Order Status
```
GET /api/v1/payments/order/:orderId
Response: {
  success: boolean,
  data: {
    status: string,
    payment_id?: string
  }
}
```

## RTI Application Submission

After successful payment, the RTI application is submitted with additional payment fields:

```typescript
{
  ...applicationData,
  payment_id: string,
  order_id: string
}
```

## Payment Status States

- `idle`: No payment in progress
- `creating_order`: Creating payment order on backend
- `processing`: Payment modal open, user completing payment
- `verifying`: Verifying payment on backend
- `success`: Payment successful
- `failed`: Payment failed

## Error Handling

- Payment errors are displayed in the modal
- If payment succeeds but application submission fails, user is notified with payment ID for support
- Payment can be cancelled by user (modal dismissal)

## Testing

1. Use Razorpay test keys for development
2. Test payment flow with test cards
3. Verify payment verification works correctly
4. Test error scenarios (payment failure, network errors)

## Security Notes

- Never expose Razorpay secret key in frontend
- Always verify payments on backend
- Use HTTPS in production
- Validate payment signatures server-side

