# Payment Integration Setup Guide

## Overview

Payment integration has been implemented using Razorpay. This guide will help you set up the payment system.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

### Getting Razorpay Credentials

1. Sign up for a Razorpay account at https://razorpay.com
2. Go to Settings → API Keys
3. Generate test keys for development
4. Generate live keys for production
5. Copy the Key ID and Key Secret

### Test Mode vs Live Mode

- **Test Mode**: Use test keys for development. Test cards are available in Razorpay dashboard.
- **Live Mode**: Use live keys for production. Requires account verification.

## API Endpoints

### 1. Create Payment Order
```
POST /api/v1/payments/create-order
Content-Type: application/json

Body:
{
  "amount": 299900,  // Amount in paise (₹2999 = 299900 paise)
  "currency": "INR",  // Optional, defaults to INR
  "receipt": "receipt_123",  // Optional
  "notes": {  // Optional
    "service_id": "1",
    "service_name": "Seamless Online Filing"
  }
}

Response:
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "order_xxxxx",
    "amount": 299900,
    "currency": "INR",
    "receipt": "receipt_123",
    "status": "created",
    "created_at": 1234567890
  }
}
```

### 2. Verify Payment
```
POST /api/v1/payments/verify
Content-Type: application/json

Body:
{
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_order_id": "order_xxxxx",
  "razorpay_signature": "signature_xxxxx",
  "order_id": "order_xxxxx"
}

Response:
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "payment_id": "pay_xxxxx",
    "order_id": "order_xxxxx",
    "amount": 299900,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "created_at": 1234567890
  }
}
```

### 3. Get Order Status
```
GET /api/v1/payments/order/:orderId

Response:
{
  "success": true,
  "message": "Order status retrieved successfully",
  "data": {
    "id": "order_xxxxx",
    "amount": 299900,
    "currency": "INR",
    "receipt": "receipt_123",
    "status": "paid",
    "amount_paid": 299900,
    "amount_due": 0,
    "created_at": 1234567890
  }
}
```

## Security

1. **Never expose Key Secret**: The Razorpay Key Secret should only be stored in backend `.env` file, never in frontend code.

2. **Signature Verification**: All payments are verified using HMAC SHA256 signature verification to ensure authenticity.

3. **HTTPS Required**: Always use HTTPS in production to secure payment data transmission.

4. **Webhook Verification**: For production, set up Razorpay webhooks and verify webhook signatures.

## Testing

### Test Cards (Test Mode Only)

Use these test cards in Razorpay test mode:

- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **3D Secure**: 4012 0010 3714 1112

CVV: Any 3 digits  
Expiry: Any future date  
Name: Any name

### Testing Flow

1. Start backend server
2. Ensure Razorpay keys are set in `.env`
3. Make a payment order request
4. Use test card to complete payment
5. Verify payment is processed correctly

## Error Handling

The payment controller handles various error scenarios:

- Invalid amount
- Missing required fields
- Razorpay API errors
- Signature verification failures
- Network errors

All errors are logged and returned with appropriate HTTP status codes.

## Database Integration

Currently, payment information is stored in the RTI application record via the `payment_id` and `order_id` fields. For more detailed payment tracking, consider creating a separate `payments` table.

## Support

For Razorpay-specific issues:
- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: support@razorpay.com

For integration issues:
- Check server logs for detailed error messages
- Verify environment variables are set correctly
- Ensure Razorpay keys are valid and active

