/**
 * Validation Middleware
 * Handles validation errors from express-validator
 */

const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    // Log validation errors for debugging
    const logger = require('../utils/logger');
    logger.warn('Validation failed:', {
      errors: formattedErrors,
      body: req.body
    });

    return sendError(res, 'Validation failed', 400, formattedErrors);
  }

  next();
};

module.exports = {
  validate
};

