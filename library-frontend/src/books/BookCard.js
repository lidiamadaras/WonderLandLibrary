import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/books/BookCard.css';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/book/${book.id}`); // Replace with your route
  };

  return (
    <div className="book-card" onClick={handleCardClick}>
      <img src={book.image} alt={book.title} className="book-image" />
      <h3>{book.title}</h3>
      <p className="book-author">By {book.author}</p>
      <p className="book-description">{book.description}</p>
    </div>
  );
};

export default BookCard;
