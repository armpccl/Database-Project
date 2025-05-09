import express from 'express';
import {
  addToCart,
  getCart,
  removeFromCart,
  applyCoupon
} from '../controllers/cartController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// เพิ่มหนังสือเข้าตะกร้า
router.post('/', authenticate, addToCart);

// ดึงข้อมูลตะกร้า
router.get('/', authenticate, getCart);

// ลบหนังสือออกจากตะกร้า (ใช้ bookID ใน params)
router.delete('/:bookID', authenticate, removeFromCart);

// ใส่คูปอง
router.post('/coupon', authenticate, applyCoupon);

export default router;
