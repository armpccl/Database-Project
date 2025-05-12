import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes     from './routes/authRoutes.js';
import userRoutes     from './routes/userRoutes.js';
import bookRoutes     from './routes/bookRoutes.js';
import cartRoutes     from './routes/cartRoutes.js';
import orderRoutes    from './routes/orderRoutes.js';
import reviewRoutes   from './routes/reviewRoutes.js';
import questionRoutes from './routes/questionRoutes.js';

import { pool } from './db.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use((req,res,next)=>{ req.pool=pool; next(); });

app.use('/api/auth',      authRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/books',     bookRoutes);
app.use('/api/cart',      cartRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/reviews',   reviewRoutes);
app.use('/api/questions', questionRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log(`Server on port ${PORT}`));
