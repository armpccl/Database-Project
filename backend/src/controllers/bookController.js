import Book from '../models/Book.js';
import Review from '../models/Review.js'; // Assuming Review model is created

export const getAllBooks = async (req, res, next) => {
  try {
    // Example: Allow filtering by query parameters if needed
    // const { category, author } = req.query;
    // const filters = {};
    // if (category) filters.category = category;
    // if (author) filters.author = author;
    const books = await Book.findAll(req.query); // Pass query params for filtering
    res.json(books);
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      // Fetch reviews for this book
      const reviews = await Review.findByBookId(req.params.id);
      book.reviews = reviews; // Add reviews to the book object
      res.json(book);
    } else {
      res.status(404);
      throw new Error('Book not found');
    }
  } catch (error) {
    next(error);
  }
};

// Review related functions might be better in a dedicated reviewController
// but placed here for "Customers canรีวิว และเห็นรีวิวของหนังสือได้" within book context.

export const createBookReview = async (req, res, next) => {
    try {
        const { bookID } = req.params; // Or req.body.bookID
        const userID = req.user.userID; // From auth middleware
        const { rating, comment } = req.body;

        if (!rating) {
            res.status(400);
            throw new Error('Rating is required.');
        }
        if (rating < 1 || rating > 5) {
            res.status(400);
            throw new Error('Rating must be between 1 and 5.');
        }

        // Optional: Check if user has bought the book (has_buy logic)
        // This would require checking Order_items table for this userID and bookID.
        // For simplicity, we'll assume has_buy is either manually set or determined elsewhere.
        const has_buy = true; // Placeholder for actual logic

        const existingReview = await Review.findByUserAndBook(userID, bookID);
        if (existingReview) {
            res.status(400);
            throw new Error('You have already reviewed this book.');
        }

        const review = await Review.create({
            userID,
            bookID,
            rating,
            comment,
            has_buy // Set this based on actual purchase validation
        });
        res.status(201).json(review);
    } catch (error) {
        next(error);
    }
};

export const getBookReviews = async (req, res, next) => {
    try {
        const { bookID } = req.params; // or bookId from query
        const reviews = await Review.findByBookId(bookID);
        res.json(reviews);
    } catch (error) {
        next(error);
    }
};