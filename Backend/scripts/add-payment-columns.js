/**
 * Migration Script: Add Payment Columns to RTI Applications
 * Adds payment_id and order_id columns to track payments
 */

require('dotenv').config();
const { query } = require('../config/database');

async function addPaymentColumns() {
  try {
    console.log('🔄 Adding payment columns to rti_applications table...\n');

    // Check if columns already exist
    const checkColumns = await query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'rti_applications' 
      AND COLUMN_NAME IN ('payment_id', 'order_id')
    `, [process.env.DB_NAME]);

    if (checkColumns.length > 0) {
      console.log('✅ Payment columns already exist:');
      checkColumns.forEach(col => console.log(`   - ${col.COLUMN_NAME}`));
      console.log('\n✅ Migration already completed. No changes needed.');
      return;
    }

    // Add payment_id column
    console.log('Adding payment_id column...');
    await query(`
      ALTER TABLE rti_applications
      ADD COLUMN payment_id VARCHAR(255) NULL AFTER pincode
    `);
    console.log('   ✅ payment_id column added');

    // Add order_id column
    console.log('Adding order_id column...');
    await query(`
      ALTER TABLE rti_applications
      ADD COLUMN order_id VARCHAR(255) NULL AFTER payment_id
    `);
    console.log('   ✅ order_id column added');

    // Add indexes
    console.log('Adding indexes...');
    await query(`
      ALTER TABLE rti_applications
      ADD INDEX idx_payment_id (payment_id)
    `);
    await query(`
      ALTER TABLE rti_applications
      ADD INDEX idx_order_id (order_id)
    `);
    console.log('   ✅ Indexes added');

    console.log('\n✅ Migration completed successfully!');
    console.log('   Payment tracking is now enabled for RTI applications.\n');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);

    // Check if it's a duplicate column error
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('\n⚠️  Some columns may already exist. Migration partially completed.');
    } else {
      console.error('Error details:', error);
      process.exit(1);
    }
  } finally {
    process.exit(0);
  }
}

// Run migration
addPaymentColumns();

