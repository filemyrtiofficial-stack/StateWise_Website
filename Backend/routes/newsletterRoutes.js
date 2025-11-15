/**
 * Newsletter Subscription Routes
 * Routes for newsletter email subscriptions
 */

const express = require('express');
const router = express.Router();
const {
  subscribe,
  getAllSubscriptions,
  unsubscribe
} = require('../controllers/newsletterController');
const { authenticate } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/role');

// Public routes (no authentication required)
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Protected routes (admin only)
router.use(authenticate);
router.use(isAdmin);

router.get('/', getAllSubscriptions);

module.exports = router;

