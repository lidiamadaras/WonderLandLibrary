import pool from '../config/db.mjs';


export const getAllBooks = async () => {
  try {
    const query = `
      SELECT 
        Book.BookId,
        Book.BookTitle,
        CONCAT(Author.AuthorFirstName, ' ', Author.AuthorLastName) AS AuthorName,
        Publisher.PublisherName,
        Book.ISBN,
        Book.PublishYear,
        Book.Pages,
        Book.Copies,
        Book.AvailableCopies
      FROM Book
      JOIN Author ON Book.AuthorID = Author.AuthorID
      JOIN Publisher ON Book.PublisherID = Publisher.PublisherID;
    `;
    const result = await pool.query(query);
    return result.rows; // All books with author and publisher names
  } catch (error) {
    console.error('Error querying all the books', error.message);
    throw error;
  }
};


export const getBookById = async (id) => {
  try {
    const query = `
      SELECT 
        Book.BookId,
        Book.BookTitle,
        CONCAT(Author.AuthorFirstName, ' ', Author.AuthorLastName) AS AuthorName,
        Publisher.PublisherName,
        Book.ISBN,
        Book.PublishYear,
        Book.Pages,
        Book.Copies,
        Book.AvailableCopies
      FROM Book
      JOIN Author ON Book.AuthorID = Author.AuthorID
      JOIN Publisher ON Book.PublisherID = Publisher.PublisherID
      WHERE Book.BookID = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0]; // A single book with author and publisher names
  } catch (error) {
    console.error('An error occurred during querying by ID', error.message);
    throw error;
  }
};


export const getBookByName = async (name) => {
  try {
    const query = `
      SELECT 
        Book.BookId,
        Book.BookTitle,
        CONCAT(Author.AuthorFirstName, ' ', Author.AuthorLastName) AS AuthorName,
        Publisher.PublisherName,
        Book.ISBN,
        Book.PublishYear,
        Book.Pages,
        Book.Copies,
        Book.AvailableCopies
      FROM Book
      JOIN Author ON Book.AuthorID = Author.AuthorID
      JOIN Publisher ON Book.PublisherID = Publisher.PublisherID
      WHERE Book.BookTitle ILIKE $1;
    `;
    const result = await pool.query(query, [`%${name}%`]);
    return result.rows; // Array of books with author and publisher names
  } catch (error) {
    console.error('An error occurred during querying by name', error.message);
    throw error;
  }
};

export const checkBookAvailability = async (bookId) => {
  try {
    const result = await pool.query('SELECT AvailableCopies FROM Book WHERE BookId = $1', [bookId]);
    if (result.rows.length === 0) {
      return null; 
    }
    return result.rows[0].availablecopies; 
  } catch (error) {
    console.error('Error checking book availability:', error.message);
    throw error;
  }
};


export const decrementAvailableCopies = async (bookId) => {
  try {
    await pool.query('UPDATE Book SET AvailableCopies = AvailableCopies - 1 WHERE BookId = $1', [bookId]);
  } catch (error) {
    console.error('Error decrementing available copies:', error.message);
    throw error;
  }
};

export const incrementAvailableCopies = async (bookId) => {
  try {
    await pool.query('UPDATE Book SET AvailableCopies = AvailableCopies + 1 WHERE BookId = $1', [bookId]);
  } catch (error) {
    console.error('Error incrementing available copies:', error.message);
    throw error;
  }
};

export const setReservationInactive = async (reservationId) => {
  try {
    await pool.query(
      'UPDATE Reservation SET ReservationStatus = $1 WHERE ReservationId = $2',
      ['inactive', reservationId]
    );
  } catch (error) {
    console.error('Error setting reservation to inactive:', error.message);
    throw error;
  }
};


export const createLoanRecord = async (bookId, userId, loanDueDate) => {
  try {
    const result = await pool.query(
      `INSERT INTO Loan (BookId, UserId, LoanDate, LoanDueDate) 
       VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING *`,
      [bookId, userId, loanDueDate]
    );
    return result.rows[0]; 
  } catch (error) {
    console.error('Error creating loan record:', error.message);
    throw error;
  }
};

// Create a reservation record
export const createReservationRecord = async (bookId, userId) => {
  const query = `
    INSERT INTO Reservation (BookId, UserId, ReservationDate, ReservationStatus)
    VALUES ($1, $2, CURRENT_TIMESTAMP, 'active')
    RETURNING *;
  `;
  const values = [bookId, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const handleExpiredReservations = async () => {
  try {
    const result = await pool.query(`
      SELECT ReservationId, BookId
      FROM Reservation
      WHERE ReservationStatus = 'active' 
        AND CURRENT_TIMESTAMP > (ReservationDate + INTERVAL '7 days');
    `);

    for (const reservation of result.rows) {
      // Set the reservation as inactive
      await setReservationInactive(reservation.reservationid);

      // Increment the available copies
      await incrementAvailableCopies(reservation.bookid);
    }

    console.log('Expired reservations processed successfully.');
  } catch (error) {
    console.error('Error handling expired reservations:', error.message);
    throw error;
  }
};

// Searching user's bookshelf
export const findBookshelfByUser = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM Bookshelf_List WHERE UserId = $1`,
    [userId]
  );
  return result.rows[0];
};

