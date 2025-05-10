import db from '../config/db.js';

class Review {
  // PK is (userID, bookID)
  static async create({ userID, bookID, rating, comment, has_buy }, connection = db) {
    const sql = `
      INSERT INTO Reviews (userID, bookID, rating, comment, review_date, last_update, has_buy)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)
    `;
    const params = [userID, bookID, rating, comment, has_buy];
    try {
      const [result] = await connection.query(sql, params);
      // For composite PK, insertId is not relevant in the same way.
      // Return the input data or fetch the created record if needed.
      return { userID, bookID, rating, comment, review_date: new Date(), last_update: new Date(), has_buy };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('User has already reviewed this book.');
      }
      throw error;
    }
  }

  static async findByUserAndBook(userID, bookID, connection = db) {
    const [rows] = await connection.query('SELECT * FROM Reviews WHERE userID = ? AND bookID = ?', [userID, bookID]);
    return rows[0];
  }

  static async findByBookId(bookID, connection = db) {
    const sql = `
      SELECT r.*, u.username 
      FROM Reviews r
      JOIN Users u ON r.userID = u.userID
      WHERE r.bookID = ? 
      ORDER BY r.review_date DESC
    `;
    const [rows] = await connection.query(sql, [bookID]);
    return rows;
  }

  static async findByUserId(userID, connection = db) {
    const sql = `
      SELECT r.*, b.book_name
      FROM Reviews r
      JOIN Books b ON r.bookID = b.bookID
      WHERE r.userID = ? 
      ORDER BY r.review_date DESC
    `;
    const [rows] = await connection.query(sql, [userID]);
    return rows;
  }

  static async findAll(connection = db) { // For admin
    const sql = `
      SELECT r.*, u.username, b.book_name 
      FROM Reviews r
      JOIN Users u ON r.userID = u.userID
      JOIN Books b ON r.bookID = b.bookID
      ORDER BY r.review_date DESC
    `;
    const [rows] = await connection.query(sql);
    return rows;
  }

  static async update(userID, bookID, { rating, comment }, connection = db) {
    const fieldsToUpdate = [];
    const params = [];
    if (rating !== undefined) {
        fieldsToUpdate.push('rating = ?');
        params.push(rating);
    }
    if (comment !== undefined) {
        fieldsToUpdate.push('comment = ?');
        params.push(comment);
    }

    if (fieldsToUpdate.length === 0) {
        return { affectedRows: 0, message: "No fields to update." };
    }

    fieldsToUpdate.push('last_update = CURRENT_TIMESTAMP');
    const sql = `UPDATE Reviews SET ${fieldsToUpdate.join(', ')} WHERE userID = ? AND bookID = ?`;
    params.push(userID, bookID);

    const [result] = await connection.query(sql, params);
    if (result.affectedRows > 0) {
        return this.findByUserAndBook(userID, bookID, connection);
    }
    return result;
  }

  static async deleteByUserAndBook(userID, bookID, connection = db) {
    const sql = 'DELETE FROM Reviews WHERE userID = ? AND bookID = ?';
    const [result] = await connection.query(sql, [userID, bookID]);
    return result.affectedRows > 0;
  }
}

export default Review;