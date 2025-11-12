/**
 * RTI Application Validators
 * Validation rules for RTI application routes
 */

const { body } = require('express-validator');

const createApplicationValidator = [
  body('service_id')
    .notEmpty()
    .withMessage('Service ID is required')
    .isInt()
    .withMessage('Service ID must be a valid integer'),

  body('state_id')
    .notEmpty()
    .withMessage('State ID is required')
    .isInt()
    .withMessage('State ID must be a valid integer'),

  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),

  body('mobile')
    .trim()
    .notEmpty()
    .withMessage('Mobile number is required')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid mobile number'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('rti_query')
    .trim()
    .notEmpty()
    .withMessage('RTI query is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('RTI query must be between 10 and 5000 characters'),

  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),

  body('pincode')
    .trim()
    .notEmpty()
    .withMessage('Pincode is required')
    .isPostalCode('IN')
    .withMessage('Please provide a valid Indian pincode')
];

const updateStatusValidator = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'submitted', 'in_progress', 'completed', 'rejected'])
    .withMessage('Invalid status')
];

module.exports = {
  createApplicationValidator,
  updateStatusValidator
};

