/**
 * Security Middlewares
 * Production-ready CORS, Helmet, rate limiting, and XSS protection
 */

const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const config = require('../config/env');
const logger = require('../utils/logger');

/**
 * Normalize origin helper
 */
const normalizeOrigin = (origin) => origin.toLowerCase().replace(/\/$/, '');

/**
 * General CORS configuration
 */
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow curl/Postman

    const normalized = normalizeOrigin(origin);

    const allowedOrigins = [];

    // Add environment origins
    if (config.CORS.ORIGIN) {
      const envOrigins = Array.isArray(config.CORS.ORIGIN) ? config.CORS.ORIGIN : [config.CORS.ORIGIN];
      envOrigins.forEach(o => {
        if (o) allowedOrigins.push(normalizeOrigin(o));
      });
    }

    // Production frontend
    if (config.NODE_ENV === 'production') {
      allowedOrigins.push('https://delhi.filemyrti.com', 'https://www.delhi.filemyrti.com');
    }

    // Development localhost
    if (config.NODE_ENV === 'development') {
      allowedOrigins.push(
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173'
      );
    }

    // Allow exact match or subdomain of production
    if (allowedOrigins.includes(normalized) || normalized.endsWith('.delhi.filemyrti.com')) {
      return callback(null, true);
    }

    logger.warn(`CORS rejected: Origin "${origin}" not allowed`);
    return callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID']
};

/**
 * CORS specifically for /consultations/public
 * Handles preflight and production origin
 */
const consultationCorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const normalized = normalizeOrigin(origin);
    const allowedOrigins = [
      'https://delhi.filemyrti.com',
      'https://www.delhi.filemyrti.com'
    ];

    if (allowedOrigins.includes(normalized) || normalized.endsWith('.delhi.filemyrti.com')) {
      return callback(null, true);
    }

    logger.warn(`CORS rejected for consultations: Origin "${origin}"`);
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
  skip: (req) => req.path === '/health',
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
 * Helmet configuration
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
  } : false,
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
