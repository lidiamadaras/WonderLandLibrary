import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/books/BookCard.css';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log('Book:', book);
    navigate(`/books/${book.bookid}`); // Replace with your route
  };


  return (
    <div className="book-card" onClick={handleCardClick}>
      <h3>{book.booktitle}</h3>
      <p className="book-author">By {book.authorname}</p>
      <p className="book-publishyear">{book.publishyear}</p>
    </div>
  );
};

export default BookCard;
