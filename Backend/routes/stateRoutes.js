/**
 * State Routes
 */

const express = require('express');
const router = express.Router();
const {
  getAllStates,
  getStateBySlug,
  createState,
  updateState,
  deleteState
} = require('../controllers/stateController');
const { authenticate } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/role');

// Public routes
router.get('/', getAllStates);
router.get('/:slug', getStateBySlug);

// Protected routes (Admin only)
router.post('/', authenticate, isAdmin, createState);
router.put('/:id', authenticate, isAdmin, updateState);
router.delete('/:id', authenticate, isAdmin, deleteState);

module.exports = router;

