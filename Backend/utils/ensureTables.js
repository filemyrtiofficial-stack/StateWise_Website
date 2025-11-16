/**
 * Ensure Database Tables Exist
 * Automatically creates required tables if they don't exist
 */

const { query } = require('../config/database');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

/**
 * Check if a table exists
 */
async function tableExists(tableName) {
  try {
    const result = await query(`
      SELECT COUNT(*) as count
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ?
    `, [tableName]);

    return result.length > 0 && result[0].count > 0;
  } catch (error) {
    logger.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}

/**
 * Create newsletter_subscriptions table if it doesn't exist
 */
async function ensureNewsletterTable() {
  try {
    const exists = await tableExists('newsletter_subscriptions');

    if (exists) {
      logger.info('✅ newsletter_subscriptions table already exists');
      return true;
    }

    logger.info('📝 Creating newsletter_subscriptions table...');

    const sql = `
      CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        status ENUM('active', 'unsubscribed') DEFAULT 'active',
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_status (status),
        INDEX idx_subscribed_at (subscribed_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await query(sql);
    logger.info('✅ newsletter_subscriptions table created successfully');
    return true;
  } catch (error) {
    logger.error('❌ Failed to create newsletter_subscriptions table:', error);
    // Don't throw - allow server to start even if table creation fails
    // The table might already exist or there might be permission issues
    return false;
  }
}

/**
 * Ensure all required tables exist
 */
async function ensureAllTables() {
  try {
    await ensureNewsletterTable();
    // Add other table checks here if needed in the future
  } catch (error) {
    logger.error('Error ensuring tables:', error);
  }
}

module.exports = {
  ensureNewsletterTable,
  ensureAllTables,
  tableExists
};


