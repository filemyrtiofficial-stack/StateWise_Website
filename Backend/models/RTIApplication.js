/**
 * RTI Application Model
 * Handles all database operations related to RTI applications
 */

const { query } = require('../config/database');

class RTIApplication {
  /**
   * Create a new RTI application
   */
  static async create(applicationData) {
    const {
      user_id = null, // Allow null for public submissions
      service_id,
      state_id,
      full_name,
      mobile,
      email,
      rti_query,
      address,
      pincode,
      payment_id = null,
      order_id = null,
      status = 'pending'
    } = applicationData;

    const sql = `
      INSERT INTO rti_applications 
      (user_id, service_id, state_id, full_name, mobile, email, rti_query, address, pincode, payment_id, order_id, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const result = await query(sql, [
      user_id, service_id, state_id, full_name, mobile, email, rti_query, address, pincode, payment_id, order_id, status
    ]);

    return result.insertId;
  }

  /**
   * Find application by ID
   */
  static async findById(id) {
    const sql = `
      SELECT 
        ra.*,
        u.name as user_name,
        u.email as user_email,
        s.name as service_name,
        st.name as state_name
      FROM rti_applications ra
      LEFT JOIN users u ON ra.user_id = u.id
      LEFT JOIN services s ON ra.service_id = s.id
      LEFT JOIN states st ON ra.state_id = st.id
      WHERE ra.id = ?
    `;

    const results = await query(sql, [id]);
    return results[0] || null;
  }

  /**
   * Get all applications (with filters and pagination)
   */
  static async findAll(filters = {}, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    let sql = `
      SELECT 
        ra.*,
        u.name as user_name,
        u.email as user_email,
        s.name as service_name,
        st.name as state_name
      FROM rti_applications ra
      LEFT JOIN users u ON ra.user_id = u.id
      LEFT JOIN services s ON ra.service_id = s.id
      LEFT JOIN states st ON ra.state_id = st.id
      WHERE 1=1
    `;

    const params = [];

    // Apply filters
    if (filters.user_id !== undefined && filters.user_id !== null) {
      sql += ' AND ra.user_id = ?';
      params.push(filters.user_id);
    }

    if (filters.status) {
      sql += ' AND ra.status = ?';
      params.push(filters.status);
    }

    if (filters.service_id) {
      sql += ' AND ra.service_id = ?';
      params.push(filters.service_id);
    }

    if (filters.state_id) {
      sql += ' AND ra.state_id = ?';
      params.push(filters.state_id);
    }

    sql += ' ORDER BY ra.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const countSql = `
      SELECT COUNT(*) as total 
      FROM rti_applications ra
      WHERE 1=1
      ${filters.user_id ? 'AND ra.user_id = ?' : ''}
      ${filters.status ? 'AND ra.status = ?' : ''}
      ${filters.service_id ? 'AND ra.service_id = ?' : ''}
      ${filters.state_id ? 'AND ra.state_id = ?' : ''}
    `;

    const countParams = [];
    if (filters.user_id) countParams.push(filters.user_id);
    if (filters.status) countParams.push(filters.status);
    if (filters.service_id) countParams.push(filters.service_id);
    if (filters.state_id) countParams.push(filters.state_id);

    const [applications, countResult] = await Promise.all([
      query(sql, params),
      query(countSql, countParams)
    ]);

    return {
      applications,
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  }

  /**
   * Update application status
   */
  static async updateStatus(id, status) {
    const sql = 'UPDATE rti_applications SET status = ?, updated_at = NOW() WHERE id = ?';
    await query(sql, [status, id]);
    return await this.findById(id);
  }

  /**
   * Update application
   */
  static async update(id, applicationData) {
    const { rti_query, address, pincode, status } = applicationData;

    const sql = `
      UPDATE rti_applications 
      SET rti_query = ?, address = ?, pincode = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await query(sql, [rti_query, address, pincode, status, id]);
    return await this.findById(id);
  }

  /**
   * Delete application
   */
  static async delete(id) {
    const sql = 'DELETE FROM rti_applications WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  /**
   * Get user's applications
   */
  static async findByUserId(userId, page = 1, limit = 10) {
    return await this.findAll({ user_id: userId }, page, limit);
  }
}

module.exports = RTIApplication;