// Creating a new bookshelf
export const createBookshelf = async (userId) => {
  try {
    const userResult = await pool.query(
      `SELECT UserFirstName FROM LibraryUser WHERE UserId = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw new Error('User does not exist!');
    }

    const userFirstName = userResult.rows[0].userfirstname;

    // Creating bookshelf
    const bookshelfResult = await pool.query(
      `INSERT INTO Bookshelf_List (UserId, BSListName, BSListDescription)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        userId,
        `Favorites${userId}`, // Dynamic name
        `The bookshelf of ${userFirstName}`, // Dynamic description
      ]
    );

    return bookshelfResult.rows[0];
  } catch (error) {
    console.error('Error creating bookshelf', error.message);
    throw error;
  }
};


export const checkBookOnBookshelf = async (bookshelfListId, bookId) => {
  const result = await pool.query(
    `SELECT 1 FROM Bookshelf WHERE BookshelfListId = $1 AND BookId = $2`,
    [bookshelfListId, bookId]
  );
  return result.rowCount > 0; // Return true if the book is already on the shelf
};

// Adding a book to the bookshelf
export const addBookToBookshelf = async (bookshelfListId, bookId) => {
  const result = await pool.query(
    `INSERT INTO Bookshelf (BookshelfListId, BookId)
     VALUES ($1, $2)
     RETURNING *`,
    [bookshelfListId, bookId]
  );
  return result.rows[0];
};


// Find or create an author
export const findOrCreateAuthor = async (firstName, lastName, country) => {
  const result = await pool.query(
    `SELECT * FROM Author WHERE AuthorFirstName = $1 AND AuthorLastName = $2`,
    [firstName, lastName]
  );

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  const insertResult = await pool.query(
    `INSERT INTO Author (AuthorFirstName, AuthorLastName, AuthorCountry)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [firstName, lastName, country]
  );

  return insertResult.rows[0];
};

// Find or create a publisher
export const findOrCreatePublisher = async (name, address) => {
  const result = await pool.query(
    `SELECT * FROM Publisher WHERE PublisherName = $1`,
    [name]
  );

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  const insertResult = await pool.query(
    `INSERT INTO Publisher (PublisherName, PublisherAddress)
     VALUES ($1, $2)
     RETURNING *`,
    [name, address]
  );

  return insertResult.rows[0];
};

// Find or create a genre
export const findOrCreateGenre = async (name, description) => {
  const result = await pool.query(
    `SELECT * FROM Genre WHERE GenreName = $1`,
    [name]
  );

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  const insertResult = await pool.query(
    `INSERT INTO Genre (GenreName, GenreDescription)
     VALUES ($1, $2)
     RETURNING *`,
    [name, description]
  );

  return insertResult.rows[0];
};

// Link a book with a genre
export const linkBookWithGenre = async (bookId, genreId) => {
  const result = await pool.query(
    `INSERT INTO BookGenre (BookId, GenreId)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`, // Prevent duplicates
    [bookId, genreId]
  );

  return result.rowCount > 0; // Returns true if a new row was inserted
};

// Add a new book
export const addBook = async (bookData) => {
  const { title, authorId, publisherId, genreId, isbn, publishYear, pages, copies } = bookData;

  const result = await pool.query(
    `INSERT INTO Book (BookTitle, AuthorID, PublisherID, ISBN, PublishYear, Pages, Copies, AvailableCopies)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
     RETURNING *`,
    [title, authorId, publisherId, isbn, publishYear, pages, copies]
  );

  return result.rows[0];
};

export const getBooksFromBookshelf = async (userId) => {
  const result = await pool.query(
    `
    SELECT 
      b.BookId, 
      b.BookTitle, 
      b.ISBN, 
      b.PublishYear, 
      b.Pages, 
      b.Copies, 
      b.AvailableCopies
    FROM 
      Bookshelf bs
    INNER JOIN 
      Bookshelf_List bl ON bs.BookshelfListId = bl.BookshelfListId
    INNER JOIN 
      Book b ON bs.BookId = b.BookId
    WHERE 
      bl.UserId = $1
    `,
    [userId]
  );
  return result.rows;
};

export const getLoansByUser = async (userId) => {
  const result = await pool.query(
    `
    SELECT 
        b.BookTitle, 
        b.ISBN, 
        b.PublishYear, 
        b.Pages, 
        l.LoanDate,
        l.LoanDueDate,
        l.ReturnDate
    FROM 
        Loan l
    INNER JOIN 
        Book b ON l.BookId = b.BookId
    WHERE 
        l.UserId = $1
    `,
    [userId]
  );
  return result.rows;
};