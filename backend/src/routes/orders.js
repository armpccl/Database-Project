import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// สร้าง Order ใหม่ (จาก Cart)
router.post('/', authenticate, createOrder);

// ดึงรายการ Order ของ user ปัจจุบัน
router.get('/', authenticate, getOrders);

// ดึง Order ตาม ID
router.get('/:id', authenticate, getOrderById);

// อัปเดตสถานะ Order (admin หรือ user แล้วแต่สิทธิ์)
router.put('/:id/status', authenticate, updateOrderStatus);

// ลบ Order (admin)
router.delete('/:id', authenticate, deleteOrder);

export default router;
