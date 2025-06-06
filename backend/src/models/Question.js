import db from '../config/db.js';

class Question {
  // PK is (userID, time). `time` defaults to CURRENT_TIMESTAMP.
  static async create({ userID, qna_type, description }, connection = db) {
    const sql = `
      INSERT INTO Question (userID, time, qna_type, description)
      VALUES (?, CURRENT_TIMESTAMP, ?, ?)
    `;
    // If admin response and status are part of the table, add them here or in an update method.
    // e.g., ALTER TABLE Question ADD COLUMN admin_response TEXT, ADD COLUMN status VARCHAR(50) DEFAULT 'Open', ADD COLUMN last_admin_update DATETIME;
    const params = [userID, qna_type, description];
    try {
      const [result] = await connection.query(sql, params);
      // Since `time` is auto-generated, we can't easily return the composite PK without another query.
      // Return the input and a general success, or query by userID and description if needed (less reliable).
      // For now, return a simple object. The controller might re-fetch if exact time is needed.
      return { userID, qna_type, description, message: "Question created. Time generated by DB." };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // This implies the user submitted a question at the exact same second.
        throw new Error('Duplicate question submission at the same time.');
      }
      throw error;
    }
  }

  static async findByUserId(userID, connection = db) {
    const [rows] = await connection.query('SELECT * FROM Question WHERE userID = ? ORDER BY time DESC', [userID]);
    return rows;
  }

  // If you add a simple `questionID AUTO_INCREMENT PRIMARY KEY` to the Question table,
  // finding by ID becomes simpler.
  // For now, using composite key if precise retrieval is needed.
  static async findByPrimaryKey(userID, time, connection = db) {
    const [rows] = await connection.query('SELECT * FROM Question WHERE userID = ? AND time = ?', [userID, time]);
    return rows[0];
  }
  
  // Let's assume for admin purposes, we add a questionID INT AUTO_INCREMENT PRIMARY KEY to Question table
  // If so, this method would be used:
  // static async findById(questionID, connection = db) {
  //   const [rows] = await connection.query('SELECT * FROM Question WHERE questionID = ?', [questionID]);
  //   return rows[0];
  // }


  static async findAll(connection = db) { // For admin
    const [rows] = await connection.query('SELECT q.*, u.username FROM Question q JOIN Users u ON q.userID = u.userID ORDER BY time DESC');
    return rows;
  }

  // If Question table has `questionID` as PK and fields for admin response:
  static async update(questionID, { admin_response, status, qna_type, description }, connection = db) {
    // This method assumes 'questionID' is the PK.
    // If using composite (userID, time), the update signature and query change.
    const fields = [];
    const params = [];
    if (admin_response !== undefined) { fields.push('admin_response = ?'); params.push(admin_response); }
    if (status !== undefined) { fields.push('status = ?'); params.push(status); }
    if (qna_type !== undefined) { fields.push('qna_type = ?'); params.push(qna_type); }
    if (description !== undefined) { fields.push('description = ?'); params.push(description); }


    if (params.length === 0) return { affectedRows: 0, message: "No fields to update" };

    fields.push('last_admin_update = CURRENT_TIMESTAMP'); // Assuming 'last_admin_update' field exists
    
    const sql = `UPDATE Question SET ${fields.join(', ')} WHERE questionID = ?`; // Change WHERE if using composite PK
    params.push(questionID);
    const [result] = await connection.query(sql, params);
    return result;
  }

  // static async deleteByPrimaryKey(userID, time, connection = db) {
  //   const [result] = await connection.query('DELETE FROM Question WHERE userID = ? AND time = ?', [userID, time]);
  //   return result.affectedRows > 0;
  // }
}

export default Question;