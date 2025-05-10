import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from DB, exclude password
      const [rows] = await db.query('SELECT userID, username, email, fname, lname, phone, roleID FROM Users WHERE userID = ?', [decoded.id]);

      if (rows.length > 0) {
        req.user = rows[0];
        next();
      } else {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

export { protect };