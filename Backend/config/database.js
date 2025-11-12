/**
 * Database Configuration
 * Handles MySQL database connection using connection pooling
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Validate environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('💡 Tip: Make sure your .env file exists and contains all required variables');
}

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306, // Default MySQL port
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Add connection timeout
  connectTimeout: 10000,
  // Enable multiple statements (if needed)
  multipleStatements: false
});

// Test database connection
const testConnection = async () => {
  try {
    // Log connection attempt details (without password)
    console.log('🔌 Attempting to connect to database...');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Port: ${process.env.DB_PORT || 3306}`);
    console.log(`   User: ${process.env.DB_USER || 'NOT SET'}`);
    console.log(`   Database: ${process.env.DB_NAME || 'NOT SET'}`);

    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('   Error Code:', error.code);
    console.error('   Error Message:', error.message || 'Unknown error');

    // Provide helpful error messages
    if (error.code === 'ECONNREFUSED') {
      console.error('\n   💡 Connection Refused - Possible Solutions:');

      // Check if this looks like a remote database
      if (process.env.DB_USER && process.env.DB_USER.startsWith('u')) {
        console.error('   📍 This appears to be a REMOTE/SHARED HOSTING database');
        console.error('   ✅ For shared hosting (cPanel, etc.), try these:');
        console.error('      1. Check your hosting control panel for MySQL hostname');
        console.error('      2. Common hosts: "localhost" (even for remote), or a domain/IP');
        console.error('      3. Look in cPanel → MySQL Databases section');
        console.error('      4. Some hosts require IP whitelisting in "Remote MySQL"');
        console.error('\n   🔧 Quick Fix: Update DB_HOST in .env file');
        console.error('      - If using cPanel: usually "localhost" works');
        console.error('      - If using remote: use the provided MySQL hostname');
        console.error('      - Check your hosting provider\'s documentation');
      } else {
        console.error('   📍 This appears to be a LOCAL database');
        console.error('   ✅ Solutions:');
        console.error('      1. Make sure MySQL service is running');
        console.error('      2. Windows: Run "net start MySQL"');
        console.error('      3. Linux/Mac: Run "sudo service mysql start"');
        console.error('      4. Verify MySQL is listening on port 3306');
      }
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   💡 Authentication Failed');
      console.error('   ✅ Check your database username and password in .env file');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('   💡 Database Not Found');
      console.error('   ✅ Database does not exist. Create it first or check DB_NAME in .env');
    } else if (error.code === 'ENOTFOUND') {
      console.error('   💡 Host Not Found');
      console.error('   ✅ Check DB_HOST in .env file - verify the hostname is correct');
    }

    return false;
  }
};

// Execute query helper function
const query = async (sql, params = []) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Get a single connection (for transactions)
const getConnection = async () => {
  return await pool.getConnection();
};

module.exports = {
  pool,
  query,
  getConnection,
  testConnection
};

