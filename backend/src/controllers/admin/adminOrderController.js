import Order from '../../models/Order.js';
import OrderItem from '../../models/OrderItem.js';
import Shipping from '../../models/Shipping.js'; // Assuming Shipping model
import db from '../../config/db.js';

async function generateUniqueTrackingNumber() { /* ... (same as in orderController) ... */ }

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.findAll(); // Order model needs a generic findAll
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

export const getOrderDetailsAdmin = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id); // Order model needs findById
        if (order) {
            const items = await OrderItem.findByOrderId(order.orderID);
            order.items = items;
            if (order.tracking_number) {
                order.shippingInfo = await Shipping.findByTrackingNumber(order.tracking_number);
            }
            res.json(order);
        } else {
            res.status(404);
            throw new Error('Order not found.');
        }
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { id: orderID } = req.params;
        const { status, payment_status, tracking_number, carrier, shipping_status } = req.body;

        const order = await Order.findById(orderID, connection);
        if (!order) {
            res.status(404); throw new Error('Order not found.');
        }

        if (order.status === 'Delivered' && status !== 'Delivered') { // Or any other change
             res.status(400);
             throw new Error("Orders marked as 'Delivered' cannot be modified (except potentially by super-admin actions not defined here).");
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (payment_status) updateData.payment_status = payment_status;

        // Shipping specific updates
        let newTrackingNumber = order.tracking_number; // Existing or new
        if (tracking_number !== undefined) { // Allow clearing tracking_number by passing null/empty string
             if (tracking_number && tracking_number !== order.tracking_number) {
                // If providing a NEW tracking number, ensure it's created in Shipping table or is valid
                let shippingEntry = await Shipping.findByTrackingNumber(tracking_number, connection);
                if (!shippingEntry) {
                    if (!carrier) throw new Error("Carrier is required when creating new tracking information.");
                    await Shipping.create({ tracking_number, shipping_status: shipping_status || 'Processing', carrier }, connection);
                }
                newTrackingNumber = tracking_number;
             } else if (!tracking_number && order.tracking_number) {
                // If clearing tracking number, conceptually you might delete the old shipping entry if it's not shared
                // Or just disassociate it from the order.
                // For simplicity: just update order's tracking_number field.
                newTrackingNumber = null;
             }
        }
        updateData.tracking_number = newTrackingNumber; // This will update the FK in Orders table

        if (Object.keys(updateData).length > 0) {
            await Order.update(orderID, updateData, connection);
        }

        // Update Shipping table if carrier or shipping_status for an existing tracking number is provided
        if (newTrackingNumber && (carrier || shipping_status)) {
             const shippingUpdateData = {};
             if (carrier) shippingUpdateData.carrier = carrier;
             if (shipping_status) shippingUpdateData.shipping_status = shipping_status;

             if (Object.keys(shippingUpdateData).length > 0) {
                await Shipping.update(newTrackingNumber, shippingUpdateData, connection);
             }
        }


        await connection.commit();
        const updatedOrder = await Order.findById(orderID); // Fetch fresh data
        res.json(updatedOrder);

    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        if (connection) connection.release();
    }
};


export const deleteOrder = async (req, res, next) => {
    // Be very careful with this. Deleting orders can have major implications
    // (accounting, stock, user history). Consider "soft delete" or archiving instead.
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { id: orderID } = req.params;

        const order = await Order.findById(orderID, connection);
        if (!order) {
            res.status(404); throw new Error('Order not found.');
        }
        // Potentially add checks like "cannot delete if shipped/delivered" unless it's a special case.

        // If deleting, consider how to handle stock: return items to stock?
        const orderItems = await OrderItem.findByOrderId(orderID, connection);
        for (const item of orderItems) {
            // Example: Return items to stock. Add a parameter to updateStock to indicate direction.
            // await Book.updateStock(item.bookID, -item.quantity, connection); // -quantity to add back
        }

        await OrderItem.deleteByOrderId(orderID, connection); // OrderItem model needs this
        await Order.deleteById(orderID, connection); // Order model needs this

        // What about related Shipping entry if tracking_number was set?
        // If tracking_number is unique to this order, maybe delete from Shipping table too.
        // If (order.tracking_number) { await Shipping.deleteByTrackingNumber(order.tracking_number, connection); }


        await connection.commit();
        res.json({ message: 'Order deleted successfully.' });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        if (connection) connection.release();
    }
};