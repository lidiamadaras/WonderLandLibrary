import express from 'express';
import {
  getAllBooksController,
  getBookByIdController,
  getBookByNameController,
  borrowBookController,
} from '../controllers/bookController.mjs';
import {authenticateToken} from '../middlewares/authMiddleware.mjs';
import { reserveBookController, addBookToUserBookshelf } from '../controllers/bookController.mjs';

const router = express.Router();

router.get('/', getAllBooksController);


router.get('/search', getBookByNameController);


router.get('/:id', getBookByIdController);


router.post('/borrow', authenticateToken, borrowBookController);

router.post('/reserve', authenticateToken, reserveBookController);

router.post('/add-to-bookshelf', authenticateToken, addBookToUserBookshelf);

export default router;
