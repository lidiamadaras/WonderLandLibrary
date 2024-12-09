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