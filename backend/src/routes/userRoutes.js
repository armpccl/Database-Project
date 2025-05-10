import express from 'express';
import { updateUserProfile, updateUserPassword, submitQuestion } from '../controllers/userController.js';
// submitQuestion might be better in questionRoutes if it's more complex
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateUserProfile);
router.put('/profile/password', protect, updateUserPassword);
// router.post('/questions', protect, submitQuestion); // Moved to questionRoutes

export default router;