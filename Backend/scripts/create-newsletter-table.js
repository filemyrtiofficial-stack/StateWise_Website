/**
 * Create Newsletter Subscriptions Table Script
 * Creates the newsletter_subscriptions table in the database
 * Usage: node scripts/create-newsletter-table.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { query, getConnection } = require('../config/database');

async function createNewsletterTable() {
  let connection;

  try {
    console.log('🚀 Creating newsletter subscriptions table...\n');
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Host: ${process.env.DB_HOST}\n`);

    // Read SQL file
    const sqlFile = path.join(__dirname, '../database/create-newsletter-subscriptions-table.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split SQL into individual statements
    const cleanedSql = sql
      .replace(/--.*$/gm, '') // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .trim();

    const statements = cleanedSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.length > 10);

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
        }
      } catch (error) {
        // Ignore "table already exists" errors
        if (error.code === 'ER_TABLE_EXISTS_ERROR' || error.message.includes('already exists')) {
          console.log(`⚠️  Table already exists (skipping)`);
          successCount++;
        } else {
          errorCount++;
          console.error(`❌ Error executing statement ${i + 1}:`, error.message);
        }
      }
    }

    // Commit transaction
    await connection.commit();
    connection.release();

    console.log(`\n✅ Newsletter table created successfully!`);
    console.log(`   Successful: ${successCount}`);
    if (errorCount > 0) {
      console.log(`   Errors: ${errorCount}`);
    }

    // Verify table was created
    console.log('\n🔍 Verifying table...');
    const tables = await query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'newsletter_subscriptions'
      ORDER BY TABLE_NAME
    `, [process.env.DB_NAME]);

    if (tables.length > 0) {
      console.log(`\n📊 Newsletter table:`);
      tables.forEach(table => {
        console.log(`   ✅ ${table.TABLE_NAME}`);
      });
      console.log('\n✅ Newsletter subscriptions table is ready!');
      console.log('💡 Footer email subscription form can now save data to the database.');
    } else {
      console.log('\n⚠️  Table may not have been created. Check errors above.');
    }

  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error('\n❌ Failed to create table:', error.message);
    console.error('Error code:', error.code);
    process.exit(1);
  }
}

createNewsletterTable();

