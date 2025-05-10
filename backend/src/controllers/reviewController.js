import Review from '../models/Review.js';
import OrderItem from '../models/OrderItem.js'; // To check if user bought the book

export const createReview = async (req, res, next) => {
    try {
        const { bookID, rating, comment } = req.body;
        const userID = req.user.userID;

        if (!bookID || !rating) {
            res.status(400);
            throw new Error('Book ID and rating are required.');
        }
        if (rating < 1 || rating > 5) {
            res.status(400);
            throw new Error('Rating must be between 1 and 5.');
        }

        const existingReview = await Review.findByUserAndBook(userID, bookID);
        if (existingReview) {
            res.status(400);
            throw new Error('You have already reviewed this book.');
        }

        // Check if user has purchased this book
        const hasPurchased = await OrderItem.checkIfUserPurchasedBook(userID, bookID);

        const reviewData = {
            userID,
            bookID,
            rating,
            comment: comment || null,
            has_buy: hasPurchased
        };

        // If reviewID is not auto-increment in your schema, you'd generate it here.
        // For Reviews, the primary key is (userID, bookID), so no separate reviewID is needed.

        const newReview = await Review.create(reviewData);
        res.status(201).json(newReview); // Review.create should return the created review
    } catch (error) {
        next(error);
    }
};

export const getReviewsByBook = async (req, res, next) => {
    try {
        const { bookID } = req.params;
        const reviews = await Review.findByBookId(bookID);
        res.json(reviews);
    } catch (error) {
        next(error);
    }
};

export const getReviewsByUser = async (req, res, next) => {
    try {
        const userID = req.user.userID; // Or req.params.userID for admin
        const reviews = await Review.findByUserId(userID);
        res.json(reviews);
    } catch (error) {
        next(error);
    }
};

export const updateReview = async (req, res, next) => {
    try {
        const { bookID } = req.params; // Assuming bookID is part of the route
        const userID = req.user.userID;
        const { rating, comment } = req.body;

        const review = await Review.findByUserAndBook(userID, bookID);
        if (!review) {
            res.status(404);
            throw new Error('Review not found.');
        }

        const updateData = {};
        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                res.status(400); throw new Error('Rating must be between 1 and 5.');
            }
            updateData.rating = rating;
        }
        if (comment !== undefined) {
            updateData.comment = comment;
        }
        updateData.last_update = new Date();


        if (Object.keys(updateData).length === 0) {
            return res.json(review); // No changes
        }

        const updatedReview = await Review.update(userID, bookID, updateData);
        res.json(updatedReview);
    } catch (error) {
        next(error);
    }
};

export const deleteReview = async (req, res, next) => {
    // This can be used by a user to delete their own review
    try {
        const { bookID } = req.params; // Assuming bookID is part of the route
        const userID = req.user.userID;

        const success = await Review.deleteByUserAndBook(userID, bookID);
        if (success) {
            res.json({ message: 'Review deleted successfully.' });
        } else {
            res.status(404);
            throw new Error('Review not found or you do not have permission to delete it.');
        }
    } catch (error) {
        next(error);
    }
};