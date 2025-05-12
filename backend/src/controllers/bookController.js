import { pool } from '../db.js';

export async function getAllBooks(req, res) {
  const [rows] = await pool.query(
    `SELECT b.bookID,b.book_name,b.author,b.price,b.stock,
            b.category, bp.name AS promotion
       FROM Books b
  LEFT JOIN Book_promotion bp ON b.book_promotionID=bp.book_promotionID`
  );
  res.json(rows);
}

export async function getBookById(req, res) {
  const [rows] = await pool.query(
    `SELECT * FROM Books WHERE bookID = ?`, [req.params.id]
  );
  res.json(rows[0]);
}

export async function getCategories(req, res) {
  const [rows] = await pool.query(
    `SELECT DISTINCT category FROM Books`
  );
  res.json(rows.map(r => r.category));
}
