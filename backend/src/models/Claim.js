import db from '../config/db.js';

class Claim {
  // Assumes claimID is AUTO_INCREMENT
  static async create(data, connection = db) {
    const {
      description, claim_status = 'Open', resolution, support_document,
      userID, orderID, bookID
    } = data;
    // claim_date and last_update default to CURRENT_TIMESTAMP

    const sql = `
      INSERT INTO Claim (description, claim_status, resolution, support_document, userID, orderID, bookID, claim_date, last_update)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    const params = [description, claim_status, resolution, support_document, userID, orderID, bookID];
    const [result] = await connection.query(sql, params);
    return { id: result.insertId, ...data, claim_status };
  }

  static async findById(claimID, connection = db) {
    const [rows] = await connection.query('SELECT * FROM Claim WHERE claimID = ?', [claimID]);
    return rows[0];
  }

  static async findByUserId(userID, connection = db) {
    const [rows] = await connection.query('SELECT * FROM Claim WHERE userID = ? ORDER BY claim_date DESC', [userID]);
    return rows;
  }

  static async findByOrderId(orderID, connection = db) {
    const [rows] = await connection.query('SELECT * FROM Claim WHERE orderID = ? ORDER BY claim_date DESC', [orderID]);
    return rows;
  }

  static async findAll(connection = db) { // For admin
    const sql = `
        SELECT c.*, u.username, o.orderID as order_ref, b.book_name
        FROM Claim c
        JOIN Users u ON c.userID = u.userID
        JOIN Orders o ON c.orderID = o.orderID
        JOIN Books b ON c.bookID = b.bookID
        ORDER BY c.claim_date DESC
    `;
    const [rows] = await connection.query(sql);
    return rows;
  }

  static async update(claimID, data, connection = db) {
    const fields = [];
    const params = [];
    const allowedUpdates = ['description', 'claim_status', 'resolution', 'support_document'];

    allowedUpdates.forEach(field => {
        if (data[field] !== undefined) {
            fields.push(`${field} = ?`);
            params.push(data[field]);
        }
    });

    if (fields.length === 0) return { affectedRows: 0, message: "No fields to update." };

    fields.push('last_update = CURRENT_TIMESTAMP');
    const sql = `UPDATE Claim SET ${fields.join(', ')} WHERE claimID = ?`;
    params.push(claimID);

    const [result] = await connection.query(sql, params);
    return result;
  }

  static async deleteById(claimID, connection = db) {
    const [result] = await connection.query('DELETE FROM Claim WHERE claimID = ?', [claimID]);
    return result.affectedRows > 0;
  }
}

export default Claim;