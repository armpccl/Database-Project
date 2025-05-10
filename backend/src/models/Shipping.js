import db from '../config/db.js';

class Shipping {
  // PK is tracking_number (VARCHAR), not auto-increment. Must be provided.
  static async create({ tracking_number, shipping_status, carrier, shipping_date }, connection = db) {
    const sql = `
      INSERT INTO Shipping (tracking_number, shipping_status, carrier, shipping_date)
      VALUES (?, ?, ?, ?)
    `;
    // shipping_date defaults to CURRENT_TIMESTAMP if not provided and column allows null or has default
    // Schema: shipping_date DATETIME DEFAULT CURRENT_TIMESTAMP
    const params = [tracking_number, shipping_status, carrier, shipping_date || new Date()];
    try {
      const [result] = await connection.query(sql, params);
      return { tracking_number, shipping_status, carrier };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Tracking number already exists.');
      }
      throw error;
    }
  }

  static async findByTrackingNumber(tracking_number, connection = db) {
    const [rows] = await connection.query('SELECT * FROM Shipping WHERE tracking_number = ?', [tracking_number]);
    return rows[0];
  }

  static async findAll(connection = db) { // For admin
    const [rows] = await connection.query('SELECT * FROM Shipping ORDER BY shipping_date DESC');
    return rows;
  }

  static async update(tracking_number, { shipping_status, carrier, shipping_date }, connection = db) {
    const fields = [];
    const params = [];
    if (shipping_status !== undefined) {
      fields.push('shipping_status = ?');
      params.push(shipping_status);
    }
    if (carrier !== undefined) {
      fields.push('carrier = ?');
      params.push(carrier);
    }
    if (shipping_date !== undefined) { // To explicitly update the shipping date
        fields.push('shipping_date = ?');
        params.push(shipping_date);
    }

    if (fields.length === 0) {
      return { affectedRows: 0, message: 'No fields to update' };
    }

    const sql = `UPDATE Shipping SET ${fields.join(', ')} WHERE tracking_number = ?`;
    params.push(tracking_number);

    const [result] = await connection.query(sql, params);
    return result;
  }

  static async deleteByTrackingNumber(tracking_number, connection = db) {
    // Before deleting, ensure orders are unlinked from this tracking number.
    // (Handled in controller or by setting Orders.tracking_number to NULL).
    const [result] = await connection.query('DELETE FROM Shipping WHERE tracking_number = ?', [tracking_number]);
    return result.affectedRows > 0;
  }
}

export default Shipping;