/**
 * Callback Request Model
 * Handles all database operations related to callback requests
 */

const { query } = require('../config/database');

class CallbackRequest {
  /**
   * Create a new callback request
   */
  static async create(callbackData) {
    const { phone, state_slug } = callbackData;

    const sql = `
      INSERT INTO callback_requests (phone, state_slug, created_at)
      VALUES (?, ?, NOW())
    `;

    const result = await query(sql, [phone, state_slug || null]);
    return result.insertId;
  }

  /**
   * Find callback request by ID
   */
  static async findById(id) {
    const sql = 'SELECT * FROM callback_requests WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] || null;
  }

  /**
   * Get all callback requests
   */
  static async findAll(filters = {}) {
    let sql = 'SELECT * FROM callback_requests WHERE 1=1';
    const params = [];

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.state_slug) {
      sql += ' AND state_slug = ?';
      params.push(filters.state_slug);
    }

    sql += ' ORDER BY created_at DESC';

    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);
    }

    return await query(sql, params);
  }

  /**
   * Update callback request status
   */
  static async updateStatus(id, status, notes = null) {
    const sql = `
      UPDATE callback_requests 
      SET status = ?, notes = ?, updated_at = NOW(), called_at = CASE WHEN ? = 'called' THEN NOW() ELSE called_at END
      WHERE id = ?
    `;
    await query(sql, [status, notes, status, id]);
    return await this.findById(id);
  }

  /**
   * Delete callback request
   */
  static async delete(id) {
    const sql = 'DELETE FROM callback_requests WHERE id = ?';
    await query(sql, [id]);
    return true;
  }
}

module.exports = CallbackRequest;

