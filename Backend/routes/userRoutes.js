/**
 * User Routes
 */

const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/role');

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/', isAdmin, getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', isAdmin, deleteUser);

module.exports = router;

