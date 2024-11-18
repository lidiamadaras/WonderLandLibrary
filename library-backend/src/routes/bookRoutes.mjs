import express from 'express';
import {
  getAllBooksController,
  getBookByIdController,
  getBookByNameController,
} from '../controllers/bookController.mjs';

const router = express.Router();

// Összes könyv lekérdezése
router.get('/', getAllBooksController);

// Könyv lekérdezése név alapján
router.get('/search', getBookByNameController);

// Könyv lekérdezése ID alapján
router.get('/:id', getBookByIdController);