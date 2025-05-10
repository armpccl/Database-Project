import express from 'express';
import {
    createOrder,
    getOrderById,
    getUserOrders,
    getOrderStatus
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All order routes require authentication

router.post('/', createOrder);
router.get('/', getUserOrders); // Get all orders for the logged-in user
router.get('/:id', getOrderById); // Get a specific order by its ID
router.get('/:id/status', getOrderStatus);

export default router;