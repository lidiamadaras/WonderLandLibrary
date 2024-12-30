import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/books/BookDetails.css';

const BookDetails = () => {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(''); 
  const [refresh, setRefresh] = useState(false); // State to trigger re-fetch
  const [refresh2, setRefresh2] = useState(false); // State to trigger re-fetch

  const navigate = useNavigate();

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
  }, [id, refresh, refresh2]); // Re-run the effect when the ID changes


  const handleBorrowBook = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You need to be logged in to borrow a book.');
        return;
      }

      // Make API request to borrow the book
      const response = await fetch('/api/books/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error borrowing the book');
      }

      setMessage(data.message); // Success message
      setRefresh((prev) => !prev);
    } catch (error) {
      setMessage(error.message); // Error message
    }
  };


  const handleReserveBook = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You need to be logged in to reserve a book.');
        return;
      }

      // Make API request to reserve the book
      const response = await fetch('/api/books/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error reserving the book');
      }

      setMessage(data.message); // Success message
      //setRefresh((prev) => !prev); // Trigger a re-fetch or refresh
      setRefresh2((prev) => !prev);
    } catch (error) {
      setMessage(error.message); // Error message
    }
  };

  const handleSaveToWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You need to be logged in to save to wishlist.');
        return;
      }

      // Make API request to save the book to wishlist
      const response = await fetch('/api/books/add-to-bookshelf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error saving to wishlist');
      }

      setMessage(data.message); // Success message
    } catch (error) {
      setMessage(error.message); // Error message
    }
  };



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

        {localStorage.getItem('token') && book.availablecopies > 0 && (
        <div className="book-buttons">
          <button  style={{ display: 'block', textAlign: 'left', marginLeft: '0'}} onClick={handleBorrowBook}>Loan</button>
          <button style={{ display: 'block', textAlign: 'left', marginLeft: '0' }} onClick={handleReserveBook}>Reserve</button>
          <button
            style={{ display: 'block', textAlign: 'left', marginLeft: '0' }} onClick={handleSaveToWishlist}>
            Save to Wishlist
          </button>
        </div>
        
      )}

      
    </div>
  );
  
};

export default BookDetails;
