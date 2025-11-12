/**
 * Test Database Connection Script
 * Run this to test your database connection independently
 * Usage: node scripts/test-connection.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🧪 Testing Database Connection...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`   DB_HOST: ${process.env.DB_HOST || '❌ NOT SET'}`);
  console.log(`   DB_USER: ${process.env.DB_USER || '❌ NOT SET'}`);
  console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '✅ SET' : '❌ NOT SET'}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME || '❌ NOT SET'}`);
  console.log('');

  // Validate all required variables
  const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missingVars = requiredVars.filter(v => !process.env[v]);

  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars.join(', '));
    console.error('💡 Create a .env file with all required variables');
    process.exit(1);
  }

  // Test connection
  try {
    console.log('🔌 Attempting to connect...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000
    });

    console.log('✅ Connection successful!');

    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query test successful:', rows);

    // Check if tables exist
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`✅ Found ${tables.length} tables in database`);

    await connection.end();
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);

    // Provide helpful tips
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Tip: MySQL server is not running or not accessible');
      console.error('   - Check if MySQL service is running');
      console.error('   - Verify the host and port are correct');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Tip: Authentication failed');
      console.error('   - Check your username and password in .env');
      console.error('   - Verify the user has proper permissions');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Tip: Database does not exist');
      console.error('   - Create the database first');
      console.error('   - Or check DB_NAME in .env file');
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Tip: Host not found');
      console.error('   - Check DB_HOST in .env file');
      console.error('   - Verify network connectivity');
    }

    process.exit(1);
  }
}

testConnection();

