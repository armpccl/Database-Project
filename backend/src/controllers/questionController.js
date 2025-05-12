import { pool } from '../db.js';

export async function postQuestion(req, res) {
  const { qna_type, description } = req.body;
  await pool.query(
    `INSERT INTO Question (userID,qna_type,description)
     VALUES (?,?,?)`,
    [req.user.userID, qna_type, description]
  );
  res.sendStatus(201);
}

export async function getQuestions(req, res) {
  const [rows] = await pool.query(
    `SELECT * FROM Question WHERE userID = ? ORDER BY time DESC`,
    [req.user.userID]
  );
  res.json(rows);
}
