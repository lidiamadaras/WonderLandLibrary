import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/books/BookDetails.css';

const BookDetails = () => {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch book details using the ID
    fetch(`/api/books/${id}`) // Replace with your actual API endpoint
      .then((response) => {
        if (!response.ok) throw new Error('Error fetching book details');
        return response.json();
      })
      .then((data) => setBook(data.book)) // Update book state with the fetched book details
      .catch((err) => setError(err.message)) // Handle errors
      .finally(() => setLoading(false)); // Stop loading
  }, [id]); // Re-run the effect when the ID changes

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div >
      <h1 className='book-detail-title'>{book.booktitle}</h1>
      <p><strong>Author:</strong> {book.authorname}</p>
      <p><strong>Publish Year:</strong> {book.publishyear}</p>
      <p><strong>Publisher:</strong> {book.publishername}</p>
      <p><strong>ISBN:</strong> {book.isbn}</p>
      <p><strong>Pages:</strong> {book.pages}</p>
      <p><strong>Total Copies:</strong> {book.copies}</p>
      <p><strong>Available Copies:</strong> {book.availablecopies}</p>
      
    </div>
  );
  
};

export default BookDetails;
