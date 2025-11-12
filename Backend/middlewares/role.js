/**
 * Role-based Access Control Middleware
 * Checks if user has required role
 */

const { sendError } = require('../utils/response');

/**
 * Check if user has admin role
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return sendError(res, 'Access denied. Admin privileges required.', 403);
};

/**
 * Check if user has required role
 */
const hasRole = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }
    return sendError(res, 'Access denied. Insufficient privileges.', 403);
  };
};

module.exports = {
  isAdmin,
  hasRole
};

