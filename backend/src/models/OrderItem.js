import db from '../config/db.js';

class OrderItem {
  // PK is (orderID, bookID)
  static async create({ orderID, bookID, quantity, price_at_purchase }, connection = db) {
    // It's good practice to store the price at the time of purchase in Order_items
    // The schema provided has quantity, but not price_at_purchase.
    // I'll assume you might add `price_at_purchase DECIMAL(10,2)` to Order_items table.
    // If not, remove it from params.
    // For now, using the provided schema which only has quantity.

    // Fetch current book price if price_at_purchase is not passed and needs to be stored
    // For simplicity, the schema doesn't have it, so we just store quantity.
    const sql = 'INSERT INTO Order_items (orderID, bookID, quantity) VALUES (?, ?, ?)';
    const params = [orderID, bookID, quantity];
    const [result] = await connection.query(sql, params);
    return result; // No insertId for composite PK, result contains affectedRows etc.
  }

  static async findByOrderId(orderID, connection = db) {
    const sql = `
      SELECT oi.*, b.book_name, b.image
      FROM Order_items oi
      JOIN Books b ON oi.bookID = b.bookID
      WHERE oi.orderID = ?
    `;
    const [rows] = await connection.query(sql, [orderID]);
    return rows;
  }

  static async findByOrderAndBook(orderID, bookID, connection = db) {
    const [rows] = await connection.query('SELECT * FROM Order_items WHERE orderID = ? AND bookID = ?', [orderID, bookID]);
    return rows[0];
  }

  // Update quantity for an order item (usually not done post-order, but if needed)
  static async updateQuantity(orderID, bookID, quantity, connection = db) {
    const sql = 'UPDATE Order_items SET quantity = ? WHERE orderID = ? AND bookID = ?';
    const [result] = await connection.query(sql, [quantity, orderID, bookID]);
    return result;
  }

  static async deleteByOrderId(orderID, connection = db) {
    const sql = 'DELETE FROM Order_items WHERE orderID = ?';
    const [result] = await connection.query(sql, [orderID]);
    return result.affectedRows > 0;
  }

  static async checkIfUserPurchasedBook(userID, bookID, connection = db) {
    const sql = `
        SELECT 1
        FROM Orders o
        JOIN Order_items oi ON o.orderID = oi.orderID
        WHERE o.userID = ? AND oi.bookID = ? AND o.payment_status = 'Paid' -- Or other completed status
        LIMIT 1
    `;
    const [rows] = await connection.query(sql, [userID, bookID]);
    return rows.length > 0;
  }
}

export default OrderItem;