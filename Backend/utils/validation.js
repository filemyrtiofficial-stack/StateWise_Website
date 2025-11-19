/**
 * Validation Utilities
 * Common validation functions for input validation
 */

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate mobile number (10-13 digits)
 */
const isValidMobile = (mobile) => {
  if (!mobile || typeof mobile !== 'string') return false;
  const cleaned = mobile.replace(/\D/g, '');
  const length = cleaned.length;
  return length >= 10 && length <= 13;
};

/**
 * Validate pincode (Indian)
 */
const isValidPincode = (pincode) => {
  if (!pincode || typeof pincode !== 'string') return false;
  // Indian pincode: 6 digits
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode.trim());
};

/**
 * Validate amount (positive number)
 */
const isValidAmount = (amount, min = 0, max = null) => {
  const num = Number(amount);
  if (isNaN(num) || num < min) return false;
  if (max !== null && num > max) return false;
  return true;
};

/**
 * Validate string length
 */
const isValidLength = (str, min, max) => {
  if (typeof str !== 'string') return false;
  const length = str.trim().length;
  return length >= min && length <= max;
};

/**
 * Sanitize and validate input
 */
const sanitizeInput = (input, type = 'string') => {
  if (input === null || input === undefined) return null;

  if (type === 'string') {
    return String(input).trim().replace(/\0/g, '');
  }

  if (type === 'number') {
    const num = Number(input);
    return isNaN(num) ? null : num;
  }

  if (type === 'email') {
    const cleaned = String(input).trim().toLowerCase();
    return isValidEmail(cleaned) ? cleaned : null;
  }

  if (type === 'mobile') {
    const cleaned = String(input).replace(/\s/g, '');
    return isValidMobile(cleaned) ? cleaned : null;
  }

  return input;
};

/**
 * Validate required fields
 */
const validateRequired = (data, requiredFields) => {
  const missing = [];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missing.push(field);
    }
  }

  return {
    isValid: missing.length === 0,
    missing
  };
};

module.exports = {
  isValidEmail,
  isValidMobile,
  isValidPincode,
  isValidAmount,
  isValidLength,
  sanitizeInput,
  validateRequired
};

