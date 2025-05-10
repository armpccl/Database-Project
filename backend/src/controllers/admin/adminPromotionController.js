import BookPromotion from '../../models/BookPromotion.js';
import CartPromotion from '../../models/CartPromotion.js';
import Coupon from '../../models/Coupon.js';

// === Book Promotions ===
export const createBookPromotion = async (req, res, next) => {
    try {
        // Validate req.body for required fields: name, discount_type, discount_value, start_date, end_date, is_active
        const { name, discount_type, discount_value, start_date, end_date } = req.body;
        if (!name || !discount_type || discount_value === undefined || !start_date || !end_date) {
            res.status(400);
            throw new Error("Missing required fields for book promotion.");
        }
        const newPromo = await BookPromotion.create(req.body); // Assumes model handles book_promotionID (AUTO_INCREMENT)
        res.status(201).json(newPromo);
    } catch (error) {
        next(error);
    }
};

export const getAllBookPromotions = async (req, res, next) => {
    try {
        const promotions = await BookPromotion.findAll();
        res.json(promotions);
    } catch (error) {
        next(error);
    }
};

export const getBookPromotionById = async (req, res, next) => {
    try {
        const promo = await BookPromotion.findById(req.params.id);
        if (promo) {
            res.json(promo);
        } else {
            res.status(404); throw new Error('Book promotion not found.');
        }
    } catch (error) {
        next(error);
    }
};

export const updateBookPromotion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await BookPromotion.update(id, req.body);
        if (result.affectedRows > 0) {
            const updatedPromo = await BookPromotion.findById(id);
            res.json(updatedPromo);
        } else {
            res.status(404); throw new Error('Book promotion not found or no changes made.');
        }
    } catch (error) {
        next(error);
    }
};

export const deleteBookPromotion = async (req, res, next) => {
    try {
        // Consider what happens to books using this promotion.
        // You might want to nullify book_promotionID in Books table or prevent deletion if in use.
        // For now, direct delete.
        const success = await BookPromotion.deleteById(req.params.id);
        if (success) {
            res.json({ message: 'Book promotion deleted successfully.' });
        } else {
            res.status(404); throw new Error('Book promotion not found.');
        }
    } catch (error) {
        next(error);
    }
};


// === Cart Promotions === (Similar CRUD operations)
export const createCartPromotion = async (req, res, next) => {
    try {
        const newPromo = await CartPromotion.create(req.body);
        res.status(201).json(newPromo);
    } catch (error) { next(error); }
};
export const getAllCartPromotions = async (req, res, next) => {
    try {
        res.json(await CartPromotion.findAll());
    } catch (error) { next(error); }
};
export const getCartPromotionById = async (req, res, next) => { /* ... */ };
export const updateCartPromotion = async (req, res, next) => { /* ... */ };
export const deleteCartPromotion = async (req, res, next) => { /* ... */ };


// === Coupons === (Similar CRUD operations)
export const createCoupon = async (req, res, next) => {
    try {
        // couponID is likely AUTO_INCREMENT, `code` must be unique
        const newCoupon = await Coupon.create(req.body);
        res.status(201).json(newCoupon);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400);
            throw new Error("Coupon code already exists.");
        }
        next(error);
    }
};
export const getAllCoupons = async (req, res, next) => {
    try {
        res.json(await Coupon.findAll());
    } catch (error) { next(error); }
};
export const getCouponById = async (req, res, next) => { /* ... find by couponID (PK) */ };
export const getCouponByCode = async (req, res, next) => { /* ... find by code (UNIQUE) */ };
export const updateCoupon = async (req, res, next) => { /* ... */ };
export const deleteCoupon = async (req, res, next) => { /* ... */ };