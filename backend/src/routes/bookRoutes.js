import express from 'express';
import { getAllBooks, getBookById, createBookReview, getBookReviews } from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/:id', getBookById);

// Reviews for a book
router.post('/:bookID/reviews', protect, createBookReview); // Use :bookID to match controller
router.get('/:bookID/reviews', getBookReviews); // Use :bookID to match controller


export default router;