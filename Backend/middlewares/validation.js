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

    return sendError(res, 'Validation failed', 400, formattedErrors);
  }

  next();
};

module.exports = {
  validate
};

