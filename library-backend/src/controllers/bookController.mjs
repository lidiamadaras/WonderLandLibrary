import { getAllBooks, getBookById, getBookByName } from '../repositories/bookRepository.mjs';

// GET all books
export const getAllBooksController = async (req, res) => {
  try {
    const books = await getAllBooks();
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ error: 'An error occured during querying' });
  }
};

// Search book by ID
export const getBookByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await getBookById(id);
    if (!book) {
      return res.status(404).json({ error: 'Cannot find book with the given ID' });
    }
    res.status(200).json({ book });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during querying' });
  }
};

// Search book by name
export const getBookByNameController = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'The name field is required!' });
  }

  try {
    const books = await getBookByName(name); // get from database
    if (books.length === 0) {
      return res.status(404).json({ error: 'Cannot find book with the given name' });
    }
    res.status(200).json({ books });
  } catch (error) {
    console.error('An error occurred during querying', error.message);
    res.status(500).json({ error: 'An error occurred during querying' });
  }
};