import { pool } from '../db.js';

export const createOrder = async (req, res) => {
  try {
    const customerID = req.user.customerID;
    // ใช้ cartID ของ user สร้าง order
    const [[{ cartID }]] = await pool.execute(
      `SELECT cartID FROM Cart WHERE customerID = ?`,
      [customerID]
    );
    const [result] = await pool.execute(
      `INSERT INTO Orders (total_price, created, last_updated, status, payment_method, payment_status, cartID)
       VALUES (
         (SELECT SUM(b.price * ci.quantity)
            FROM Cart_items ci
            JOIN Books b ON ci.bookID = b.bookID
            WHERE ci.cartID = ?),
         NOW(), NOW(), 'Pending', ?, 'Unpaid', ?
       )`,
      [cartID, req.body.payment_method, cartID]
    );
    res.status(201).json({ orderID: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot create order' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const customerID = req.user.customerID;
    const [orders] = await pool.execute(
      `SELECT o.*, c.coupon
       FROM Orders o
       JOIN Cart c ON o.cartID = c.cartID
       WHERE c.customerID = ?
       ORDER BY o.created DESC`,
      [customerID]
    );
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot fetch orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderID = req.params.id;
    const [[order]] = await pool.execute(
      `SELECT * FROM Orders WHERE orderID = ?`,
      [orderID]
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const [items] = await pool.execute(
      `SELECT oi.bookID, oi.quantity, b.book_name, b.price
       FROM Order_items oi
       JOIN Books b ON oi.bookID = b.bookID
       WHERE oi.orderID = ?`,
      [orderID]
    );
    res.json({ order, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot fetch order details' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderID = req.params.id;
    const { status } = req.body;
    await pool.execute(
      `UPDATE Orders SET status = ?, last_updated = NOW() WHERE orderID = ?`,
      [status, orderID]
    );
    res.json({ message: 'Order status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot update order status' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const orderID = req.params.id;
    await pool.execute(`DELETE FROM Orders WHERE orderID = ?`, [orderID]);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot delete order' });
  }
};
