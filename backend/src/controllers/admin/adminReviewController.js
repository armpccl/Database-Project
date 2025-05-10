import Review from '../../models/Review.js';

export const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await Review.findAll(); // Review model needs findAll
        res.json(reviews);
    } catch (error) {
        next(error);
    }
};

// Admin can see specific review (e.g. by userID and bookID from request body or query)
export const getReviewByCompositeKey = async (req, res, next) => {
    try {
        const { userID, bookID } = req.query; // Or req.params if set up in route
        if (!userID || !bookID) {
            res.status(400);
            throw new Error("userID and bookID are required to fetch a specific review.");
        }
        const review = await Review.findByUserAndBook(userID, bookID);
        if (review) {
            res.json(review);
        } else {
            res.status(404);
            throw new Error("Review not found.");
        }
    } catch (error) {
        next(error);
    }
};


export const deleteReviewAsAdmin = async (req, res, next) => {
    try {
        // Admin needs to specify which review to delete, usually by its composite key
        const { userID, bookID } = req.body; // Or from req.params in a route like /admin/reviews/:userID/:bookID
        if (!userID || !bookID) {
            res.status(400);
            throw new Error("userID and bookID are required to delete a review.");
        }

        const success = await Review.deleteByUserAndBook(userID, bookID);
        if (success) {
            res.json({ message: 'Review deleted successfully by admin.' });
        } else {
            res.status(404);
            throw new Error('Review not found or could not be deleted.');
        }
    } catch (error) {
        next(error);
    }
};