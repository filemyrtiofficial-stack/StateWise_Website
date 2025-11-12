/**
 * Authentication Controller
 * Handles user registration and login
 */

const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Register a new user
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return sendError(res, 'User with this email already exists', 409);
    }

    // Create user
    const userId = await User.create({
      name,
      email,
      password,
      phone,
      role: 'user'
    });

    // Get created user (without password)
    const user = await User.findById(userId);

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    logger.info(`New user registered: ${email}`);

    return sendSuccess(res, 'User registered successfully', {
      user,
      token
    }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    logger.info(`User logged in: ${email}`);

    return sendSuccess(res, 'Login successful', {
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, 'Profile retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile
};

