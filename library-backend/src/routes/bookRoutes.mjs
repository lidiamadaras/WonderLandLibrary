import express from 'express';
import {
  getAllBooksController,
  getBookByIdController,
  getBookByNameController,
  borrowBookController,
  addBookController
} from '../controllers/bookController.mjs';
import {authenticateToken} from '../middlewares/authMiddleware.mjs';
import { reserveBookController, addBookToUserBookshelf, getBooksFromUserBookshelf } from '../controllers/bookController.mjs';
import authorizeRole from '../middlewares/authorizeRole.mjs';
import { recommendBooks } from '../controllers/ai_controller.mjs';

const router = express.Router();

router.get('/', getAllBooksController);

router.get('/search', getBookByNameController);

router.get('/bookshelf', authenticateToken, getBooksFromUserBookshelf);

router.get('/:id', getBookByIdController);

router.post('/borrow', authenticateToken, borrowBookController);

router.post('/reserve', authenticateToken, reserveBookController);

router.post('/add-to-bookshelf', authenticateToken, addBookToUserBookshelf);

router.post('/add', authenticateToken, authorizeRole('admin'), addBookController);

router.post('/recommend-books', authenticateToken, recommendBooks);

export default router;
