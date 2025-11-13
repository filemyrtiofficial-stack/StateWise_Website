/**
 * Security Middlewares
 * Applies security best practices
 */

const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const config = require('../config/env');

/**
 * CORS configuration for all routes
 */
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Normalize origin (remove trailing slash, convert to lowercase)
    const normalizedOrigin = origin.toLowerCase().replace(/\/$/, '');

    // Build allowed origins list
    const allowedOrigins = [];

    // Add origins from environment variable
    if (config.CORS.ORIGIN) {
      const envOrigins = Array.isArray(config.CORS.ORIGIN) ? config.CORS.ORIGIN : [config.CORS.ORIGIN];
      envOrigins.forEach(envOrigin => {
        if (envOrigin) {
          allowedOrigins.push(envOrigin.toLowerCase().replace(/\/$/, ''));
        }
      });
    }

    // In production, always allow the production frontend
    if (config.NODE_ENV === 'production') {
      allowedOrigins.push(
        'https://delhi.filemyrti.com',
        'https://www.delhi.filemyrti.com'
      );
    }

    // In development, allow localhost
    if (config.NODE_ENV === 'development') {
      allowedOrigins.push(
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173'
      );
    }

    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowed =>
      allowed === normalizedOrigin
    );

    // In production, also allow if origin contains the production domain
    const isProductionDomain = config.NODE_ENV === 'production' &&
      normalizedOrigin.includes('delhi.filemyrti.com');

    if (isAllowed || isProductionDomain) {
      callback(null, true);
    } else {
      const logger = require('../utils/logger');
      logger.warn(`CORS rejected: Origin "${origin}" not in allowed list: [${allowedOrigins.join(', ')}]`);
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID']
};

/**
 * CORS configuration specifically for public consultation routes
 * This ensures proper CORS handling for /api/v1/consultations/public
 */
const consultationCorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow curl, Postman, etc.

    const normalizedOrigin = origin.toLowerCase().replace(/\/$/, '');

    const allowedOrigins = [];

    // add env origins
    if (config.CORS.ORIGIN) {
      const envOrigins = Array.isArray(config.CORS.ORIGIN) ? config.CORS.ORIGIN : [config.CORS.ORIGIN];
      envOrigins.forEach(o => allowedOrigins.push(o.toLowerCase().replace(/\/$/, '')));
    }

    // production frontend
    if (config.NODE_ENV === 'production') {
      allowedOrigins.push('https://delhi.filemyrti.com', 'https://www.delhi.filemyrti.com');
    }

    // development localhost
    if (config.NODE_ENV === 'development') {
      allowedOrigins.push(
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173'
      );
    }

    // Check if normalized origin matches any allowed origin
    const isAllowed = allowedOrigins.some(o => normalizedOrigin === o);

    if (isAllowed) return callback(null, true);

    const logger = require('../utils/logger');
    logger.warn(`CORS rejected: Origin "${origin}" not in allowed list: [${allowedOrigins.join(', ')}]`);
    return callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID']
};

/**
 * Rate limiting configuration
 */
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT.WINDOW_MS,
  max: config.RATE_LIMIT.MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(config.RATE_LIMIT.WINDOW_MS / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(config.RATE_LIMIT.WINDOW_MS / 1000)
    });
  }
});

/**
 * Strict rate limiter for authentication routes
 */
const authLimiter = rateLimit({
  windowMs: config.RATE_LIMIT.WINDOW_MS,
  max: config.RATE_LIMIT.AUTH_MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: Math.ceil(config.RATE_LIMIT.WINDOW_MS / 1000)
  },
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later.',
      retryAfter: Math.ceil(config.RATE_LIMIT.WINDOW_MS / 1000)
    });
  }
});

/**
 * Helmet configuration with production-ready settings
 */
const helmetConfig = helmet({
  contentSecurityPolicy: config.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  } : false, // Disable CSP in development for easier debugging
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
});

module.exports = {
  cors: cors(corsOptions),
  consultationCors: cors(consultationCorsOptions),
  limiter,
  authLimiter,
  helmet: helmetConfig,
  xss: xss()
};

