import React, { useState, useEffect } from 'react';
import BookCard from './BookCard'; // Child component
import '../css/books/BookList.css'; // Styles

const BookList = ({ books, getLoanDueDate, isHomePage  }) => {

  console.log('Books in BookList:', books);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 6;

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  console.log('Current books:', currentBooks);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(books.length / booksPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <div className="book-grid">
        {currentBooks.map((book) => (
          <BookCard key={book.bookid} book={book} 
          extraInfo={getLoanDueDate ? getLoanDueDate(book) : null} 
          hideButtons={isHomePage ? false : true}
          isHomePage={isHomePage}
          />
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(books.length / booksPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookList;
