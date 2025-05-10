import User from '../models/User.js';
import { comparePassword } from '../utils/passwordUtils.js';
import jwt from 'jsonwebtoken';
import db from '../config/db.js'; // For direct ID generation if not AUTO_INCREMENT

// Helper function to generate a unique ID (if not using AUTO_INCREMENT)
// This is a very basic example. For production, use UUID or a more robust method.
async function generateUniqueUserID() {
    // This is a placeholder. In a real system, you'd query the max ID
    // and increment, or use a UUID library. For simplicity, we'll use a large random number.
    // IMPORTANT: This is NOT production-ready for ID generation.
    // Your DB schema should ideally use AUTO_INCREMENT for userID.
    // If not, you need a reliable unique ID generation strategy.
    let isUnique = false;
    let newId;
    while(!isUnique) {
        newId = Math.floor(100000 + Math.random() * 900000); // Example random ID
        const [rows] = await db.query('SELECT userID FROM Users WHERE userID = ?', [newId]);
        if (rows.length === 0) {
            isUnique = true;
        }
    }
    return newId;
}


const generateToken = (id, roleID) => {
  return jwt.sign({ id, roleID }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const {
      username, email, password, fname, lname, phone,
      house_number, building, moo, village, soi, road,
      sub_district, district, province, postal_code
    } = req.body;

    // Basic validation
    if (!username || !email || !password || !fname || !lname || !phone) {
      res.status(400);
      throw new Error('Please add all required fields');
    }

    const userExists = await User.findByEmail(email);
    if (userExists) {
      res.status(400);
      throw new Error('User with this email already exists');
    }
    const usernameExists = await User.findByUsername(username);
    if (usernameExists) {
      res.status(400);
      throw new Error('Username already taken');
    }

    // If userID is not AUTO_INCREMENT, generate one.
    // THIS IS A SIMPLIFIED EXAMPLE. Use AUTO_INCREMENT in your schema.
    const newUserID = await generateUniqueUserID(); // Or remove if userID is auto-increment

    const user = await User.create({
      userID: newUserID, // Provide if not auto-increment
      username, email, password, fname, lname, phone,
      house_number, building, moo, village, soi, road,
      sub_district, district, province, postal_code,
      roleID: 2 // Default to customer
    });

    if (user) {
      res.status(201).json({
        userID: user.id, // or newUserID if you generated it and User.create doesn't return it directly
        username: user.username,
        email: user.email,
        fname: fname, // from req.body as User.create might only return id, username, email
        lname: lname, // from req.body
        token: generateToken(user.id, user.roleID),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    const user = await User.findByEmail(email);

    if (user && (await comparePassword(password, user.password))) {
      res.json({
        userID: user.userID,
        username: user.username,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        roleID: user.roleID,
        token: generateToken(user.userID, user.roleID),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    // req.user is set by the 'protect' middleware
    const user = await User.findById(req.user.userID);
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};