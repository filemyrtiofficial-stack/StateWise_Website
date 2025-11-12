/**
 * MySQL Host Finder Script
 * Tries common MySQL hostnames to find the correct one
 * Usage: node scripts/find-mysql-host.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const hostsToTry = [
  'localhost',
  '127.0.0.1',
  'mysql.localhost',
  // Add your domain-based hosts here if known
  // 'mysql.yourdomain.com',
  // 'yourdomain.com',
];

async function testHost(host) {
  try {
    const connection = await mysql.createConnection({
      host: host,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 5000
    });

    await connection.execute('SELECT 1');
    await connection.end();
    return { success: true, host };
  } catch (error) {
    return { success: false, host, error: error.code };
  }
}

async function findMySQLHost() {
  console.log('🔍 Finding MySQL Host...\n');
  console.log('Testing common hostnames...\n');

  if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    console.error('❌ Missing required environment variables');
    console.error('   Make sure DB_USER, DB_PASSWORD, and DB_NAME are set in .env');
    process.exit(1);
  }

  console.log(`Testing with:`);
  console.log(`   User: ${process.env.DB_USER}`);
  console.log(`   Database: ${process.env.DB_NAME}`);
  console.log(`   Port: ${process.env.DB_PORT || 3306}\n`);

  for (const host of hostsToTry) {
    process.stdout.write(`Testing ${host}... `);
    const result = await testHost(host);

    if (result.success) {
      console.log('✅ SUCCESS!');
      console.log(`\n🎉 Found working host: ${host}`);
      console.log(`\nUpdate your .env file with:`);
      console.log(`DB_HOST=${host}`);
      process.exit(0);
    } else {
      console.log(`❌ Failed (${result.error})`);
    }
  }

  console.log('\n❌ None of the common hosts worked.');
  console.log('\n💡 Next steps:');
  console.log('   1. Check your hosting control panel for MySQL hostname');
  console.log('   2. Look in cPanel → MySQL Databases section');
  console.log('   3. Check your hosting provider\'s documentation');
  console.log('   4. Contact your hosting provider support');
  console.log('\n📖 See REMOTE_DATABASE_SETUP.md for more help');
  process.exit(1);
}

findMySQLHost();

