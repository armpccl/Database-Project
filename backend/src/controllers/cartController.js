import Cart from '../models/Cart.js';
import CartItem from '../models/CartItem.js';
import Book from '../models/Book.js';
import Coupon from '../models/Coupon.js'; // Assuming Coupon model
import CartPromotion from '../models/CartPromotion.js'; // Assuming CartPromotion model
import db from '../config/db.js';

// Helper function to calculate total price (simplified)
async function calculateCartTotal(cartID, connection) {
    const [items] = await (connection || db).query(
        `SELECT ci.quantity, b.price, b.book_promotionID, bp.discount_type as book_promo_type, bp.discount_value as book_promo_value,
                bp.start_date as book_promo_start, bp.end_date as book_promo_end, bp.is_active as book_promo_active
         FROM Cart_items ci
         JOIN Books b ON ci.bookID = b.bookID
         LEFT JOIN Book_promotion bp ON b.book_promotionID = bp.book_promotionID
         WHERE ci.cartID = ?`,
        [cartID]
    );

    let subtotal = 0;
    for (const item of items) {
        let itemPrice = parseFloat(item.price);
        // Apply book-specific promotion (simplified)
        if (item.book_promotionID && item.book_promo_active) {
            const now = new Date();
            if (new Date(item.book_promo_start) <= now && new Date(item.book_promo_end) >= now) {
                if (item.book_promo_type === 'percentage') {
                    itemPrice -= itemPrice * (parseFloat(item.book_promo_value) / 100);
                } else if (item.book_promo_type === 'fixed') {
                    itemPrice -= parseFloat(item.book_promo_value);
                }
                itemPrice = Math.max(0, itemPrice); // Ensure price doesn't go negative
            }
        }
        subtotal += item.quantity * itemPrice;
    }

    const [cartDetails] = await (connection || db).query('SELECT coupon, cart_promotionID FROM Cart WHERE cartID = ?', [cartID]);
    let finalTotal = subtotal;

    // Apply cart-wide promotion (if any)
    if (cartDetails[0] && cartDetails[0].cart_promotionID) {
        const promotion = await CartPromotion.findById(cartDetails[0].cart_promotionID, connection);
        if (promotion && promotion.is_active) {
            const now = new Date();
            if (new Date(promotion.start_date) <= now && new Date(promotion.end_date) >= now && (!promotion.min_purchase || subtotal >= parseFloat(promotion.min_purchase))) {
                let discount = 0;
                if (promotion.discount_type === 'percentage') {
                    discount = subtotal * (parseFloat(promotion.discount_value) / 100);
                } else if (promotion.discount_type === 'fixed') {
                    discount = parseFloat(promotion.discount_value);
                }
                if (promotion.max_discount) {
                    discount = Math.min(discount, parseFloat(promotion.max_discount));
                }
                finalTotal -= discount;
            }
        }
    }

    // Apply coupon (if any, and if no cart promotion or coupon can stack)
    // For simplicity, assume only one of coupon or cart_promotion can apply, or make specific rules.
    // Here, coupon is applied after cart promotion potentially. This logic needs refinement.
    if (cartDetails[0] && cartDetails[0].coupon) {
        const coupon = await Coupon.findByCode(cartDetails[0].coupon, connection); // Coupon model needs findByCode
        if (coupon && coupon.is_active) {
            const now = new Date();
             if (new Date(coupon.start_date) <= now && new Date(coupon.end_date) >= now &&
                (!coupon.min_purchase || finalTotal >= parseFloat(coupon.min_purchase)) && // Apply to current total
                (coupon.usage_limit === null || coupon.usage_count < coupon.usage_limit)) {
                let couponDiscount = 0;
                if (coupon.discount_type === 'percentage') {
                    couponDiscount = finalTotal * (parseFloat(coupon.discount_value) / 100);
                } else if (coupon.discount_type === 'fixed') {
                    couponDiscount = parseFloat(coupon.discount_value);
                }
                if (coupon.max_discount) {
                    couponDiscount = Math.min(couponDiscount, parseFloat(coupon.max_discount));
                }
                finalTotal -= couponDiscount;
            }
        }
    }
    finalTotal = Math.max(0, finalTotal); // Ensure total isn't negative

    await (connection || db).query('UPDATE Cart SET total_price = ? WHERE cartID = ?', [finalTotal.toFixed(2), cartID]);
    return parseFloat(finalTotal.toFixed(2));
}


export const getCart = async (req, res, next) => {
  try {
    const userID = req.user.userID;
    let cart = await Cart.findByUserId(userID);

    if (!cart) {
      // If cartID is not auto-increment and needs to be managed
      // const newCartID = await generateUniqueCartID(); // Similar to generateUniqueUserID
      // cart = await Cart.create({ userID, cartID: newCartID });
      cart = await Cart.create({ userID }); // Assuming cartID is auto-increment
    }

    const items = await CartItem.findByCartId(cart.cartID);
    const totalPrice = await calculateCartTotal(cart.cartID); // Recalculate to be sure

    res.json({ ...cart, items, total_price: totalPrice });
  } catch (error) {
    next(error);
  }
};

