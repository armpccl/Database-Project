import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export async function register(req, res) {
  const { username, email, password, fname, lname, phone } = req.body;
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: 'Phone must be 10 digits' });
  }
  const hashed = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO Users
      (username,email,password,fname,lname,phone,roleID)
     VALUES (?,?,?,?,?,?,2)`,
    [username, email, hashed, fname, lname, phone]
  );
  res.sendStatus(201);
}

export async function login(req, res) {
  const { email, password } = req.body;
  const [[user]] = await pool.query(
    `SELECT userID,username,password,roleID
       FROM Users WHERE email = ?`, [email]
  );
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

  const roleName = user.roleID === 1 ? 'admin' : 'customer';
  const token = jwt.sign(
    { userID: user.userID, username: user.username, role: roleName },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  res.json({ token });
}
