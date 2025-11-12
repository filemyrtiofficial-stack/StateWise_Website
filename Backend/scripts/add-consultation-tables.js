/**
 * Add Consultation Tables Script
 * Adds consultations and callback_requests tables to the database
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { query, getConnection } = require('../config/database');

async function addConsultationTables() {
  let connection;

  try {
    console.log('🚀 Adding consultation tables...\n');
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Host: ${process.env.DB_HOST}\n`);

    // Read SQL file
    const sqlFile = path.join(__dirname, '../database/add-consultations-table.sql');
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

    console.log(`\n✅ Tables added successfully!`);
    console.log(`   Successful: ${successCount}`);
    if (errorCount > 0) {
      console.log(`   Errors: ${errorCount}`);
    }

    // Verify tables were created
    console.log('\n🔍 Verifying tables...');
    const tables = await query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('consultations', 'callback_requests')
      ORDER BY TABLE_NAME
    `, [process.env.DB_NAME]);

    console.log(`\n📊 Consultation tables:`);
    tables.forEach(table => {
      console.log(`   ✅ ${table.TABLE_NAME}`);
    });

    if (tables.length === 2) {
      console.log('\n✅ All consultation tables are ready!');
      console.log('💡 Hero section forms can now save data to the database.');
    } else {
      console.log('\n⚠️  Some tables may be missing. Check errors above.');
    }

  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error('\n❌ Failed to add tables:', error.message);
    console.error('Error code:', error.code);
    process.exit(1);
  }
}

addConsultationTables();

