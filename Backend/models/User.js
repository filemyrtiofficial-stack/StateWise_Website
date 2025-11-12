/**
 * User Model
 * Handles all database operations related to users
 */

const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Create a new user
   */
  static async create(userData) {
    const { name, email, password, phone, role = 'user' } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (name, email, password, phone, role, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const result = await query(sql, [name, email, hashedPassword, phone, role]);
    return result.insertId;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const results = await query(sql, [email]);
    return results[0] || null;
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const sql = 'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] || null;
  }

  /**
   * Get all users (with pagination)
   */
  static async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const sql = `
      SELECT id, name, email, phone, role, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;

    const countSql = 'SELECT COUNT(*) as total FROM users';

    const [users, countResult] = await Promise.all([
      query(sql, [limit, offset]),
      query(countSql)
    ]);

    return {
      users,
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  }

  /**
   * Update user
   */
  static async update(id, userData) {
    const { name, email, phone } = userData;
    const sql = `
      UPDATE users 
      SET name = ?, email = ?, phone = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await query(sql, [name, email, phone, id]);
    return await this.findById(id);
  }

  /**
   * Update user password
   */
  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const sql = 'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?';
    await query(sql, [hashedPassword, id]);
  }

  /**
   * Delete user
   */
  static async delete(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;

