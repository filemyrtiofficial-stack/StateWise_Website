/**
 * Payment Controller
 * Handles Razorpay payment operations
 */

const Razorpay = require('razorpay');
const crypto = require('crypto');
const config = require('../config/env');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

// Initialize Razorpay instance lazily
let razorpay = null;

const getRazorpayInstance = () => {
  if (!razorpay) {
    if (!config.RAZORPAY.KEY_ID || !config.RAZORPAY.KEY_SECRET) {
      throw new Error('Razorpay credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file.');
    }

    razorpay = new Razorpay({
      key_id: config.RAZORPAY.KEY_ID,
      key_secret: config.RAZORPAY.KEY_SECRET
    });
  }

  return razorpay;
};

/**
 * Create payment order
 */
const createOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return sendError(res, 'Amount is required and must be greater than 0', 400);
    }

    // Validate amount is in paise (should be at least 100 paise = 1 rupee)
    if (amount < 100) {
      return sendError(res, 'Minimum amount is ₹1 (100 paise)', 400);
    }

    logger.info('Creating Razorpay order:', { amount, currency, receipt });

    // Get Razorpay instance
    const razorpayInstance = getRazorpayInstance();

    // Create order options
    const options = {
      amount: Math.round(amount), // Ensure amount is an integer (in paise)
      currency: currency.toUpperCase(),
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {}
    };

    // Create order with Razorpay
    const order = await razorpayInstance.orders.create(options);

    logger.info(`✅ Razorpay order created: ${order.id}`);

    return sendSuccess(res, 'Order created successfully', {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      created_at: order.created_at
    }, 201);
  } catch (error) {
    logger.error('❌ Error creating Razorpay order:', {
      error: error.message,
      code: error.code,
      stack: error.stack
    });

    // Handle Razorpay specific errors
    if (error.error) {
      return sendError(res, error.error.description || 'Failed to create payment order', 400);
    }

    return sendError(res, 'Failed to create payment order', 500);
  }
};

/**
 * Verify payment
 */
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, order_id } = req.body;

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !order_id) {
      return sendError(res, 'Missing required payment verification fields', 400);
    }

    logger.info('Verifying payment:', {
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id
    });

    // Create signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', config.RAZORPAY.KEY_SECRET)
      .update(text)
      .digest('hex');

    // Verify signature
    const isSignatureValid = generated_signature === razorpay_signature;

    if (!isSignatureValid) {
      logger.error('❌ Payment signature verification failed');
      return sendError(res, 'Payment verification failed: Invalid signature', 400);
    }

    // Fetch payment details from Razorpay
    try {
      const razorpayInstance = getRazorpayInstance();
      const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);

      logger.info(`✅ Payment verified successfully: ${razorpay_payment_id}`, {
        payment_status: payment.status,
        order_id: payment.order_id
      });

      return sendSuccess(res, 'Payment verified successfully', {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        created_at: payment.created_at
      });
    } catch (razorpayError) {
      logger.error('❌ Error fetching payment from Razorpay:', razorpayError);
      return sendError(res, 'Failed to verify payment with Razorpay', 500);
    }
  } catch (error) {
    logger.error('❌ Error verifying payment:', {
      error: error.message,
      stack: error.stack
    });
    return sendError(res, 'Failed to verify payment', 500);
  }
};

/**
 * Get order status
 */
const getOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return sendError(res, 'Order ID is required', 400);
    }

    logger.info(`Fetching order status: ${orderId}`);

    // Fetch order from Razorpay
    const razorpayInstance = getRazorpayInstance();
    const order = await razorpayInstance.orders.fetch(orderId);

    logger.info(`✅ Order status fetched: ${orderId}`, {
      status: order.status,
      amount_paid: order.amount_paid,
      amount_due: order.amount_due
    });

    return sendSuccess(res, 'Order status retrieved successfully', {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      amount_paid: order.amount_paid,
      amount_due: order.amount_due,
      created_at: order.created_at
    });
  } catch (error) {
    logger.error('❌ Error fetching order status:', {
      error: error.message,
      code: error.code,
      stack: error.stack
    });

    // Handle Razorpay specific errors
    if (error.error) {
      return sendError(res, error.error.description || 'Order not found', 404);
    }

    return sendError(res, 'Failed to fetch order status', 500);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getOrderStatus
};

