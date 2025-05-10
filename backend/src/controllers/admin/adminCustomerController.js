import User from '../../models/User.js';

export const getAllCustomers = async (req, res, next) => {
    try {
        // Assuming roleID for customers is not the admin roleID
        // Or fetch all and filter, or add a method User.findAllCustomers()
        const users = await User.getAll(); // This gets all users, including admins
                                        // You might want to filter by roleID in the SQL query in User.getAll or here.
        const customers = users.filter(user => user.roleID !== 1); // Example: admin roleID is 1
        res.json(customers);
    } catch (error) {
        next(error);
    }
};

export const getCustomerById = async (req, res, next) => {
    try {
        const customer = await User.findById(req.params.id);
        if (customer && customer.roleID !== 1) { // Ensure it's a customer
            res.json(customer);
        } else {
            res.status(404);
            throw new Error('Customer not found.');
        }
    } catch (error) {
        next(error);
    }
};

export const deleteCustomerAccount = async (req, res, next) => {
    try {
        const customer = await User.findById(req.params.id);
        if (!customer) {
            res.status(404); throw new Error('User not found.');
        }
        if (customer.roleID === 1) { // Prevent deleting an admin via this route
            res.status(403); throw new Error('Cannot delete an admin account through this route.');
        }

        // Add logic for what happens to customer's orders, etc.
        // Cascading delete in DB or manual cleanup.
        // For now, direct deletion.
        const success = await User.deleteById(req.params.id);
        if (success) {
            res.json({ message: 'Customer account deleted successfully.' });
        } else {
            res.status(404); // Or 500 if delete failed for other reasons
            throw new Error('Customer account not found or could not be deleted.');
        }
    } catch (error) {
        next(error);
    }
};