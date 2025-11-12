/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { validate } = require('../middlewares/validation');
const { authenticate } = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/security');

// Public routes
router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);

// Protected routes
router.get('/profile', authenticate, getProfile);

module.exports = router;

