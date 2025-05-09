import { pool } from '../db.js';

export const addToCart = async (req, res) => {
  try {
    const customerID = req.user.customerID;
    const { bookID, quantity } = req.body;
    await pool.execute(
      `INSERT INTO Cart_items (cartID, bookID, quantity)
       VALUES (
         (SELECT cartID FROM Cart WHERE customerID = ?),
         ?, ?
       )
       ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
      [customerID, bookID, quantity, quantity]
    );
    res.json({ message: 'Added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot add to cart' });
  }
};

export const getCart = async (req, res) => {
  try {
    const customerID = req.user.customerID;
    const [items] = await pool.execute(
      `SELECT ci.bookID, ci.quantity, b.book_name, b.price
       FROM Cart_items ci
       JOIN Cart c ON ci.cartID = c.cartID
       JOIN Books b ON ci.bookID = b.bookID
       WHERE c.customerID = ?`,
      [customerID]
    );
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot get cart' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const customerID = req.user.customerID;
    const { bookID } = req.params;
    await pool.execute(
      `DELETE ci
       FROM Cart_items ci
       JOIN Cart c ON ci.cartID = c.cartID
       WHERE c.customerID = ? AND ci.bookID = ?`,
      [customerID, bookID]
    );
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot remove from cart' });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const customerID = req.user.customerID;
    const { couponCode } = req.body;
    // สมมติว่าตาราง Cart มี field coupon
    await pool.execute(
      `UPDATE Cart c
       SET c.coupon = ?
       WHERE c.customerID = ?`,
      [couponCode, customerID]
    );
    res.json({ message: 'Coupon applied' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot apply coupon' });
  }
};
