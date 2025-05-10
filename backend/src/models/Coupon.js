import db from '../config/db.js';

class Coupon {
  // Assumes couponID is AUTO_INCREMENT
  static async create(data, connection = db) {
    const {
      code, description, discount_type, discount_value, start_date, end_date,
      min_purchase, max_discount, usage_limit, is_active = true // usage_count defaults to 0 or null
    } = data;

    const sql = `
      INSERT INTO Coupon (code, description, discount_type, discount_value, start_date, end_date,
                          min_purchase, max_discount, usage_limit, usage_count, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `;
    const params = [
      code, description, discount_type, discount_value, start_date, end_date,
      min_purchase, max_discount, usage_limit, is_active
    ];
    try {
      const [result] = await connection.query(sql, params);
      return { id: result.insertId, ...data, is_active, usage_count: 0 };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' && error.message.includes('code')) {
        throw new Error('Coupon code already exists.');
      }
      throw error;
    }
  }

  static async findById(couponID, connection = db) {
    const [rows] = await connection.query('SELECT * FROM Coupon WHERE couponID = ?', [couponID]);
    return rows[0];
  }

  static async findByCode(code, connection = db) {
    const [rows] = await connection.query('SELECT * FROM Coupon WHERE code = ?', [code]);
    return rows[0];
  }

  static async findAll(connection = db) {
    const [rows] = await connection.query('SELECT * FROM Coupon ORDER BY start_date DESC');
    return rows;
  }

  static async findAllActive(connection = db) {
    const now = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const sql = `
        SELECT * FROM Coupon 
        WHERE is_active = TRUE AND start_date <= ? AND end_date >= ? 
        AND (usage_limit IS NULL OR usage_count < usage_limit)
        ORDER BY end_date ASC
    `;
    const [rows] = await connection.query(sql, [now, now]);
    return rows;
  }

  static async update(couponID, data, connection = db) {
    // Build query dynamically based on provided fields in data
    const fields = [];
    const params = [];
    const allowedUpdates = [
        'code', 'description', 'discount_type', 'discount_value', 'start_date', 'end_date',
        'min_purchase', 'max_discount', 'usage_limit', 'usage_count', 'is_active'
    ];

    allowedUpdates.forEach(field => {
        if (data[field] !== undefined) {
            fields.push(`${field} = ?`);
            params.push(data[field]);
        }
    });

    if (fields.length === 0) return { affectedRows: 0, message: "No fields to update." };

    const sql = `UPDATE Coupon SET ${fields.join(', ')} WHERE couponID = ?`;
    params.push(couponID);

    try {
        const [result] = await connection.query(sql, params);
        return result;
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY' && error.message.includes('code')) {
            throw new Error('Coupon code already exists.');
        }
        throw error;
    }
  }

  static async incrementUsage(couponID, connection = db) {
    const sql = 'UPDATE Coupon SET usage_count = usage_count + 1 WHERE couponID = ?';
    const [result] = await connection.query(sql, [couponID]);
    return result;
  }

  static async deleteById(couponID, connection = db) {
    // Consider if carts are using this coupon. Deletion might be restricted.
    const [result] = await connection.query('DELETE FROM Coupon WHERE couponID = ?', [couponID]);
    return result.affectedRows > 0;
  }
}

export default Coupon;