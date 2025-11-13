/**
 * Consultation Routes
 * Routes for consultation form submissions
 */

const express = require('express');
const router = express.Router();
const {
  createConsultation,
  getAllConsultations,
  getConsultationById,
  updateConsultationStatus
} = require('../controllers/consultationController');
const { authenticate } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/role');
const { consultationCors } = require('../middlewares/security');

// Public routes (no authentication required)
// Apply CORS middleware specifically for this route to handle preflight OPTIONS requests
router.options('/public', consultationCors);
router.post('/public', consultationCors, createConsultation);

// Protected routes (admin only)
router.use(authenticate);
router.use(isAdmin);

router.get('/', getAllConsultations);
router.get('/:id', getConsultationById);
router.patch('/:id/status', updateConsultationStatus);

module.exports = router;

