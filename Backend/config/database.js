/**
 * Database Configuration
 * Handles MySQL database connection using connection pooling
 */

const mysql = require('mysql2/promise');
const config = require('./env');
const logger = require('../utils/logger');

// Create connection pool for better performance
const pool = mysql.createPool({
  host: config.DB.HOST,
  port: config.DB.PORT,
  user: config.DB.USER,
  password: config.DB.PASSWORD,
  database: config.DB.NAME,
  waitForConnections: true,
  connectionLimit: config.DB.CONNECTION_LIMIT,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: config.DB.CONNECT_TIMEOUT,
  multipleStatements: false,
  // Additional production settings
  timezone: '+00:00', // UTC
  dateStrings: false,
  supportBigNumbers: true,
  bigNumberStrings: true
});

// Test database connection with retry logic
const testConnection = async (retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      // Log connection attempt details (without password)
      if (i === 0) {
        logger.info('🔌 Attempting to connect to database...', {
          host: config.DB.HOST,
          port: config.DB.PORT,
          user: config.DB.USER,
          database: config.DB.NAME
        });
      } else {
        logger.warn(`Retrying database connection (attempt ${i + 1}/${retries})...`);
      }

      const connection = await pool.getConnection();
      logger.info('✅ Database connected successfully');
      connection.release();
      return true;
    } catch (error) {
      logger.error('❌ Database connection failed:', {
        attempt: i + 1,
        code: error.code,
        message: error.message
      });

      // Provide helpful error messages
      if (error.code === 'ECONNREFUSED') {
        logger.error('💡 Connection Refused - Possible Solutions:', {
          type: config.DB.USER && config.DB.USER.startsWith('u') ? 'remote' : 'local',
          suggestions: config.DB.USER && config.DB.USER.startsWith('u')
            ? ['Check hosting control panel for MySQL hostname', 'Verify IP whitelisting in Remote MySQL']
            : ['Ensure MySQL service is running', 'Verify MySQL is listening on port 3306']
        });
      } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        logger.error('💡 Authentication Failed - Check database credentials');
      } else if (error.code === 'ER_BAD_DB_ERROR') {
        logger.error('💡 Database Not Found - Verify DB_NAME in .env');
      } else if (error.code === 'ENOTFOUND') {
        logger.error('💡 Host Not Found - Verify DB_HOST in .env');
      }

      // If not the last retry, wait before retrying
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.5; // Exponential backoff
      } else {
        // Last attempt failed
        return false;
      }
    }
  }
  return false;
};

// Execute query helper function with better error handling
const query = async (sql, params = []) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    logger.error('Database query error:', {
      code: error.code,
      message: error.message,
      sql: sql.substring(0, 200) // Log first 200 chars of SQL for debugging
    });

    // Don't expose SQL details in production
    if (config.NODE_ENV === 'production') {
      // Map common database errors to user-friendly messages
      if (error.code === 'ER_DUP_ENTRY') {
        const friendlyError = new Error('Duplicate entry detected');
        friendlyError.code = error.code;
        throw friendlyError;
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        const friendlyError = new Error('Referenced record does not exist');
        friendlyError.code = error.code;
        throw friendlyError;
      }
    }

    throw error;
  }
};

// Get a single connection (for transactions)
const getConnection = async () => {
  return await pool.getConnection();
};

// Graceful shutdown - close all connections
const closePool = async () => {
  try {
    await pool.end();
    logger.info('Database connection pool closed');
  } catch (error) {
    logger.error('Error closing database pool:', error);
  }
};

// Handle pool errors
pool.on('error', (err) => {
  logger.error('Database pool error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    logger.warn('Database connection lost. Pool will attempt to reconnect.');
  }
});

module.exports = {
  pool,
  query,
  getConnection,
  testConnection,
  closePool
};

