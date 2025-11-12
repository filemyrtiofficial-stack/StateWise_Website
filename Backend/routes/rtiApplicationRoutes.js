/**
 * RTI Application Routes
 */

const express = require('express');
const router = express.Router();
const {
  createApplicationPublic,
  createApplication,
  getAllApplications,
  getApplicationById,
  getMyApplications,
  updateApplicationStatus,
  updateApplication,
  deleteApplication
} = require('../controllers/rtiApplicationController');
const { createApplicationValidator, updateStatusValidator } = require('../validators/rtiApplicationValidator');
const { validate } = require('../middlewares/validation');
const { authenticate, optionalAuth } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/role');

// Public route - no authentication required
router.post('/public', createApplicationValidator, validate, createApplicationPublic);

// All other routes require authentication
router.use(authenticate);

// Authenticated user routes
router.post('/', createApplicationValidator, validate, createApplication);
router.get('/my-applications', getMyApplications);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

// Admin routes
router.get('/', getAllApplications);
router.patch('/:id/status', isAdmin, updateStatusValidator, validate, updateApplicationStatus);

module.exports = router;

