import express from 'express';
import { createReview, getReviewsByBook, getReviewsByUser, updateReview, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new review (general endpoint, bookID will be in body)
router.post('/', protect, createReview);

// Get reviews for a specific book (also available under /books/:bookID/reviews)
router.get('/book/:bookID', getReviewsByBook);

// Get reviews by the logged-in user
router.get('/my-reviews', protect, getReviewsByUser);

// Update a specific review (user updates their own)
// A review is identified by user and book. Route could be /:bookID or expect bookID in body.
router.put('/:bookID', protect, updateReview); // Assumes bookID in params identifies the review for the user

// Delete a specific review (user deletes their own)
router.delete('/:bookID', protect, deleteReview); // Assumes bookID in params

export default router;