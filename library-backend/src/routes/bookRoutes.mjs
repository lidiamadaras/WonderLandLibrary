import express from 'express';
import {
  getAllBooksController,
  getBookByIdController,
  getBookByNameController,
  borrowBookController,
  addBookController
} from '../controllers/bookController.mjs';
import {authenticateToken} from '../middlewares/authMiddleware.mjs';
import { reserveBookController, addBookToUserBookshelf } from '../controllers/bookController.mjs';
import authorizeRole from '../middlewares/authorizeRole.mjs';

const router = express.Router();

router.get('/', getAllBooksController);


router.get('/search', getBookByNameController);


router.get('/:id', getBookByIdController);


router.post('/borrow', authenticateToken, borrowBookController);

router.post('/reserve', authenticateToken, reserveBookController);

router.post('/add-to-bookshelf', authenticateToken, addBookToUserBookshelf);

router.post('/add', authenticateToken, authorizeRole('admin'), addBookController);

export default router;
