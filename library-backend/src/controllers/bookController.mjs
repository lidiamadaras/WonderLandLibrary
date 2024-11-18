import { getAllBooks, getBookById, getBookByName } from '../repositories/bookRepository.mjs';

// Összes könyv lekérdezése
export const getAllBooksController = async (req, res) => {
  try {
    const books = await getAllBooks();
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ error: 'Nem sikerült az összes könyvet lekérdezni.' });
  }
};

// Könyv lekérdezése ID alapján
export const getBookByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await getBookById(id);
    if (!book) {
      return res.status(404).json({ error: 'A megadott ID-val nem található könyv.' });
    }
    res.status(200).json({ book });
  } catch (error) {
    res.status(500).json({ error: 'Nem sikerült a könyvet ID alapján lekérdezni.' });
  }
};

// Könyv lekérdezése név alapján
export const getBookByNameController = async (req, res) => {
  const { name } = req.query;

  try {
    const books = await getBookByName(name);
    if (books.length === 0) {
      return res.status(404).json({ error: 'A megadott névvel nem található könyv.' });
    }
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ error: 'Nem sikerült a könyvet név alapján lekérdezni.' });
  }
};