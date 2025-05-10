import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();


// --- Start Debugging ---
console.log('Attempting to connect with the following credentials:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
// Avoid logging DB_PASSWORD in production, but for local debugging you can check if it's loaded:
console.log('DB_PASSWORD exists:', !!process.env.DB_PASSWORD); // true or false
console.log('DB_NAME:', process.env.DB_NAME);
// --- End Debugging ---

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection (optional, server.js already does a basic check)
pool.getConnection()
  .then(connection => {
    console.log('Database connection pool created successfully.');
    connection.release();
  })
  .catch(error => {
    console.error('Error creating database connection pool:', error);
  });

export default pool;