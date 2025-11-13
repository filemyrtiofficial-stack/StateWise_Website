/**
 * State Model
 * Handles all database operations related to states
 */

const { query } = require('../config/database');

class State {
  /**
   * Create a new state
   */
  static async create(stateData) {
    const { name, slug, description, rti_portal_url, created_at } = stateData;

    const sql = `
      INSERT INTO states (name, slug, description, rti_portal_url, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [name, slug, description, rti_portal_url, created_at || new Date()]);
    return result.insertId;
  }

  /**
   * Find state by slug (case-insensitive)
   */
  static async findBySlug(slug) {
    // Use LOWER() for case-insensitive comparison
    const sql = 'SELECT * FROM states WHERE LOWER(slug) = LOWER(?)';
    const results = await query(sql, [slug]);
    return results[0] || null;
  }

  /**
   * Find state by ID
   */
  static async findById(id) {
    const sql = 'SELECT * FROM states WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] || null;
  }

  /**
   * Get all states
   */
  static async findAll() {
    const sql = 'SELECT * FROM states ORDER BY name ASC';
    return await query(sql);
  }

  /**
   * Update state
   */
  static async update(id, stateData) {
    const { name, description, rti_portal_url } = stateData;

    const sql = `
      UPDATE states 
      SET name = ?, description = ?, rti_portal_url = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await query(sql, [name, description, rti_portal_url, id]);
    return await this.findById(id);
  }

  /**
   * Delete state
   */
  static async delete(id) {
    const sql = 'DELETE FROM states WHERE id = ?';
    await query(sql, [id]);
    return true;
  }
}

module.exports = State;

