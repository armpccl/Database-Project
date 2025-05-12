import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getProfile, updateProfile } from '../controllers/userController.js';
const router = express.Router();
router.use(authenticate);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
export default router;
