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
        'https://rtionlinedelhi.filemyrti.com',
        'https://www.rtionlinedelhi.filemyrti.com',
        'https://www.rtionlinetelangana.filemyrti.com',
        'https://rtionlinetelangana.filemyrti.com',
        'https://www.rtionlinetelangana.filemyrti.com',
        'https://rtionlinebihar.filemyrti.com',
        'https://www.rtionlinebihar.filemyrti.com',
        'https://www.rtionlinechhattisgarh.filemyrti.com',
        'https://rtionlinechhattisgarh.filemyrti.com',
        'https://www.rtionlinechhattisgarh.filemyrti.com',
        'https://www.rtionlinegujarat.filemyrti.com',
        'https://rtionlinegujarat.filemyrti.com',
        'https://www.rtionlinegujarat.filemyrti.com',
        'https://www.rtionlineharyana.filemyrti.com',
        'https://rtionlineharyana.filemyrti.com',
        'https://www.rtionlineharyana.filemyrti.com',
        'https://www.rtionlinehimachalpradesh.filemyrti.com',
        'https://rtionlinehimachalpradesh.filemyrti.com',
        'https://www.rtionlinehimachalpradesh.filemyrti.com',
        'https://www.rtionlinejharkhand.filemyrti.com',
        'https://rtionlinejharkhand.filemyrti.com',
        'https://www.rtionlinejharkhand.filemyrti.com',
        'https://www.rtionlinekarnataka.filemyrti.com',
        'https://rtionlinekarnataka.filemyrti.com',
        'https://www.rtionlinekarnataka.filemyrti.com',
        'https://www.rtionlinekerala.filemyrti.com',
        'https://rtionlinekerala.filemyrti.com',
        'https://www.rtionlinekerala.filemyrti.com',
        'https://www.rtionlinemadhya Pradesh.filemyrti.com',
        'https://rtionlinemadhya Pradesh.filemyrti.com',
        'https://www.rtionlinemadhya Pradesh.filemyrti.com',
        'https://www.rtionlinemaharashtra.filemyrti.com',
        'https://rtionlinemaharashtra.filemyrti.com',
        'https://www.rtionlinemaharashtra.filemyrti.com',
        'https://www.rtionlinemanipur.filemyrti.com',
        'https://rtionlinemanipur.filemyrti.com',
        'https://www.rtionlinemanipur.filemyrti.com',
        'https://www.rtionlinemeghalaya.filemyrti.com',
        'https://rtionlinemeghalaya.filemyrti.com',
        'https://www.rtionlinemeghalaya.filemyrti.com',
        'https://www.rtionlinemizoram.filemyrti.com',
        'https://rtionlinemizoram.filemyrti.com',
        'https://www.rtionlinemizoram.filemyrti.com',
        'https://www.rtionlinenagaland.filemyrti.com',
        'https://rtionlinenagaland.filemyrti.com',
        'https://www.rtionlinenagaland.filemyrti.com',
        'https://www.rtionlineodisha.filemyrti.com',
        'https://rtionlineodisha.filemyrti.com',
        'https://www.rtionlineodisha.filemyrti.com',
        'https://www.rtionlinepunjab.filemyrti.com',
        'https://rtionlinepunjab.filemyrti.com',
        'https://www.rtionlinepunjab.filemyrti.com',
        'https://www.rtionlinerajasthan.filemyrti.com',
        'https://rtionlinerajasthan.filemyrti.com',
        'https://www.rtionlinerajasthan.filemyrti.com',
        'https://www.rtionlinesikkim.filemyrti.com',
        'https://rtionlinesikkim.filemyrti.com',
        'https://www.rtionlinesikkim.filemyrti.com',
        'https://www.rtionlinesikkim.filemyrti.com',
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
      normalizedOrigin.includes('rtionlinedelhi.filemyrti.com');

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

    // In production, always allow the production frontend (with and without www)
    if (config.NODE_ENV === 'production') {
      allowedOrigins.push(
        'https://rtionlinedelhi.filemyrti.com',
        'https://www.rtionlinedelhi.filemyrti.com'
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

    // Check if normalized origin matches any allowed origin
    const isAllowed = allowedOrigins.some(allowed =>
      allowed === normalizedOrigin
    );

    // In production, also allow if origin contains the production domain (fallback)
    const isProductionDomain = config.NODE_ENV === 'production' &&
      normalizedOrigin.includes('rtionlinedelhi.filemyrti.com');

    if (isAllowed || isProductionDomain) {
      return callback(null, true);
    }

    // Log rejection for debugging
    const logger = require('../utils/logger');
    logger.warn(`CORS rejected for consultations: Origin "${origin}" not in allowed list: [${allowedOrigins.join(', ')}]`);
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

