/**
 * JWT Utility
 * Handles JWT token generation and verification
 */

const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Generate JWT token
 */
const generateToken = (payload) => {
  if (!config.JWT.SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(payload, config.JWT.SECRET, {
    expiresIn: config.JWT.EXPIRE,
    issuer: 'filemyrti-api',
    audience: 'filemyrti-client'
  });
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  if (!config.JWT.SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  try {
    return jwt.verify(token, config.JWT.SECRET, {
      issuer: 'filemyrti-api',
      audience: 'filemyrti-client'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const expiredError = new Error('Token expired');
      expiredError.name = 'TokenExpiredError';
      throw expiredError;
    } else if (error.name === 'JsonWebTokenError') {
      const invalidError = new Error('Invalid token');
      invalidError.name = 'JsonWebTokenError';
      throw invalidError;
    }
    throw new Error('Invalid or expired token');
  }
};

/**
 * Decode JWT token without verification (for debugging)
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};

