import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController.js';
const router = express.Router();
router.use(authenticate);
router.get('/',           getCart);
router.post('/',          addToCart);
router.delete('/:bookID', removeFromCart);
export default router;
