/**
 * Database Setup Script
 * Executes the SQL setup file to create all necessary tables
 * Usage: node scripts/setup-database.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { query, getConnection } = require('../config/database');

async function setupDatabase() {
  let connection;

  try {
    console.log('🚀 Setting up database...\n');
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Host: ${process.env.DB_HOST}\n`);

    // Read SQL file
    const sqlFile = path.join(__dirname, '../database/setup.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split SQL into individual statements
    // Remove comments and split by semicolon
    const cleanedSql = sql
      .replace(/--.*$/gm, '') // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .trim();

    const statements = cleanedSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.length > 10); // Filter out very short strings (likely empty)

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Get a connection for transactions
    connection = await getConnection();

    // Start transaction
    await connection.beginTransaction();

    let successCount = 0;
    let errorCount = 0;

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Skip empty statements and comments
      if (!statement || statement.startsWith('--')) {
        continue;
      }

      try {
        await connection.query(statement);
        successCount++;

        // Extract table name if it's a CREATE TABLE statement
        const createMatch = statement.match(/CREATE TABLE (?:IF NOT EXISTS )?`?(\w+)`?/i);
        if (createMatch) {
          console.log(`✅ Created table: ${createMatch[1]}`);
        } else if (statement.toUpperCase().includes('INSERT')) {
          console.log(`✅ Inserted data`);
        }
      } catch (error) {
        // Ignore "table already exists" errors
        if (error.code === 'ER_TABLE_EXISTS_ERROR' || error.message.includes('already exists')) {
          console.log(`⚠️  Table already exists (skipping)`);
          successCount++;
        } else {
          errorCount++;
          console.error(`❌ Error executing statement ${i + 1}:`, error.message);
          // Don't throw, continue with other statements
        }
      }
    }

    // Commit transaction
    await connection.commit();
    connection.release();

    console.log(`\n✅ Database setup completed!`);
    console.log(`   Successful: ${successCount}`);
    if (errorCount > 0) {
      console.log(`   Errors: ${errorCount}`);
    }

    // Verify tables were created
    console.log('\n🔍 Verifying tables...');
    const tables = await query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME
    `, [process.env.DB_NAME]);

    console.log(`\n📊 Tables in database:`);
    tables.forEach(table => {
      console.log(`   ✅ ${table.TABLE_NAME}`);
    });

    // Check rti_applications specifically
    const rtiTable = tables.find(t => t.TABLE_NAME === 'rti_applications');
    if (rtiTable) {
      console.log('\n✅ rti_applications table is ready!');
      console.log('💡 You can now submit forms and they will be saved to the database.');
    } else {
      console.log('\n❌ rti_applications table was not created. Check errors above.');
    }

  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error('\n❌ Database setup failed:', error.message);
    console.error('Error code:', error.code);

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Check your database credentials in .env file');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Database does not exist. Create it first.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Cannot connect to MySQL server. Make sure it is running.');
    }

    process.exit(1);
  }
}

setupDatabase();

