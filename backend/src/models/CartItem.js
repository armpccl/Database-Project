import db from '../config/db.js';

class CartItem {
  // PK is (cartID, bookID)
  static async findByCartId(cartID, connection = db) {
    const sql = `
        SELECT ci.*, b.book_name, b.price as unit_price, b.image, b.stock as book_stock
        FROM Cart_items ci
        JOIN Books b ON ci.bookID = b.bookID
        WHERE ci.cartID = ?
    `;
    const [rows] = await connection.query(sql, [cartID]);
    return rows;
  }

  static async findByCartAndBook(cartID, bookID, connection = db) {
    const [rows] = await connection.query(
      'SELECT quantity FROM Cart_items WHERE cartID = ? AND bookID = ?',
      [cartID, bookID]
    );
    return rows[0];
  }


  static async addOrUpdateItem(cartID, bookID, quantity, connection = db) {
    const existingItem = await this.findByCartAndBook(cartID, bookID, connection);

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      const sql = 'UPDATE Cart_items SET quantity = ? WHERE cartID = ? AND bookID = ?';
      const [result] = await connection.query(sql, [newQuantity, cartID, bookID]);
      return result;
    } else {
      // Insert new item
      const sql = 'INSERT INTO Cart_items (cartID, bookID, quantity) VALUES (?, ?, ?)';
      const [result] = await connection.query(sql, [cartID, bookID, quantity]);
      return result;
    }
  }

  static async updateItemQuantity(cartID, bookID, quantity, connection = db) {
    if (quantity <= 0) { // If quantity is 0 or less, remove the item
        return this.removeItem(cartID, bookID, connection);
    }
    const sql = 'UPDATE Cart_items SET quantity = ? WHERE cartID = ? AND bookID = ?';
    const [result] = await connection.query(sql, [quantity, cartID, bookID]);
    return result;
  }

  static async removeItem(cartID, bookID, connection = db) {
    const sql = 'DELETE FROM Cart_items WHERE cartID = ? AND bookID = ?';
    const [result] = await connection.query(sql, [cartID, bookID]);
    return result.affectedRows > 0;
  }

  static async clearCart(cartID, connection = db) {
    const sql = 'DELETE FROM Cart_items WHERE cartID = ?';
    const [result] = await connection.query(sql, [cartID]);
    return result.affectedRows > 0; // Returns true if items were deleted
  }
}

export default CartItem;