import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

// Import Admin Controllers
import * as adminCustomerController from '../controllers/admin/adminCustomerController.js';
import * as adminProductController from '../controllers/admin/adminProductController.js';
import * as adminOrderController from '../controllers/admin/adminOrderController.js';
import * as adminReviewController from '../controllers/admin/adminReviewController.js';
import * as adminShippingController from '../controllers/admin/adminShippingController.js';
import * as adminPromotionController from '../controllers/admin/adminPromotionController.js';
import * as adminServiceController from '../controllers/admin/adminServiceController.js';


const router = express.Router();

// Protect all admin routes & ensure user is an admin
router.use(protect, isAdmin);

// Customer Management
router.get('/customers', adminCustomerController.getAllCustomers);
router.get('/customers/:id', adminCustomerController.getCustomerById);
router.delete('/customers/:id', adminCustomerController.deleteCustomerAccount);

// Product Management
router.get('/products', adminProductController.getAllBooksAdmin); // List all books
router.post('/products', adminProductController.addBook);
router.put('/products/:id', adminProductController.updateBook);
router.delete('/products/:id', adminProductController.deleteBook);

// Order Management
router.get('/orders', adminOrderController.getAllOrders);
router.get('/orders/:id', adminOrderController.getOrderDetailsAdmin);
router.put('/orders/:id/status', adminOrderController.updateOrderStatus); // Update status, payment, tracking
router.delete('/orders/:id', adminOrderController.deleteOrder);

// Reviews and Ratings Management
router.get('/reviews', adminReviewController.getAllReviews);
// Get specific review: /reviews/details?userID=X&bookID=Y (using query params)
router.get('/reviews/details', adminReviewController.getReviewByCompositeKey);
// Delete review: body should contain {userID, bookID}
router.delete('/reviews', adminReviewController.deleteReviewAsAdmin);


// Shipping and Delivery Management
router.get('/shipping', adminShippingController.getAllShippingEntries);
router.get('/shipping/:trackingNumber', adminShippingController.getShippingByTrackingNumber);
// Update shipping status/carrier for a given tracking number
router.put('/shipping/:trackingNumber', adminShippingController.updateShippingDetails);
// Delete a shipping entry (also unlinks from orders)
router.delete('/shipping/:trackingNumber', adminShippingController.deleteShippingEntry);
// Note: Creating a shipping entry is often tied to updating an order (adminOrderController.updateOrderStatus)

// Promotion Management
// Book Promotions
router.post('/promotions/book', adminPromotionController.createBookPromotion);
router.get('/promotions/book', adminPromotionController.getAllBookPromotions);
router.get('/promotions/book/:id', adminPromotionController.getBookPromotionById);
router.put('/promotions/book/:id', adminPromotionController.updateBookPromotion);
router.delete('/promotions/book/:id', adminPromotionController.deleteBookPromotion);
// Cart Promotions
router.post('/promotions/cart', adminPromotionController.createCartPromotion);
router.get('/promotions/cart', adminPromotionController.getAllCartPromotions);
router.get('/promotions/cart/:id', adminPromotionController.getCartPromotionById); // Implement in controller
router.put('/promotions/cart/:id', adminPromotionController.updateCartPromotion); // Implement in controller
router.delete('/promotions/cart/:id', adminPromotionController.deleteCartPromotion); // Implement in controller
// Coupons
router.post('/promotions/coupon', adminPromotionController.createCoupon);
router.get('/promotions/coupon', adminPromotionController.getAllCoupons);
router.get('/promotions/coupon/id/:id', adminPromotionController.getCouponById); // Implement in controller (by PK)
router.get('/promotions/coupon/code/:code', adminPromotionController.getCouponByCode); // Implement in controller (by unique code)
router.put('/promotions/coupon/:id', adminPromotionController.updateCoupon); // Implement in controller
router.delete('/promotions/coupon/:id', adminPromotionController.deleteCoupon); // Implement in controller

// Service Management (Questions)
router.get('/services/questions', adminServiceController.getAllQuestions);
router.get('/services/questions/:id', adminServiceController.getQuestionDetails); // Assumes questionID PK
router.put('/services/questions/:id', adminServiceController.updateQuestion); // Admin responds or changes status

// Admin can also read reviews (covered) and update questions (covered).

export default router;