import express from 'express';
import { getAllBooks, getBookById, getCategories } from '../controllers/bookController.js';
const router = express.Router();
router.get('/',           getAllBooks);
router.get('/:id',        getBookById);
router.get('/categories', getCategories);
export default router;
S