import {findBookshelfByUser, createBookshelf, checkBookOnBookshelf, addBookToBookshelf, getAllBooks, getBookById, getBookByName, getBooksFromBookshelf, getLoansByUser } from '../repositories/bookRepository.mjs';
import {
  checkBookAvailability,
  decrementAvailableCopies,
  createLoanRecord,
  createReservationRecord,
  addBook, 
  findOrCreateAuthor, 
  findOrCreatePublisher, 
  findOrCreateGenre,
  linkBookWithGenre
} from '../repositories/bookRepository.mjs';


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

// Borrow book
export const borrowBookController = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.userId; 

    // Check if the book is available
    const availableCopies = await checkBookAvailability(bookId);
    if (availableCopies === null) {
      return res.status(404).json({ error: 'Book not found.' });
    }
    if (availableCopies <= 0) {
      return res.status(400).json({ error: 'No available copies of this book.' });
    }

    // Decrease the count of available copies
    await decrementAvailableCopies(bookId);

    // Calculating DueDate
    const loanDueDate = new Date();
    loanDueDate.setDate(loanDueDate.getDate() + 14);

    // Borrowing process
    const loan = await createLoanRecord(bookId, userId, loanDueDate);

    res.status(201).json({ message: 'Book borrowed successfully!', loan });
  } catch (error) {
    console.error('Error borrowing book:', error.message);
    next(error);
  }
};


// Create a reservation
export const createReservationRecordController = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.userId; 

    const availableCopies = await checkBookAvailability(bookId);
    if (availableCopies === null) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    const reservation = await createReservationRecord(bookId, userId);
    res.status(201).json({ message: 'Reservation created successfully!', reservation });
  } catch (error) {
    next(error);
  }
};


// Reserve book
export const reserveBookController = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.userId; // Identified user

    // Check if the book exists
    const availableCopies = await checkBookAvailability(bookId);
    if (availableCopies === null) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    // Check if there are available copies
    if (availableCopies <= 0) {
      return res.status(400).json({ error: 'No available copies for this book.' });
    }

    // Reservation process
    const reservation = await createReservationRecord(bookId, userId);

    // Decrease available copies
    await decrementAvailableCopies(bookId);

    res.status(201).json({ message: 'Book reserved successfully!', reservation });
  } catch (error) {
    console.error('Error reserving book:', error.message);
    next(error);
  }
};

export const addBookToUserBookshelf = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.userId; // Extracted from the token

    if (!bookId) {
      return res.status(400).json({ error: 'BookId is required!' });
    }

    // Check if the user's bookshelf exists
    let bookshelf = await findBookshelfByUser(userId);
    if (!bookshelf) {
      // Create the bookshelf if it doesn't exist
      bookshelf = await createBookshelf(userId);
    }

    // Check if the book already exists on the bookshelf
    const isBookAlreadyOnShelf = await checkBookOnBookshelf(bookshelf.bookshelflistid, bookId);
    if (isBookAlreadyOnShelf) {
      return res.status(400).json({ error: 'The book already exists on the bookshelf.' });
    }

    // Add the book to the bookshelf
    const addedBook = await addBookToBookshelf(bookshelf.bookshelflistid, bookId);

    res.status(201).json({ message: 'Book successfully added to the bookshelf!', book: addedBook });
  } catch (error) {
    next(error); // Handle other errors
  }
};

export const addBookController = async (req, res, next) => {
  try {
    const newBook = await saveBook(req.body);
    res.status(201).json({ message: 'Book successfully added.', book: newBook });
  } catch (error) {
    next(error);
  }
};

export const getBooksFromUserBookshelf = async (req, res, next) => {
  try {
    const userId = req.user.userId; // Extract userId from the token

    // Fetch books using the helper function
    const books = await fetchBooksForUser(userId);

    res.status(200).json({ books });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

export const getUserLoans = async (req, res, next) => {
  try {
    const userId = req.user.userId; // UserId extracted from the token
    const loans = await getLoansByUser(userId);

    res.status(200).json({ loans });
  } catch (error) {
    console.error("Error fetching loans:", error.message);
    next(error); // Pass the error to the error-handling middleware
  }
};

export const fetchBooksForUser = async (userId) => {
  return await getBooksFromBookshelf(userId);
};

export const saveBook = async ({
  title,
  authorFirstName,
  authorLastName,
  publisherName,
  genres = [],
  isbn,
  publishYear,
  pages,
  copies,
}) => {
  
  const author = await findOrCreateAuthor(authorFirstName, authorLastName);
  const publisher = await findOrCreatePublisher(publisherName);

  
  const newBook = await addBook({
    title,
    authorId: author.authorid,
    publisherId: publisher.publisherid,
    isbn,
    publishYear,
    pages,
    copies,
  });

  
  for (const genre of genres) {
    const genreEntity = await findOrCreateGenre(genre.name, genre.description);
    await linkBookWithGenre(newBook.bookid, genreEntity.genreid);
  }

  return newBook; 
};