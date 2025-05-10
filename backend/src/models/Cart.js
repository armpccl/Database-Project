import db from '../config/db.js';

class Cart {
  // Assumes cartID is AUTO_INCREMENT
  static async create({ userID, total_price = 0, coupon, cart_promotionID }, connection = db) {
    const sql = `
      INSERT INTO Cart (userID, total_price, coupon, cart_promotionID, created, last_updated)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    const params = [userID, total_price, coupon, cart_promotionID];
    const [result] = await connection.query(sql, params);
    return { cartID: result.insertId, userID, total_price };
  }

  static async findById(cartID, connection = db) {
    const [rows] = await connection.query('SELECT * FROM Cart WHERE cartID = ?', [cartID]);
    return rows[0];
  }

  static async findByUserId(userID, connection = db) {
    const [rows] = await connection.query('SELECT * FROM Cart WHERE userID = ?', [userID]);
    return rows[0]; // Assuming one active cart per user
  }

  static async update(cartID, { total_price, coupon, cart_promotionID }, connection = db) {
    const fields = [];
    const params = [];

    if (total_price !== undefined) {
      fields.push('total_price = ?');
      params.push(total_price);
    }
    if (coupon !== undefined) { // Allows setting coupon to null
      fields.push('coupon = ?');
      params.push(coupon);
    }
    if (cart_promotionID !== undefined) { // Allows setting cart_promotionID to null
      fields.push('cart_promotionID = ?');
      params.push(cart_promotionID);
    }

    if (fields.length === 0) {
      return { affectedRows: 0, message: 'No fields to update' };
    }

    fields.push('last_updated = CURRENT_TIMESTAMP');
    const sql = `UPDATE Cart SET ${fields.join(', ')} WHERE cartID = ?`;
    params.push(cartID);

    const [result] = await connection.query(sql, params);
    return result;
  }

  static async applyCoupon(cartID, couponCode, connection = db) {
    const sql = 'UPDATE Cart SET coupon = ?, cart_promotionID = NULL, last_updated = CURRENT_TIMESTAMP WHERE cartID = ?';
    // Assuming applying a coupon might clear a cart-wide promotion, or vice-versa.
    // Adjust logic if they can coexist or have priority.
    const [result] = await connection.query(sql, [couponCode, cartID]);
    return result;
  }

  static async applyCartPromotion(cartID, promotionId, connection = db) {
    const sql = 'UPDATE Cart SET cart_promotionID = ?, coupon = NULL, last_updated = CURRENT_TIMESTAMP WHERE cartID = ?';
    const [result] = await connection.query(sql, [promotionId, cartID]);
    return result;
  }


  static async resetCart(cartID, connection = db) {
    // Called after an order is placed, or if a cart needs full reset
    const sql = 'UPDATE Cart SET total_price = 0, coupon = NULL, cart_promotionID = NULL, last_updated = CURRENT_TIMESTAMP WHERE cartID = ?';
    const [result] = await connection.query(sql, [cartID]);
    return result;
  }


  static async deleteById(cartID, connection = db) {
    // Usually, carts are not deleted but emptied or marked inactive.
    // If deleting, ensure Cart_items are handled (e.g., cascading delete in DB).
    const [result] = await connection.query('DELETE FROM Cart WHERE cartID = ?', [cartID]);
    return result.affectedRows > 0;
  }
}

export default Cart;