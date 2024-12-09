import express from 'express';
import {
  getAllBooksController,
  getBookByIdController,
  getBookByNameController,
  borrowBookController,
} from '../controllers/bookController.mjs';
import {authenticateToken} from '../middlewares/authMiddleware.mjs';
import { reserveBookController } from '../controllers/bookController.mjs';

const router = express.Router();

// Összes könyv lekérdezése
router.get('/', getAllBooksController);

// Könyv keresése cím alapján
router.get('/search', getBookByNameController);

// Könyv keresése ID alapján
router.get('/:id', getBookByIdController);

// Könyv kölcsönzése
router.post('/borrow', authenticateToken, borrowBookController);

router.post('/reserve', authenticateToken, reserveBookController);

export default router;
