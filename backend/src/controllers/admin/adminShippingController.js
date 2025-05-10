import Shipping from '../../models/Shipping.js';
import Order from '../../models/Order.js'; // To check order status

// This controller manages Shipping entries directly.
// Order status updates related to shipping are often handled via adminOrderController.

export const getAllShippingEntries = async (req, res, next) => {
    try {
        const entries = await Shipping.findAll(); // Shipping model needs findAll
        res.json(entries);
    } catch (error) {
        next(error);
    }
};

export const getShippingByTrackingNumber = async (req, res, next) => {
    try {
        const entry = await Shipping.findByTrackingNumber(req.params.trackingNumber);
        if (entry) {
            res.json(entry);
        } else {
            res.status(404);
            throw new Error('Shipping entry not found.');
        }
    } catch (error) {
        next(error);
    }
};

export const updateShippingDetails = async (req, res, next) => {
    // This is for updating a shipping entry directly.
    // Ensure order status consistency if this is used.
    try {
        const { trackingNumber } = req.params;
        const { shipping_status, carrier } = req.body;

        // Check if any associated order is 'Delivered'
        // This logic might be complex if multiple orders could share a tracking number (unlikely with PK)
        const [orders] = await db.query('SELECT status FROM Orders WHERE tracking_number = ?', [trackingNumber]);
        if (orders.some(order => order.status === 'Delivered')) {
             res.status(400);
             throw new Error("Cannot modify shipping details for orders already marked as 'Delivered'.");
        }

        const updateData = {};
        if (shipping_status) updateData.shipping_status = shipping_status;
        if (carrier) updateData.carrier = carrier;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No fields to update." });
        }

        const result = await Shipping.update(trackingNumber, updateData); // Shipping model needs update
        if (result.affectedRows > 0) {
            const updatedEntry = await Shipping.findByTrackingNumber(trackingNumber);
            res.json(updatedEntry);
        } else {
            res.status(404); // Or 304 if no change
            throw new Error('Shipping entry not found or no changes made.');
        }
    } catch (error) {
        next(error);
    }
};

export const deleteShippingEntry = async (req, res, next) => {
    // Deleting a shipping entry: ensure orders are unlinked first or handled.
    // Typically, you'd update the order's tracking_number to NULL.
    try {
        const { trackingNumber } = req.params;

        // Check if any associated order is 'Delivered'
        const [orders] = await db.query('SELECT orderID, status FROM Orders WHERE tracking_number = ?', [trackingNumber]);
        if (orders.some(order => order.status === 'Delivered')) {
             res.status(400);
             throw new Error("Cannot delete shipping details for orders already marked as 'Delivered'.");
        }

        // Before deleting, nullify tracking_number in associated orders
        await Order.unlinkShipping(trackingNumber); // Order model method to SET tracking_number = NULL WHERE tracking_number = ?

        const success = await Shipping.deleteByTrackingNumber(trackingNumber); // Shipping model needs delete
        if (success) {
            res.json({ message: 'Shipping entry deleted successfully and unlinked from orders.' });
        } else {
            res.status(404);
            throw new Error('Shipping entry not found or could not be deleted.');
        }
    } catch (error) {
        next(error);
    }
};