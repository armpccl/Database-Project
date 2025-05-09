import { pool } from '../db.js';
import bcrypt from 'bcryptjs';

/**
 * GET /api/users/me
 * Returns the profile of the authenticated user.
 */
export const getProfile = async (req, res) => {
  try {
    const customerID = req.user.customerID;
    const [[user]] = await pool.execute(
      `SELECT 
         customerID, username, email, fname, lname, phone,
         house_number, building, moo, village, soi, road,
         sub_district, district, province, postal_code
       FROM Customers
       WHERE customerID = ?`,
      [customerID]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ error: 'Cannot fetch profile' });
  }
};

/**
 * PUT /api/users/me
 * Updates password and/or address fields for the authenticated user.
 */
export const updateProfile = async (req, res) => {
  try {
    const customerID = req.user.customerID;
    const {
      password,
      house_number,
      building,
      moo,
      village,
      soi,
      road,
      sub_district,
      district,
      province,
      postal_code
    } = req.body;

    const fields = [];
    const values = [];

    // Update password if provided
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      fields.push('password = ?');
      values.push(hashed);
    }

    // Map address fields
    const addressMap = {
      house_number,
      building,
      moo,
      village,
      soi,
      road,
      sub_district,
      district,
      province,
      postal_code
    };

    Object.entries(addressMap).forEach(([key, val]) => {
      if (val !== undefined) {
        fields.push(`${key} = ?`);
        values.push(val);
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No data to update' });
    }

    // Build and execute query
    const sql = `UPDATE Customers SET ${fields.join(', ')} WHERE customerID = ?`;
    values.push(customerID);

    await pool.execute(sql, values);
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ error: 'Cannot update profile' });
  }
};
