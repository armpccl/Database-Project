// backend/src/controllers/bookController.js

import { pool } from '../db.js';

export const getAllBooks = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT b.*, bp.discount_type, bp.discount_value
      FROM Books b
      LEFT JOIN Book_promotion bp ON b.book_promotionID = bp.book_promotionID
      WHERE bp.is_active = 1 OR bp.book_promotionID IS NULL
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

export const getBookById = async (req, res) => {
  try {
    const id = req.params.id;
    const [[book]] = await pool.execute(
      `SELECT * FROM Books WHERE bookID = ?`, [id]
    );
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const [reviews] = await pool.execute(`
      SELECT r.rating, r.comment, r.review_date, c.username
      FROM Reviews r
      JOIN Customers c ON r.customerID = c.customerID
      WHERE r.bookID = ?
    `, [id]);

    res.json({ book, reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch book details' });
  }
};
