/**
 * Server Entry Point
 * Main application file that sets up and starts the Express server
 */

const express = require('express');
const morgan = require('morgan');
const compression = require('compression');

// Import configurations (env.js validates on require)
const config = require('./config/env');
const { testConnection, closePool } = require('./config/database');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const { cors, limiter, helmet, xss, consultationCors } = require('./middlewares/security');
const { sanitize } = require('./middlewares/sanitize');
const logger = require('./utils/logger');
const { ensureAllTables } = require('./utils/ensureTables');

// Import routes
const routes = require('./routes');

// Import WhatsApp service
const { initializeWhatsApp, closeWhatsApp } = require('./utils/whatsapp/whatsapp');

// Initialize Express app
const app = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middlewares
app.use(helmet);
app.use(cors);
app.use(xss);
app.use(sanitize); // Sanitize all input

// Compression middleware
app.use(compression());

// Body parsing middlewares
app.use(express.json({ limit: config.SECURITY.REQUEST_SIZE_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: config.SECURITY.REQUEST_SIZE_LIMIT }));

// Request ID middleware for tracking
app.use((req, res, next) => {
  req.id = require('crypto').randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Logging middleware
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // Production logging with request ID
  app.use(morgan((tokens, req, res) => {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res),
      responseTime: tokens['response-time'](req, res),
      requestId: req.id,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
  }));
}

// Rate limiting
app.use('/api/', limiter);

// Routes
app.use(routes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server
let server;

const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Ensure required tables exist (non-blocking)
    logger.info('🔍 Checking database tables...');
    ensureAllTables().catch(err => {
      logger.warn('⚠️  Some tables may not have been created automatically:', err.message);
      logger.warn('⚠️  Server will continue, but some features may not work until tables are created.');
    });

    // Start listening
    server = app.listen(config.PORT, () => {
      logger.info(`🚀 Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
      logger.info(`📍 API endpoints available at http://localhost:${config.PORT}/api/v1`);
      logger.info(`💚 Health check: http://localhost:${config.PORT}/health`);

      // Initialize WhatsApp after server starts (non-blocking)
      if (config.WHATSAPP?.NOTIFICATION_PHONE) {
        logger.info('📱 Initializing WhatsApp notifications...');
        initializeWhatsApp().catch(err => {
          logger.error('❌ Failed to initialize WhatsApp:', err.message);
          logger.warn('⚠️  WhatsApp notifications will not be available. Form submissions will still work.');
        });
      } else {
        logger.info('ℹ️  WhatsApp notifications disabled (WHATSAPP_NOTIFICATION_PHONE not set)');
      }
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${config.PORT} is already in use`);
      } else {
        logger.error('Server error:', error);
      }
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} signal received: starting graceful shutdown`);

  // Stop accepting new requests
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');

      // Close WhatsApp connection
      await closeWhatsApp();

      // Close database connections
      await closePool();

      logger.info('Graceful shutdown complete');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    await closePool();
    process.exit(0);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server
startServer();

module.exports = app;

