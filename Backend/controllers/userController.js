/**
 * User Controller
 * Handles user management operations
 */

const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Get all users (Admin only)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await User.findAll(page, limit);

    return sendSuccess(res, 'Users retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, 'User retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return sendError(res, 'User not found', 404);
    }

    // Update user
    const updatedUser = await User.update(id, { name, email, phone });

    logger.info(`User updated: ${id}`);

    return sendSuccess(res, 'User updated successfully', updatedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return sendError(res, 'User not found', 404);
    }

    await User.delete(id);

    logger.info(`User deleted: ${id}`);

    return sendSuccess(res, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};

