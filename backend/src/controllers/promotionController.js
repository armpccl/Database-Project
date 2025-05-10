import BookPromotion from '../models/BookPromotion.js';
import CartPromotion from '../models/CartPromotion.js';
import Coupon from '../models/Coupon.js';

// === Book Promotions ===
export const createBookPromotion = async (req, res, next) => {
    try {
        // book_promotionID is likely AUTO_INCREMENT
        const newPromo = await BookPromotion.create(req.body);
        res.status(201).json(newPromo);
    } catch (error) {
        next(error);
    }
};
export const getAllBookPromotions = async (req, res, next) => { /* ... */ };
export const getBookPromotionById = async (req, res, next) => { /* ... */ };
export const updateBookPromotion = async (req, res, next) => { /* ... */ };
export const deleteBookPromotion = async (req, res, next) => { /* ... */ };

// === Cart Promotions ===
export const createCartPromotion = async (req, res, next) => {
    try {
        const newPromo = await CartPromotion.create(req.body);
        res.status(201).json(newPromo);
    } catch (error) {
        next(error);
    }
};
// ... similar CRUD for CartPromotion

// === Coupons ===
export const createCoupon = async (req, res, next) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.status(201).json(newCoupon);
    } catch (error) {
        next(error);
    }
};
// ... similar CRUD for Coupon

// Customer facing: View active promotions (simplified)
export const getActiveBookPromotions = async (req, res, next) => {
    try {
        const promotions = await BookPromotion.findAllActive(); // Model needs this method
        res.json(promotions);
    } catch (error) {
        next(error);
    }
};
export const getActiveCartPromotions = async (req, res, next) => {
    try {
        const promotions = await CartPromotion.findAllActive(); // Model needs this method
        res.json(promotions);
    } catch (error) {
        next(error);
    }
};