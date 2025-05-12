import { pool } from '../db.js';

export async function createOrder(req, res) {
  const { payment_method } = req.body;
  const [[cart]] = await pool.query(
    `SELECT cartID FROM Cart WHERE userID = ?`, [req.user.userID]
  );
  if (!cart) return res.status(400).json({ error: 'Empty cart' });
  // calculate total
  const [items] = await pool.query(
    `SELECT b.price,ci.quantity
       FROM Cart_items ci
  JOIN Books b ON ci.bookID=b.bookID
      WHERE ci.cartID = ?`, [cart.cartID]
  );
  const total = items.reduce((sum, i) => sum + i.price*i.quantity, 0);
  const [r] = await pool.query(
    `INSERT INTO Orders
      (userID,total_price,payment_method,payment_status,status)
     VALUES (?,?,?,?,?)`,
    [req.user.userID, total, payment_method, payment_method==='credit_card'?'Paid':'Pending','Confirmed']
  );
  const orderID = r.insertId;
  // move items
  for (let i of items) {
    await pool.query(
      `INSERT INTO Order_items (orderID,bookID,quantity)
        VALUES (?,?,?)`,
      [orderID, i.bookID, i.quantity]
    );
  }
  // clear cart
  await pool.query(`DELETE FROM Cart_items WHERE cartID = ?`, [cart.cartID]);
  res.status(201).json({ orderID });
}

export async function getOrders(req, res) {
  const [rows] = await pool.query(
    `SELECT * FROM Orders WHERE userID = ? ORDER BY created DESC`,
    [req.user.userID]
  );
  res.json(rows);
}

export async function getOrderById(req, res) {
  const [rows] = await pool.query(
    `SELECT oi.bookID, b.book_name, oi.quantity
       FROM Order_items oi
  JOIN Books b ON oi.bookID=b.bookID
      WHERE oi.orderID = ?`,
    [req.params.id]
  );
  res.json(rows);
}
