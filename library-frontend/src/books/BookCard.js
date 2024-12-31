import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/books/BookCard.css';

const BookCard = ({ book, extraInfo, hideButtons, isHomePage }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    const bookId = book.bookid; // Ensure bookid or loanid is present
    console.log('BookId:', bookId);
    if (bookId) {
      // Pass a state parameter indicating it's from "My Loans"
      navigate(`/books/${bookId}`, { state: { hideButtons: hideButtons } });
    } else {
      console.error('No valid bookid found!');
    }
  };


  
  return (
    <div className="book-card" onClick={handleCardClick}>
      <h3>{book.booktitle}</h3>
      <p className="book-author">By {isHomePage ? book.authorname : `${book.authorfirstname} ${book.authorlastname}`}</p>
      <p className="book-publishyear">{book.publishyear}</p>
      {extraInfo && <p className="extra-info">{extraInfo}</p>}
    </div>
  );
};

export default BookCard;
