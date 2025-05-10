import express from 'express';
import { getActiveBookPromotions, getActiveCartPromotions } from '../controllers/promotionController.js';
// No protection needed if these are public viewable promotions

const router = express.Router();

router.get('/books/active', getActiveBookPromotions);
router.get('/cart/active', getActiveCartPromotions);
// Coupons are typically not listed publicly; they are applied.

export default router;