import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { postQuestion, getQuestions } from '../controllers/questionController.js';
const router = express.Router();
router.use(authenticate);
router.post('/', postQuestion);
router.get('/',  getQuestions);
export default router;
