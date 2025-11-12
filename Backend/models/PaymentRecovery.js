/**
 * Payment Recovery Model
 * Stores failed application submissions after successful payment
 * Allows admins to recover and process these applications
 */

const { query } = require('../config/database');

class PaymentRecovery {
  /**
   * Create a recovery record
   */
  static async create(recoveryData) {
    const {
      payment_id,
      order_id,
      service_id,
      state_id,
      full_name,
      mobile,
      email,
      rti_query,
      address,
      pincode,
      error_message,
      request_body
    } = recoveryData;

    const sql = `
      INSERT INTO payment_recoveries 
      (payment_id, order_id, service_id, state_id, full_name, mobile, email, rti_query, address, pincode, error_message, request_body, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;

    const result = await query(sql, [
      payment_id, order_id, service_id, state_id, full_name, mobile, email,
      rti_query, address, pincode, error_message, JSON.stringify(request_body)
    ]);

    return result.insertId;
  }

  /**
   * Find recovery by payment ID
   */
  static async findByPaymentId(paymentId) {
    const sql = 'SELECT * FROM payment_recoveries WHERE payment_id = ? ORDER BY created_at DESC LIMIT 1';
    const results = await query(sql, [paymentId]);
    return results[0] || null;
  }

  /**
   * Get all pending recoveries
   */
  static async findPending() {
    const sql = 'SELECT * FROM payment_recoveries WHERE status = "pending" ORDER BY created_at DESC';
    return await query(sql);
  }

  /**
   * Update recovery status
   */
  static async updateStatus(id, status, applicationId = null) {
    const sql = `
      UPDATE payment_recoveries 
      SET status = ?, application_id = ?, updated_at = NOW() 
      WHERE id = ?
    `;
    await query(sql, [status, applicationId, id]);
    return await this.findById(id);
  }

  /**
   * Find by ID
   */
  static async findById(id) {
    const sql = 'SELECT * FROM payment_recoveries WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0] || null;
  }
}

module.exports = PaymentRecovery;

