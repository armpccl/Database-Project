import db from '../config/db.js';

class Order {
  // Assumes orderID is AUTO_INCREMENT
  static async create({
    userID, total_price, status = 'Pending Payment', payment_method,
    payment_status = 'Pending', tracking_number
  }, connection = db) {
    // If orderID is not auto-increment, it must be provided
    const sql = `
      INSERT INTO Orders (userID, total_price, status, payment_method, payment_status, tracking_number, created, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    const params = [userID, total_price, status, payment_method, payment_status, tracking_number];
    const [result] = await connection.query(sql, params);
    return { id: result.insertId, userID, total_price, status };
  }

  static async findById(orderID, connection = db) {
    const [rows] = await connection.query('SELECT * FROM Orders WHERE orderID = ?', [orderID]);
    return rows[0];
  }

  static async findByIdAndUserId(orderID, userID, connection = db) {
    const [rows] = await connection.query('SELECT * FROM Orders WHERE orderID = ? AND userID = ?', [orderID, userID]);
    return rows[0];
  }

  static async findAllByUserId(userID, connection = db) {
    const [rows] = await connection.query('SELECT * FROM Orders WHERE userID = ? ORDER BY created DESC', [userID]);
    return rows;
  }

  static async findAll(connection = db) { // For admin
    const [rows] = await connection.query('SELECT * FROM Orders ORDER BY created DESC');
    return rows;
  }

  static async update(orderID, updateData, connection = db) {
    const allowedFields = ['total_price', 'status', 'payment_method', 'payment_status', 'tracking_number'];
    const fieldsToUpdate = [];
    const params = [];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        fieldsToUpdate.push(`${field} = ?`);
        params.push(updateData[field]);
      }
    }

    if (fieldsToUpdate.length === 0) {
      return { affectedRows: 0, message: "No valid fields to update." };
    }

    fieldsToUpdate.push('last_updated = CURRENT_TIMESTAMP');
    const sql = `UPDATE Orders SET ${fieldsToUpdate.join(', ')} WHERE orderID = ?`;
    params.push(orderID);

    const [result] = await connection.query(sql, params);
    return result;
  }

  static async updatePaymentStatus(orderID, payment_status, connection = db) {
    const sql = 'UPDATE Orders SET payment_status = ?, last_updated = CURRENT_TIMESTAMP WHERE orderID = ?';
    const [result] = await connection.query(sql, [payment_status, orderID]);
    return result;
  }

  static async updateTracking(orderID, tracking_number, status = 'Shipped', connection = db) {
    const sql = 'UPDATE Orders SET tracking_number = ?, status = ?, last_updated = CURRENT_TIMESTAMP WHERE orderID = ?';
    const [result] = await connection.query(sql, [tracking_number, status, orderID]);
    return result;
  }

   static async unlinkShipping(trackingNumber, connection = db) {
    const sql = 'UPDATE Orders SET tracking_number = NULL, last_updated = CURRENT_TIMESTAMP WHERE tracking_number = ?';
    const [result] = await connection.query(sql, [trackingNumber]);
    return result;
  }

  static async deleteById(orderID, connection = db) {
    // Ensure Order_items are handled (e.g., cascading delete in DB or manual deletion before this).
    const [result] = await connection.query('DELETE FROM Orders WHERE orderID = ?', [orderID]);
    return result.affectedRows > 0;
  }
}

export default Order;