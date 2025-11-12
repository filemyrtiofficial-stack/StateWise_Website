/**
 * Error Handler Middleware
 * Centralized error handling for the application
 */

const logger = require('../utils/logger');
const { sendError } = require('../utils/response');
const config = require('../config/env');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error with request context
  logger.error('Request error', {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl || req.url,
    error: {
      message: err.message,
      code: err.code,
      name: err.name,
      stack: config.NODE_ENV === 'development' ? err.stack : undefined
    }
  });

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
    return sendError(res, 'Token expired. Please login again.', 401);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return sendError(res, err.message, 400);
  }

  // CORS errors
  if (err.message && err.message.includes('CORS')) {
    return sendError(res, 'CORS policy violation.', 403);
  }

  // Rate limit errors
  if (err.statusCode === 429) {
    return sendError(res, err.message || 'Too many requests, please try again later.', 429);
  }

  // Default error - don't expose internal details in production
  const statusCode = err.statusCode || 500;
  const message = config.NODE_ENV === 'production'
    ? (statusCode === 500 ? 'Internal server error' : err.message)
    : err.message;

  // Include request ID in error response for tracking
  const errorResponse = {
    success: false,
    message,
    requestId: req.id
  };

  // Include stack trace in development
  if (config.NODE_ENV === 'development' && err.stack) {
    errorResponse.stack = err.stack;
  }

  return res.status(statusCode).json(errorResponse);
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

