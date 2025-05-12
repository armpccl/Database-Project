import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { createOrder, getOrders, getOrderById } from '../controllers/orderController.js';
const router = express.Router();
router.use(authenticate);
router.post('/',   createOrder);
router.get('/',    getOrders);
router.get('/:id', getOrderById);
export default router;
