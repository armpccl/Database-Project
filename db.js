// db.js
const mysql = require('mysql2');
import dotenv from 'dotenv';
dotenv.config();

// สร้างการเชื่อมต่อ
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
// เชื่อมต่อ
connection.connect((err) => {
  if (err) {
    console.error('เชื่อมต่อไม่ได้:', err.stack);
    return;
  }
  console.log('เชื่อมต่อสำเร็จ ID:', connection.threadId);
});

module.exports = connection;
