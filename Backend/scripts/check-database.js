/**
 * Check Database Tables Script
 * Verify if tables exist and show their structure
 */

require('dotenv').config();
const { query } = require('../config/database');

async function checkDatabase() {
  try {
    console.log('🔍 Checking database tables...\n');

    // Check if rti_applications table exists
    const tables = await query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'rti_applications'
    `, [process.env.DB_NAME]);

    if (!tables || tables.length === 0) {
      console.log('❌ rti_applications table does NOT exist');
      console.log('💡 Run: mysql -u ' + process.env.DB_USER + ' -p ' + process.env.DB_NAME + ' < database/setup.sql');
      return;
    }

    console.log('✅ rti_applications table exists\n');

    // Check table structure
    const columns = await query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'rti_applications'
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME]);

    console.log('📋 Table Structure:');
    columns.forEach(col => {
      console.log(`   ${col.COLUMN_NAME}: ${col.DATA_TYPE} ${col.IS_NULLABLE === 'YES' ? '(NULLABLE)' : '(NOT NULL)'}`);
    });

    // Check if user_id allows NULL
    const user_id_col = columns.find(col => col.COLUMN_NAME === 'user_id');
    if (user_id_col && user_id_col.IS_NULLABLE === 'NO') {
      console.log('\n⚠️  user_id column does NOT allow NULL');
      console.log('💡 Run: mysql -u ' + process.env.DB_USER + ' -p ' + process.env.DB_NAME + ' < database/migrate-rti-applications.sql');
    } else {
      console.log('\n✅ user_id column allows NULL (public submissions enabled)');
    }

    // Count existing records
    const count = await query('SELECT COUNT(*) as total FROM rti_applications');
    console.log(`\n📊 Total records in table: ${count[0].total}`);

    // Show recent records
    if (count[0].total > 0) {
      const recent = await query(`
        SELECT id, full_name, email, mobile, status, created_at 
        FROM rti_applications 
        ORDER BY created_at DESC 
        LIMIT 5
      `);
      console.log('\n📝 Recent records:');
      recent.forEach(record => {
        console.log(`   ID: ${record.id}, Name: ${record.full_name}, Email: ${record.email}, Status: ${record.status}, Created: ${record.created_at}`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('💡 Table does not exist. Run database/setup.sql');
    }
  }
}

checkDatabase().then(() => {
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

