// Assuming roleID for Admin is 1 (adjust if different in your Roles table)
const ADMIN_ROLE_ID = 1; // Or query it from the Roles table by role_name

const isAdmin = (req, res, next) => {
  if (req.user && req.user.roleID === ADMIN_ROLE_ID) {
    next();
  } else {
    res.status(403); // Forbidden
    throw new Error('Not authorized as an admin');
  }
};

export { isAdmin };