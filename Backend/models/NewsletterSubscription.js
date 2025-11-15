/**
 * Newsletter Subscription Model
 * Handles email newsletter subscriptions
 */

const { query } = require('../config/database');
const logger = require('../utils/logger');

class NewsletterSubscription {
  /**
   * Create a new newsletter subscription
   * @param {Object} data - Subscription data
   * @param {string} data.email - Email address
   * @returns {Promise<number>} - Subscription ID
   */
  static async create({ email }) {
    try {
      const sql = `
        INSERT INTO newsletter_subscriptions (email, subscribed_at, status)
        VALUES (?, NOW(), 'active')
      `;

      const result = await query(sql, [email.toLowerCase().trim()]);
      return result.insertId;
    } catch (error) {
      logger.error('Error creating newsletter subscription:', error);
      throw error;
    }
  }

  /**
   * Find subscription by email
   * @param {string} email - Email address
   * @returns {Promise<Object|null>} - Subscription object or null
   */
  static async findByEmail(email) {
    try {
      const sql = `
        SELECT * FROM newsletter_subscriptions
        WHERE email = ?
        ORDER BY subscribed_at DESC
        LIMIT 1
      `;

      const rows = await query(sql, [email.toLowerCase().trim()]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      logger.error('Error finding newsletter subscription:', error);
      throw error;
    }
  }

  /**
   * Find subscription by ID
   * @param {number} id - Subscription ID
   * @returns {Promise<Object|null>} - Subscription object or null
   */
  static async findById(id) {
    try {
      const sql = 'SELECT * FROM newsletter_subscriptions WHERE id = ?';
      const rows = await query(sql, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      logger.error('Error finding newsletter subscription by ID:', error);
      throw error;
    }
  }

  /**
   * Get all subscriptions (Admin only)
   * @param {Object} options - Query options
   * @param {number} options.limit - Limit results
   * @param {number} options.offset - Offset for pagination
   * @returns {Promise<Array>} - Array of subscriptions
   */
  static async findAll({ limit = 100, offset = 0 } = {}) {
    try {
      const sql = `
        SELECT * FROM newsletter_subscriptions
        ORDER BY subscribed_at DESC
        LIMIT ? OFFSET ?
      `;

      const rows = await query(sql, [limit, offset]);
      return rows;
    } catch (error) {
      logger.error('Error finding all newsletter subscriptions:', error);
      throw error;
    }
  }

  /**
   * Update subscription status
   * @param {number} id - Subscription ID
   * @param {string} status - New status ('active' or 'unsubscribed')
   * @returns {Promise<boolean>} - Success status
   */
  static async updateStatus(id, status) {
    try {
      const sql = `
        UPDATE newsletter_subscriptions
        SET status = ?, updated_at = NOW()
        WHERE id = ?
      `;

      await query(sql, [status, id]);
      return true;
    } catch (error) {
      logger.error('Error updating newsletter subscription status:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe by email
   * @param {string} email - Email address
   * @returns {Promise<boolean>} - Success status
   */
  static async unsubscribe(email) {
    try {
      const sql = `
        UPDATE newsletter_subscriptions
        SET status = 'unsubscribed', updated_at = NOW()
        WHERE email = ?
      `;

      await query(sql, [email.toLowerCase().trim()]);
      return true;
    } catch (error) {
      logger.error('Error unsubscribing from newsletter:', error);
      throw error;
    }
  }
}

module.exports = NewsletterSubscription;

