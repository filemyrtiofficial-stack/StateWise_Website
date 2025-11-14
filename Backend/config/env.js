/**
 * Environment Configuration
 * Validates and exports environment variables with defaults
 */

require('dotenv').config();

/**
 * Validate required environment variables
 */
const validateEnv = () => {
  const required = {
    development: ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'],
    production: ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET']
  };

  const env = process.env.NODE_ENV || 'development';
  const requiredVars = required[env] || required.development;
  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error(`\n💡 Set these variables in your .env file`);
    if (env === 'production') {
      console.error('⚠️  Production mode requires additional security variables');
    }
    process.exit(1);
  }

  // Validate JWT_SECRET in production
  if (env === 'production') {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || jwtSecret === 'yourSecretKey' || jwtSecret.length < 32) {
      console.error('❌ JWT_SECRET must be at least 32 characters long in production');
      console.error('💡 Generate a strong secret: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
      process.exit(1);
    }
  }
};

// Run validation
validateEnv();

/**
 * Environment configuration
 */
const config = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),

  // Database
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: parseInt(process.env.DB_PORT || '3306', 10),
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    NAME: process.env.DB_NAME,
    CONNECTION_LIMIT: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
    CONNECT_TIMEOUT: parseInt(process.env.DB_CONNECT_TIMEOUT || '10000', 10)
  },

  // JWT
  JWT: {
    SECRET: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : 'dev-secret-key-change-in-production'),
    EXPIRE: process.env.JWT_EXPIRE || '7d'
  },

  // CORS
  CORS: {
    ORIGIN: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000'),
    CREDENTIALS: process.env.CORS_CREDENTIALS !== 'false'
  },

  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    AUTH_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_AUTH_MAX || '5', 10)
  },

  // Razorpay
  RAZORPAY: {
    KEY_ID: process.env.RAZORPAY_KEY_ID,
    KEY_SECRET: process.env.RAZORPAY_KEY_SECRET
  },

  // Security
  SECURITY: {
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    REQUEST_SIZE_LIMIT: process.env.REQUEST_SIZE_LIMIT || '10mb',
    SESSION_SECRET: process.env.SESSION_SECRET || (process.env.NODE_ENV === 'production' ? null : 'dev-session-secret')
  },

  // Logging
  LOGGING: {
    LEVEL: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    FORMAT: process.env.LOG_FORMAT || (process.env.NODE_ENV === 'production' ? 'json' : 'text')
  },

  // Email (SMTP)
  EMAIL: {
    // Support both naming conventions: MAIL_* (existing) and SMTP_* (new)
    SMTP_HOST: process.env.MAIL_HOST || process.env.SMTP_HOST,
    SMTP_PORT: process.env.MAIL_PORT || process.env.SMTP_PORT || '587',
    SMTP_SECURE: process.env.MAIL_PORT === '465' || process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465' ? 'true' : 'false',
    SMTP_USER: process.env.MAIL_USERNAME || process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.MAIL_PASSWORD || process.env.SMTP_PASSWORD,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.MAIL_USERNAME || 'admin@filemyrti.com'
  },

  // WhatsApp Notifications
  WHATSAPP: {
    NOTIFICATION_PHONE: process.env.WHATSAPP_NOTIFICATION_PHONE || null // e.g., +91XXXXXXXXXX
  }
};

module.exports = config;
