// db.js
const mysql = require('mysql2');

// สร้างการเชื่อมต่อ
const connection = mysql.createConnection({
  host: 'localhost',      // หรือ IP ของ database
  user: 'soravit',           // ชื่อผู้ใช้ MySQL
  password: 'password',           // รหัสผ่าน (ถ้ามี)
  database: 'project' // ชื่อฐานข้อมูล
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