export const addBookToCart = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const userID = req.user.userID;
    const { bookID, quantity = 1 } = req.body;

    if (!bookID || quantity < 1) {
      res.status(400);
      throw new Error('Book ID and valid quantity are required.');
    }

    const book = await Book.findById(bookID);
    if (!book) {
      res.status(404);
      throw new Error('Book not found.');
    }
    if (book.stock < quantity) {
      res.status(400);
      throw new Error('Not enough stock available.');
    }

    let cart = await Cart.findByUserId(userID, connection);
    if (!cart) {
      cart = await Cart.create({ userID }, connection);
    }

    await CartItem.addOrUpdateItem(cart.cartID, bookID, quantity, connection);
    const totalPrice = await calculateCartTotal(cart.cartID, connection);

    await connection.commit();
    res.json({ message: 'Book added to cart', cartID: cart.cartID, total_price: totalPrice });

  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

export const removeBookFromCart = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const userID = req.user.userID;
    const { bookID } = req.params; // Or from req.body

    const cart = await Cart.findByUserId(userID, connection);
    if (!cart) {
      res.status(404);
      throw new Error('Cart not found.');
    }

    const success = await CartItem.removeItem(cart.cartID, bookID, connection);
    if (!success) {
        res.status(404);
        throw new Error('Item not found in cart or could not be removed.');
    }
    const totalPrice = await calculateCartTotal(cart.cartID, connection);

    await connection.commit();
    res.json({ message: 'Book removed from cart', total_price: totalPrice });

  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

export const updateCartItemQuantity = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const userID = req.user.userID;
    const { bookID } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      // If quantity is less than 1, treat as removal
      return removeBookFromCart(req,res,next); // This needs careful handling of response
    }

    const cart = await Cart.findByUserId(userID, connection);
    if (!cart) {
      res.status(404); throw new Error('Cart not found.');
    }

    const book = await Book.findById(bookID);
    if (!book) {
        res.status(404); throw new Error('Book not found.');
    }
    if (book.stock < quantity) {
        res.status(400); throw new Error('Not enough stock available.');
    }

    await CartItem.updateItemQuantity(cart.cartID, bookID, quantity, connection);
    const totalPrice = await calculateCartTotal(cart.cartID, connection);

    await connection.commit();
    res.json({ message: 'Cart item quantity updated', total_price: totalPrice });

  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

export const applyCouponToCart = async (req, res, next) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const userID = req.user.userID;
        const { couponCode } = req.body;

        const cart = await Cart.findByUserId(userID, connection);
        if (!cart) {
            res.status(404); throw new Error('Cart not found.');
        }

        const coupon = await Coupon.findByCode(couponCode, connection); // Coupon model needs findByCode
        if (!coupon || !coupon.is_active) {
            res.status(400); throw new Error('Invalid or inactive coupon code.');
        }

        const now = new Date();
        if (new Date(coupon.start_date) > now || new Date(coupon.end_date) < now) {
            res.status(400); throw new Error('Coupon is not valid at this time.');
        }
        if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
            res.status(400); throw new Error('Coupon usage limit reached.');
        }

        // Recalculate current cart total *before* applying coupon to check min_purchase
        let currentTotalWithoutCoupon = 0;
        const [items] = await connection.query(
            `SELECT ci.quantity, b.price FROM Cart_items ci JOIN Books b ON ci.bookID = b.bookID WHERE ci.cartID = ?`,
            [cart.cartID]
        );
        items.forEach(item => currentTotalWithoutCoupon += item.quantity * parseFloat(item.price));
        // Note: This simple sum doesn't account for book-specific or cart-specific promotions already applied.
        // A more robust `calculateCartTotal` would be needed here that can exclude coupon effect for this check.


        if (coupon.min_purchase && currentTotalWithoutCoupon < parseFloat(coupon.min_purchase)) {
            res.status(400); throw new Error(`Minimum purchase of ${coupon.min_purchase} required for this coupon.`);
        }

        // Update cart with coupon
        await Cart.applyCoupon(cart.cartID, coupon.code, connection); // Cart model needs an applyCoupon method
                                                                    // This method in Cart model might set cart.coupon = couponCode

        // Recalculate total price with coupon
        const finalTotalPrice = await calculateCartTotal(cart.cartID, connection); // This should now include coupon logic

        await connection.commit();
        res.json({ message: 'Coupon applied successfully.', cartID: cart.cartID, total_price: finalTotalPrice, appliedCoupon: coupon.code });

    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        if (connection) connection.release();
    }
};