import express from 'express';
import {
  getAllBooksController,
  getBookByIdController,
  getBookByNameController,
} from '../controllers/bookController.mjs';

const router = express.Router();


router.get('/', getAllBooksController);


router.get('/search', getBookByNameController);


router.get('/:id', getBookByIdController);



export default router;