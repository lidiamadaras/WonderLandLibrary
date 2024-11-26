import React, { useEffect, useState } from 'react';
import '../css/Home.css';

function Home() {
  const [searchQuery, setSearchQuery] = useState(''); // Search bar value
  const [books, setBooks] = useState([]); // Books state
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(false); // Loading state

  // Handle search bar input changes
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value); // Update searchQuery state
  };

  // Fetch all books
  const fetchBooks = () => {
    setLoading(true);
    setError(null); // Clear any previous errors
    fetch('/api/books')
      .then((response) => {
        if (!response.ok) throw new Error('Error fetching books');
        return response.json();
      })
      .then((data) => setBooks(data.books)) // Update books state with all books
      .catch((err) => setError(err.message)) // Set error message
      .finally(() => setLoading(false)); // Stop loading
  };

  // Fetch books by searchQuery
  const fetchBooksByName = (query) => {
    setLoading(true);
    setError(null); // Clear any previous errors
    console.log(`Searching for books with query: "${query}"`);
    fetch(`/api/books/search?name=${query}`)
      .then((response) => {
        if (!response.ok) throw new Error('Error fetching books by name');
        return response.json();
      })
      .then((data) => {
        console.log('Books fetched:', data.books);
        if (data.books.length === 0) {
          setBooks([]); // Clear books state if no results
          setError('No books found with that title.');
        } else {
          setBooks(data.books); // Update books state with search results
        }
      })
      .catch((err) => setError(err.message)) // Set error message
      .finally(() => setLoading(false)); // Stop loading
  };

  // Handle search form submission
  const handleSearch = (event) => {
    event.preventDefault(); // Prevent page reload
    if (searchQuery.trim() === '') {
      fetchBooks(); // Fetch all books if searchQuery is empty
    } else {
      fetchBooksByName(searchQuery); // Fetch books by name
    }
  };

  // Fetch all books on component mount
  useEffect(() => {
    fetchBooks();
  }, []); // Run only once

  // Render the component
  return (
    <div>
      <h1>Browse all books</h1>

      {/* Search form */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a book..."
          value={searchQuery}
          onChange={handleInputChange}
          style={{ padding: '8px', margin: '10px 0' }}
        />
        <button type="submit" style={{ padding: '8px' }}>Search</button>
      </form>

      <h2>Available Books</h2>

      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Loading message */}
      {loading && <p>Loading books...</p>}

      {/* Books list */}
      {!loading && books.length > 0 && (
        <ul>
          {books.map((book) => (
            <li key={book.bookid}>
              <strong>{book.booktitle}</strong> by Author ID {book.authorid}
            </li>
          ))}
        </ul>
      )}

      {/* No books found */}
      {!loading && books.length === 0 && !error && (
        <p>No books available to display.</p>
      )}
    </div>
  );
}

export default Home;
