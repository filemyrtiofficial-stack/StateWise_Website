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
 * Helper function to normalize origin for comparison
 */
const normalizeOrigin = (origin) => {
  if (!origin) return null;
  // Remove trailing slash, convert to lowercase, remove port if default
  return origin.toLowerCase().replace(/\/$/, '').replace(/:443$/, '').replace(/:80$/, '');
};

/**
 * Helper function to check if origin matches allowed patterns
 */
const isOriginAllowed = (origin, allowedOrigins) => {
  const normalized = normalizeOrigin(origin);
  if (!normalized) return false;

  // Exact match
  if (allowedOrigins.includes(normalized)) {
    return true;
  }

  // Check if origin contains production domain (for subdomains)
  if (config.NODE_ENV === 'production' && normalized.includes('delhi.filemyrti.com')) {
    return true;
  }

  return false;
};

/**
 * CORS configuration for all routes
 */
const corsOptions = {
  origin: (origin, callback) => {
    const logger = require('../utils/logger');

    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) {
      if (config.NODE_ENV === 'development') {
        logger.debug('CORS: Allowing request with no origin (development mode)');
      }
      return callback(null, true);
    }

    // Build allowed origins list
    const allowedOrigins = [];

    // Add origins from environment variable
    if (config.CORS.ORIGIN) {
      const envOrigins = Array.isArray(config.CORS.ORIGIN) ? config.CORS.ORIGIN : [config.CORS.ORIGIN];
      envOrigins.forEach(envOrigin => {
        if (envOrigin) {
          allowedOrigins.push(normalizeOrigin(envOrigin));
        }
      });
    }

    // In production, always allow the production frontend (with and without www)
    if (config.NODE_ENV === 'production') {
      allowedOrigins.push(
        normalizeOrigin('https://delhi.filemyrti.com'),
        normalizeOrigin('https://www.delhi.filemyrti.com')
      );
    }

    // In development, allow localhost
    if (config.NODE_ENV === 'development') {
      allowedOrigins.push(
        normalizeOrigin('http://localhost:3000'),
        normalizeOrigin('http://127.0.0.1:3000'),
        normalizeOrigin('http://localhost:5173'),
        normalizeOrigin('http://127.0.0.1:5173')
      );
    }

    // Check if origin is allowed
    if (isOriginAllowed(origin, allowedOrigins)) {
      if (config.NODE_ENV === 'development') {
        logger.debug(`CORS: Allowing origin "${origin}"`);
      }
      return callback(null, true);
    }

    // Log rejection with details
    logger.warn(`CORS rejected: Origin "${origin}" (normalized: "${normalizeOrigin(origin)}") not in allowed list: [${allowedOrigins.join(', ')}]`);
    logger.warn(`CORS: NODE_ENV=${config.NODE_ENV}, Production check: ${config.NODE_ENV === 'production' && normalizeOrigin(origin)?.includes('delhi.filemyrti.com')}`);
    callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID'],
  preflightContinue: false,
  maxAge: 86400 // 24 hours
};

/**
 * CORS configuration specifically for public consultation routes
 * This ensures proper CORS handling for /api/v1/consultations/public
 */
const consultationCorsOptions = {
  origin: (origin, callback) => {
    const logger = require('../utils/logger');

    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) {
      if (config.NODE_ENV === 'development') {
        logger.debug('CORS (consultations): Allowing request with no origin');
      }
      return callback(null, true);
    }

    // Build allowed origins list
    const allowedOrigins = [];

    // Add origins from environment variable
    if (config.CORS.ORIGIN) {
      const envOrigins = Array.isArray(config.CORS.ORIGIN) ? config.CORS.ORIGIN : [config.CORS.ORIGIN];
      envOrigins.forEach(envOrigin => {
        if (envOrigin) {
          allowedOrigins.push(normalizeOrigin(envOrigin));
        }
      });
    }

    // In production, always allow the production frontend (with and without www)
    if (config.NODE_ENV === 'production') {
      allowedOrigins.push(
        normalizeOrigin('https://delhi.filemyrti.com'),
        normalizeOrigin('https://www.delhi.filemyrti.com')
      );
    }

    // In development, allow localhost
    if (config.NODE_ENV === 'development') {
      allowedOrigins.push(
        normalizeOrigin('http://localhost:3000'),
        normalizeOrigin('http://127.0.0.1:3000'),
        normalizeOrigin('http://localhost:5173'),
        normalizeOrigin('http://127.0.0.1:5173')
      );
    }

    // Check if origin is allowed
    if (isOriginAllowed(origin, allowedOrigins)) {
      if (config.NODE_ENV === 'development') {
        logger.debug(`CORS (consultations): Allowing origin "${origin}"`);
      }
      return callback(null, true);
    }

    // Log rejection with details
    logger.warn(`CORS rejected for consultations: Origin "${origin}" (normalized: "${normalizeOrigin(origin)}") not in allowed list: [${allowedOrigins.join(', ')}]`);
    logger.warn(`CORS (consultations): NODE_ENV=${config.NODE_ENV}, Production check: ${config.NODE_ENV === 'production' && normalizeOrigin(origin)?.includes('delhi.filemyrti.com')}`);
    return callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID'],
  preflightContinue: false,
  maxAge: 86400 // 24 hours
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
 * Note: CSP connectSrc allows API calls from same origin and production domain
 */
const helmetConfig = helmet({
  contentSecurityPolicy: config.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: [
        "'self'",
        "https://delhi.filemyrti.com",
        "https://www.delhi.filemyrti.com"
      ],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  } : false, // Disable CSP in development for easier debugging
  crossOriginEmbedderPolicy: false, // Allow cross-origin requests
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resources
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

