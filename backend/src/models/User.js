import db from '../config/db.js';
import { hashPassword } from '../utils/passwordUtils.js';

// Note: For a real app, consider adding AUTO_INCREMENT to userID in your DB schema.
// If not, you'll need to implement a strategy for generating unique userID values.

class User {
  static async create({
    userID, // If not auto-incrementing, this needs to be provided and unique
    username,
    email,
    password,
    fname,
    lname,
    phone,
    house_number,
    building,
    moo,
    village,
    soi,
    road,
    sub_district,
    district,
    province,
    postal_code,
    roleID = 2, // Default to customer role (e.g., 2 = customer, 1 = admin)
  }) {
    const hashedPassword = await hashPassword(password);
    const sql = `
      INSERT INTO Users (
        userID, username, email, password, fname, lname, phone,
        house_number, building, moo, village, soi, road,
        sub_district, district, province, postal_code, roleID
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    // If userID is AUTO_INCREMENT, remove it from the INSERT statement and params
    const params = [
      userID, username, email, hashedPassword, fname, lname, phone,
      house_number, building, moo, village, soi, road,
      sub_district, district, province, postal_code, roleID
    ];
    try {
      const [result] = await db.query(sql, params);
      // If userID is AUTO_INCREMENT, result.insertId would be the new ID.
      // Otherwise, the provided userID is used.
      return { id: userID || result.insertId, username, email, roleID };
    } catch (error) {
      // Handle specific errors like duplicate username/email
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Username or Email already exists.');
      }
      throw error;
    }
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);
    return rows[0];
  }

  static async findById(userID) {
    const [rows] = await db.query('SELECT userID, username, email, fname, lname, phone, house_number, building, moo, village, soi, road, sub_district, district, province, postal_code, roleID FROM Users WHERE userID = ?', [userID]);
    return rows[0];
  }

  static async updateProfile(userID, { fname, lname, phone, house_number, building, moo, village, soi, road, sub_district, district, province, postal_code }) {
    const fieldsToUpdate = { fname, lname, phone, house_number, building, moo, village, soi, road, sub_district, district, province, postal_code };
    const nonNullUpdates = Object.entries(fieldsToUpdate)
        .filter(([key, value]) => value !== undefined)
        .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});

    if (Object.keys(nonNullUpdates).length === 0) {
        return { message: "No fields to update" };
    }

    const sql = 'UPDATE Users SET ? WHERE userID = ?';
    const [result] = await db.query(sql, [nonNullUpdates, userID]);
    return result;
  }

  static async updatePassword(userID, newPassword) {
    const hashedPassword = await hashPassword(newPassword);
    const sql = 'UPDATE Users SET password = ? WHERE userID = ?';
    const [result] = await db.query(sql, [hashedPassword, userID]);
    return result;
  }

  // Admin functions
  static async getAll() {
    const [rows] = await db.query('SELECT userID, username, email, fname, lname, phone, roleID FROM Users');
    return rows;
  }

  static async deleteById(userID) {
    // Consider what happens to related data (carts, orders) when a user is deleted.
    // You might need to handle this with cascading deletes in the DB or application logic.
    const [result] = await db.query('DELETE FROM Users WHERE userID = ?', [userID]);
    return result.affectedRows > 0;
  }
}

export default User;