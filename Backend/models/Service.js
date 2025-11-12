/**
 * Service Model
 * Handles all database operations related to RTI services
 */

const { query } = require('../config/database');

class Service {
  /**
   * Create a new service
   */
  static async create(serviceData) {
    const { name, slug, description, full_description, price, original_price, button_text, icon, icon_text } = serviceData;

    const sql = `
      INSERT INTO services (name, slug, description, full_description, price, original_price, button_text, icon, icon_text, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const result = await query(sql, [
      name, slug, description, full_description, price, original_price, button_text, icon, icon_text
    ]);

    return result.insertId;
  }

  /**
   * Find service by slug
   */
  static async findBySlug(slug) {
    const sql = 'SELECT * FROM services WHERE slug = ?';
    const results = await query(sql, [slug]);
    return results[0] || null;
  }

  /**
   * Find service by ID
   */
  static async findById(id) {
    const sql = 'SELECT * FROM services WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] || null;
  }

  /**
   * Get all services
   */
  static async findAll() {
    const sql = 'SELECT * FROM services ORDER BY created_at DESC';
    return await query(sql);
  }

  /**
   * Update service
   */
  static async update(id, serviceData) {
    const { name, description, full_description, price, original_price, button_text, icon, icon_text } = serviceData;

    const sql = `
      UPDATE services 
      SET name = ?, description = ?, full_description = ?, price = ?, 
          original_price = ?, button_text = ?, icon = ?, icon_text = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await query(sql, [name, description, full_description, price, original_price, button_text, icon, icon_text, id]);
    return await this.findById(id);
  }

  /**
   * Delete service
   */
  static async delete(id) {
    const sql = 'DELETE FROM services WHERE id = ?';
    await query(sql, [id]);
    return true;
  }
}

module.exports = Service;

