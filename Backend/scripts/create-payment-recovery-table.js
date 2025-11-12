/**
 * Create Payment Recovery Table
 * Run this script to create the payment_recoveries table
 */

require('dotenv').config();
const { query } = require('../config/database');

async function createPaymentRecoveryTable() {
  try {
    console.log('🔄 Creating payment_recoveries table...\n');

    // Check if table already exists
    const checkTable = await query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = ? 
      AND table_name = 'payment_recoveries'
    `, [process.env.DB_NAME]);

    if (checkTable[0].count > 0) {
      console.log('✅ payment_recoveries table already exists.');
      return;
    }

    // Create table
    await query(`
      CREATE TABLE payment_recoveries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        payment_id VARCHAR(255) NOT NULL,
        order_id VARCHAR(255) NOT NULL,
        service_id INT NOT NULL,
        state_id INT NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        email VARCHAR(100) NOT NULL,
        rti_query TEXT NOT NULL,
        address TEXT NOT NULL,
        pincode VARCHAR(10) NOT NULL,
        error_message TEXT,
        request_body TEXT,
        status ENUM('pending', 'processed', 'failed') DEFAULT 'pending',
        application_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_payment_id (payment_id),
        INDEX idx_order_id (order_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ payment_recoveries table created successfully!\n');
  } catch (error) {
    console.error('❌ Failed to create payment_recoveries table:', error.message);
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('✅ Table already exists.');
    } else {
      process.exit(1);
    }
  } finally {
    process.exit(0);
  }
}

createPaymentRecoveryTable();

