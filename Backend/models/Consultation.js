/**
 * Consultation Model
 * Handles all database operations related to consultations
 */

const { query } = require('../config/database');

class Consultation {
  /**
   * Create a new consultation
   */
  static async create(consultationData) {
    const { full_name, email, mobile, address, pincode, state_slug, source } = consultationData;

    const sql = `
      INSERT INTO consultations (full_name, email, mobile, address, pincode, state_slug, source, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const result = await query(sql, [
      full_name, email, mobile, address, pincode, state_slug || null, source || 'hero_section'
    ]);

    return result.insertId;
  }

  /**
   * Find consultation by ID
   */
  static async findById(id) {
    const sql = 'SELECT * FROM consultations WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] || null;
  }

  /**
   * Get all consultations
   */
  static async findAll(filters = {}) {
    let sql = 'SELECT * FROM consultations WHERE 1=1';
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
   * Update consultation status
   */
  static async updateStatus(id, status, notes = null) {
    const sql = `
      UPDATE consultations 
      SET status = ?, notes = ?, updated_at = NOW()
      WHERE id = ?
    `;
    await query(sql, [status, notes, id]);
    return await this.findById(id);
  }

  /**
   * Delete consultation
   */
  static async delete(id) {
    const sql = 'DELETE FROM consultations WHERE id = ?';
    await query(sql, [id]);
    return true;
  }
}

module.exports = Consultation;

