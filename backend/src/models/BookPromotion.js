import db from '../config/db.js';

class BookPromotion {
  // Assumes book_promotionID is AUTO_INCREMENT
  static async create(data, connection = db) {
    const {
      name, description, discount_type, discount_value, start_date, end_date,
      min_purchase, max_discount, is_active = true
    } = data;
    const sql = `
      INSERT INTO Book_promotion (name, description, discount_type, discount_value, start_date, end_date,
                                  min_purchase, max_discount, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      name, description, discount_type, discount_value, start_date, end_date,
      min_purchase, max_discount, is_active
    ];
    const [result] = await connection.query(sql, params);
    return { id: result.insertId, ...data, is_active };
  }

  static async findById(book_promotionID, connection = db) {
    const [rows] = await connection.query('SELECT * FROM Book_promotion WHERE book_promotionID = ?', [book_promotionID]);
    return rows[0];
  }

  static async findAll(connection = db) {
    const [rows] = await connection.query('SELECT * FROM Book_promotion ORDER BY start_date DESC');
    return rows;
  }

  static async findAllActive(connection = db) {
    const now = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const sql = `
        SELECT * FROM Book_promotion 
        WHERE is_active = TRUE AND start_date <= ? AND end_date >= ?
        ORDER BY end_date ASC
    `;
    const [rows] = await connection.query(sql, [now, now]);
    return rows;
  }

  static async update(book_promotionID, data, connection = db) {
    const fields = [];
    const params = [];
    const allowedUpdates = [
        'name', 'description', 'discount_type', 'discount_value', 'start_date', 'end_date',
        'min_purchase', 'max_discount', 'is_active'
    ];

    allowedUpdates.forEach(field => {
        if (data[field] !== undefined) {
            fields.push(`${field} = ?`);
            params.push(data[field]);
        }
    });

    if (fields.length === 0) return { affectedRows: 0, message: "No fields to update." };

    const sql = `UPDATE Book_promotion SET ${fields.join(', ')} WHERE book_promotionID = ?`;
    params.push(book_promotionID);
    const [result] = await connection.query(sql, params);
    return result;
  }

  static async deleteById(book_promotionID, connection = db) {
    // Before deleting, consider books that are using this promotion.
    // Might need to set Books.book_promotionID to NULL for affected books.
    // Example: await db.query('UPDATE Books SET book_promotionID = NULL WHERE book_promotionID = ?', [book_promotionID]);
    const [result] = await connection.query('DELETE FROM Book_promotion WHERE book_promotionID = ?', [book_promotionID]);
    return result.affectedRows > 0;
  }
}

export default BookPromotion;