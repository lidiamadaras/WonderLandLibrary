import express from 'express';
import {
  getAllBooksController,
  getBookByIdController,
  getBookByNameController
} from '../controllers/bookController.mjs';

const router = express.Router();

// Összes könyv lekérdezése
router.get('/books', getAllBooksController);

// Könyv lekérdezése ID alapján
router.get('/books/:id', getBookByIdController);

// Könyv lekérdezése név alapján
router.get('/books', getBookByNameController);

export default router;