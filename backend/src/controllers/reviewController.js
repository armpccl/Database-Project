import { pool } from '../db.js';

export async function addReview(req, res) {
  const { bookID, rating, comment, has_buy } = req.body;
  await pool.query(
    `INSERT INTO Reviews (userID,bookID,rating,comment,has_buy)
     VALUES (?,?,?,?,?)`,
    [req.user.userID, bookID, rating, comment, has_buy]
  );
  res.sendStatus(201);
}

export async function getReviews(req, res) {
  const [rows] = await pool.query(
    `SELECT r.userID, u.username, r.rating, r.comment, r.review_date
       FROM Reviews r
  JOIN Users u ON r.userID=u.userID
      WHERE r.bookID = ?`,
    [req.params.bookID]
  );
  res.json(rows);
}

export async function deleteReview(req, res) {
  await pool.query(
    `DELETE FROM Reviews
      WHERE userID = ? AND bookID = ?`,
    [req.user.userID, req.params.bookID]
  );
  res.sendStatus(204);
}
