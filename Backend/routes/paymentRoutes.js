/**
 * Payment Routes
 */

const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getOrderStatus
} = require('../controllers/paymentController');

// All payment routes are public (no authentication required for payment processing)
// Payment security is handled through Razorpay's signature verification

/**
 * @route   POST /payments/create-order
 * @desc    Create a new payment order
 * @access  Public
 */
router.post('/create-order', createOrder);

/**
 * @route   POST /payments/verify
 * @desc    Verify payment signature and status
 * @access  Public
 */
router.post('/verify', verifyPayment);

/**
 * @route   GET /payments/order/:orderId
 * @desc    Get order status
 * @access  Public
 */
router.get('/order/:orderId', getOrderStatus);

module.exports = router;

