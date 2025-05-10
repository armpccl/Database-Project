import express from 'express';
import {
    getCart,
    addBookToCart,
    removeBookFromCart,
    updateCartItemQuantity,
    applyCouponToCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All cart routes require authentication

router.get('/', getCart);
router.post('/items', addBookToCart); // Add item
router.delete('/items/:bookID', removeBookFromCart); // Remove item
router.put('/items/:bookID', updateCartItemQuantity); // Update quantity
router.post('/apply-coupon', applyCouponToCart);

export default router;