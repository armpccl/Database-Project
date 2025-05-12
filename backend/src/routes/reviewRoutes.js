import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { addReview, getReviews, deleteReview } from '../controllers/reviewController.js';
const router = express.Router();
router.get('/:bookID', getReviews);
router.use(authenticate);
router.post('/',       addReview);
router.delete('/:bookID', deleteReview);
export default router;
