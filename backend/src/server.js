import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Import Middleware
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// Test DB Connection
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('MySQL Connected...');
    connection.release();
  } catch (err) {
    console.error('Error connecting to MySQL:', err.stack);
    process.exit(1); // Exit process with failure
  }
})();

// API Routes
app.get('/', (req, res) => {
  res.send('Bookstore API Running');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/promotions', promotionRoutes); // General promotions or can be split
app.use('/api/reviews', reviewRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/admin', adminRoutes);


// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});