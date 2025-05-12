import { pool } from '../db.js';
import bcrypt from 'bcrypt';

export async function getProfile(req, res) {
  const [rows] = await pool.query(
    `SELECT username,email,fname,lname,phone,
            house_number,building,moo,village,soi,
            road,sub_district,district,province,postal_code
       FROM Users WHERE userID = ?`,
    [req.user.userID]
  );
  res.json(rows[0]);
}

export async function updateProfile(req, res) {
  const {
    password, house_number, building, moo, village, soi,
    road, sub_district, district, province, postal_code
  } = req.body;
  const fields = [];
  const vals = [];

  if (password) {
    const hash = await bcrypt.hash(password, 10);
    fields.push('password=?'); vals.push(hash);
  }
  for (let [key, val] of Object.entries({house_number,building,moo,village,soi,road,sub_district,district,province,postal_code})) {
    if (val !== undefined) {
      fields.push(`${key}=?`);
      vals.push(val);
    }
  }
  if (fields.length === 0) return res.sendStatus(204);
  vals.push(req.user.userID);
  await pool.query(
    `UPDATE Users SET ${fields.join(',')} WHERE userID = ?`,
    vals
  );
  res.sendStatus(204);
}
