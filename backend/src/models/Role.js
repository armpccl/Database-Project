import db from '../config/db.js';

class Role {
  static async create({ role_name }) {
    // If roleID is not AUTO_INCREMENT, it must be provided: create({ roleID, role_name })
    const sql = 'INSERT INTO Roles (role_name) VALUES (?)';
    try {
      const [result] = await db.query(sql, [role_name]);
      return { id: result.insertId, role_name }; // Use insertId for AUTO_INCREMENT PK
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Role name already exists.');
      }
      throw error;
    }
  }

  static async findById(roleID) {
    const [rows] = await db.query('SELECT * FROM Roles WHERE roleID = ?', [roleID]);
    return rows[0];
  }

  static async findByName(role_name) {
    const [rows] = await db.query('SELECT * FROM Roles WHERE role_name = ?', [role_name]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await db.query('SELECT * FROM Roles');
    return rows;
  }

  static async update(roleID, { role_name }) {
    const sql = 'UPDATE Roles SET role_name = ? WHERE roleID = ?';
    try {
      const [result] = await db.query(sql, [role_name, roleID]);
      return result;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Role name already exists.');
      }
      throw error;
    }
  }

  static async deleteById(roleID) {
    // Consider implications: Users with this role.
    // Might need to prevent deletion if in use or reassign users.
    const sql = 'DELETE FROM Roles WHERE roleID = ?';
    const [result] = await db.query(sql, [roleID]);
    return result.affectedRows > 0;
  }
}

export default Role;