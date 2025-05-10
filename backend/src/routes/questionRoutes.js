import express from 'express';
import { submitQuestion, getUserQuestions } from '../controllers/questionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', submitQuestion);
router.get('/', getUserQuestions); // Get questions submitted by the logged-in user

export default router;