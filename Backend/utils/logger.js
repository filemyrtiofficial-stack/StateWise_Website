/**
 * Logger Utility
 * Centralized structured logging for the application
 */

const config = require('../config/env');

/**
 * Format log entry
 */
const formatLog = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...data
  };

  if (config.LOGGING.FORMAT === 'json') {
    return JSON.stringify(logEntry);
  }

  // Text format for development
  const dataStr = Object.keys(data).length > 0 ? ` ${JSON.stringify(data)}` : '';
  return `[${level.toUpperCase()}] ${timestamp} - ${message}${dataStr}`;
};

/**
 * Logger with structured logging
 */
const logger = {
  info: (message, data = {}) => {
    const output = formatLog('info', message, data);
    console.log(output);
  },

  error: (message, data = {}) => {
    const output = formatLog('error', message, data);
    console.error(output);
  },

  warn: (message, data = {}) => {
    const output = formatLog('warn', message, data);
    console.warn(output);
  },

  debug: (message, data = {}) => {
    if (config.LOGGING.LEVEL === 'debug' || config.NODE_ENV === 'development') {
      const output = formatLog('debug', message, data);
      console.log(output);
    }
  },

  // Request logging helper
  request: (req, res, responseTime) => {
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      requestId: req.id
    };

    if (res.statusCode >= 500) {
      logger.error('Request failed', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Request warning', logData);
    } else {
      logger.info('Request completed', logData);
    }
  }
};

module.exports = logger;

