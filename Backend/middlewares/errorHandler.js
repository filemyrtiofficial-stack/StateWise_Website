/**
 * Error Handler Middleware
 * Centralized error handling for the application
 */

const logger = require('../utils/logger');
const { sendError } = require('../utils/response');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);

  // Database errors
  if (err.code === 'ER_DUP_ENTRY') {
    return sendError(res, 'Duplicate entry. This record already exists.', 409);
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return sendError(res, 'Referenced record does not exist.', 400);
  }

  if (err.code === 'ER_BAD_FIELD_ERROR') {
    return sendError(res, 'Invalid field in query.', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired.', 401);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return sendError(res, err.message, 400);
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  return sendError(res, message, statusCode);
};

/**
 * 404 Not Found handler
 */
const notFound = (req, res, next) => {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
};

module.exports = {
  errorHandler,
  notFound
};

