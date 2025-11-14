/**
 * RTI Application Validators
 * Validation rules for RTI application routes
 */

const { body } = require('express-validator');

const createApplicationValidator = [
  body('service_id')
    .notEmpty()
    .withMessage('Service ID is required')
    .isInt({ min: 1 })
    .withMessage('Service ID must be a valid integer')
    .toInt(),

  body('state_id')
    .notEmpty()
    .withMessage('State ID is required')
    .isInt({ min: 1 })
    .withMessage('State ID must be a valid integer')
    .toInt(),

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
    .optional({ checkFalsy: true, nullable: true })
    .trim()
    .custom((value) => {
      // If value is provided and not empty, it must be between 10 and 5000 characters
      if (value && value.length > 0) {
        if (value.length < 10 || value.length > 5000) {
          throw new Error('RTI query must be between 10 and 5000 characters if provided');
        }
      }
      // If empty or not provided, it's valid (optional field)
      return true;
    }),

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
    .withMessage('Please provide a valid Indian pincode'),

  // Optional payment fields (allowed but not required)
  body('payment_id')
    .optional()
    .trim()
    .isString()
    .withMessage('Payment ID must be a string'),

  body('order_id')
    .optional()
    .trim()
    .isString()
    .withMessage('Order ID must be a string')
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

