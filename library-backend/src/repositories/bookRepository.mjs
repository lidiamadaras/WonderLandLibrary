import pool from '../config/db.mjs';


export const getAllBooks = async () => {
  try {
    const query = `
      SELECT 
        Book.BookId,
        Book.BookTitle,
        CONCAT(Author.AuthorFirstName, ' ', Author.AuthorLastName) AS AuthorName,
        Book.PublisherID,
        Book.ISBN,
        Book.PublishYear,
        Book.Pages,
        Book.Copies,
        Book.AvailableCopies
      FROM Book
      JOIN Author ON Book.AuthorID = Author.AuthorID;
    `;
    const result = await pool.query(query);
    return result.rows; // The data of all the books with authors
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
        Book.PublisherID,
        Book.ISBN,
        Book.PublishYear,
        Book.Pages,
        Book.Copies,
        Book.AvailableCopies
      FROM Book
      JOIN Author ON Book.AuthorID = Author.AuthorID
      WHERE Book.BookID = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0]; // A book with the author's name or undefined if not valid
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
        Book.PublisherID,
        Book.ISBN,
        Book.PublishYear,
        Book.Pages,
        Book.Copies,
        Book.AvailableCopies
      FROM Book
      JOIN Author ON Book.AuthorID = Author.AuthorID
      WHERE Book.BookTitle ILIKE $1;
    `;
    const result = await pool.query(query, [`%${name}%`]);
    return result.rows; // An array with the results including authors' names
  } catch (error) {
    console.error('An error occurred during querying by name', error.message);
    throw error;
  }
};