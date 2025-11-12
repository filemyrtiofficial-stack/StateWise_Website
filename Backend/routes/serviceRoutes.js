/**
 * Service Routes
 */

const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { authenticate, optionalAuth } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/role');

// Public routes
router.get('/', getAllServices);
router.get('/:slug', getServiceBySlug);

// Protected routes (Admin only)
router.post('/', authenticate, isAdmin, createService);
router.put('/:id', authenticate, isAdmin, updateService);
router.delete('/:id', authenticate, isAdmin, deleteService);

module.exports = router;

