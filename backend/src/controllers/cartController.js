import { pool } from '../db.js';

export async function getCart(req, res) {
  const [rows] = await pool.query(
    `SELECT ci.bookID, b.book_name, b.price, ci.quantity
       FROM Cart_items ci
  JOIN Cart c ON ci.cartID=c.cartID
  JOIN Books b ON ci.bookID=b.bookID
      WHERE c.userID = ?`,
    [req.user.userID]
  );
  res.json(rows);
}

export async function addToCart(req, res) {
  const { bookID, quantity } = req.body;
  // find or create cart
  const [[cart]] = await pool.query(
    `SELECT cartID FROM Cart WHERE userID = ?`, [req.user.userID]
  );
  let cartID;
  if (cart) {
    cartID = cart.cartID;
  } else {
    const [r] = await pool.query(
      `INSERT INTO Cart (userID) VALUES (?)`, [req.user.userID]
    );
    cartID = r.insertId;
  }
  await pool.query(
    `INSERT INTO Cart_items (cartID,bookID,quantity)
      VALUES (?,?,?)
      ON DUPLICATE KEY UPDATE quantity=quantity+?`,
    [cartID, bookID, quantity, quantity]
  );
  res.sendStatus(201);
}

export async function removeFromCart(req, res) {
  const { bookID } = req.params;
  const [[cart]] = await pool.query(
    `SELECT cartID FROM Cart WHERE userID = ?`, [req.user.userID]
  );
  if (!cart) return res.sendStatus(404);
  await pool.query(
    `DELETE FROM Cart_items
      WHERE cartID = ? AND bookID = ?`,
    [cart.cartID, bookID]
  );
  res.sendStatus(204);
}
