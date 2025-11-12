/**
 * Callback Request Routes
 * Routes for callback form submissions
 */

const express = require('express');
const router = express.Router();
const {
  createCallbackRequest,
  getAllCallbackRequests,
  getCallbackRequestById,
  updateCallbackRequestStatus
} = require('../controllers/callbackController');
const { authenticate } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/role');

// Public routes (no authentication required)
router.post('/public', createCallbackRequest);

// Protected routes (admin only)
router.use(authenticate);
router.use(isAdmin);

router.get('/', getAllCallbackRequests);
router.get('/:id', getCallbackRequestById);
router.patch('/:id/status', updateCallbackRequestStatus);

module.exports = router;

