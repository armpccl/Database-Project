import db from '../config/db.js';

// Assume bookID is AUTO_INCREMENT in the database. If not, it needs to be provided.

class Book {
  static async create({
    // bookID, // If not auto-increment
    book_name, author, description, price, stock = 0, book_type,
    category, page_number, publisher, publication_year,
    edition_no = 1, edition_year, book_promotionID, image
  }) {
    const sql = `
      INSERT INTO Books (
        book_name, author, description, price, stock, book_type,
        category, page_number, publisher, publication_year,
        edition_no, edition_year, book_promotionID, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      book_name, author, description, price, stock, book_type,
      category, page_number, publisher, publication_year,
      edition_no, edition_year, book_promotionID, image // Handle image blob appropriately
    ];
    const [result] = await db.query(sql, params);
    return { id: result.insertId, book_name };
  }

  static async findAll(filters = {}) {
    let sql = `
        SELECT b.*, bp.name as promotion_name, bp.discount_type, bp.discount_value
        FROM Books b
        LEFT JOIN Book_promotion bp ON b.book_promotionID = bp.book_promotionID
    `;
    const whereClauses = [];
    const params = [];

    if (filters.category) {
        whereClauses.push('b.category = ?');
        params.push(filters.category);
    }
    if (filters.author) {
        whereClauses.push('b.author LIKE ?');
        params.push(`%${filters.author}%`);
    }
    if (filters.book_name) {
        whereClauses.push('b.book_name LIKE ?');
        params.push(`%${filters.book_name}%`);
    }
    // Add more filters as needed

    if (whereClauses.length > 0) {
        sql += ' WHERE ' + whereClauses.join(' AND ');
    }

    const [rows] = await db.query(sql, params);
    return rows;
  }

  static async findById(bookID) {
    const sql = `
        SELECT b.*, bp.name as promotion_name, bp.discount_type, bp.discount_value,
               bp.start_date as promotion_start_date, bp.end_date as promotion_end_date, bp.is_active as promotion_is_active
        FROM Books b
        LEFT JOIN Book_promotion bp ON b.book_promotionID = bp.book_promotionID
        WHERE b.bookID = ?
    `;
    const [rows] = await db.query(sql, [bookID]);
    return rows[0];
  }

  static async update(bookID, updateData) {
    // Exclude bookID from updateData if it's part of it
    const { bookID: id, ...dataToUpdate } = updateData;
    if (Object.keys(dataToUpdate).length === 0) {
        return { message: "No fields to update." };
    }
    const sql = 'UPDATE Books SET ? WHERE bookID = ?';
    const [result] = await db.query(sql, [dataToUpdate, bookID]);
    return result;
  }

  static async deleteById(bookID) {
    // Consider implications: reviews, cart items, order items for this book.
    const [result] = await db.query('DELETE FROM Books WHERE bookID = ?', [bookID]);
    return result.affectedRows > 0;
  }

  static async getBookStock(bookID) {
    const [rows] = await db.query('SELECT stock FROM Books WHERE bookID = ?', [bookID]);
    return rows[0] ? rows[0].stock : 0;
  }

  static async updateStock(bookID, quantityChange, connection = db) {
    // quantityChange can be negative (for sale) or positive (for restock/return)
    const sql = 'UPDATE Books SET stock = stock - ? WHERE bookID = ? AND stock >= ?';
    const [result] = await connection.query(sql, [quantityChange, bookID, quantityChange]);
    if (result.affectedRows === 0) {
        throw new Error('Insufficient stock or book not found for stock update.');
    }
    return result;
  }
}

export default Book;