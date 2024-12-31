import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom'; // Add this
import '../css/Home.css';
import BookList from '../books/BookList';

function Home({ filterOption, sortOption }) {
  const [searchQuery, setSearchQuery] = useState(''); // Search bar value
  const [books, setBooks] = useState([]); // Books state
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(false); // Loading state
  const location = useLocation();   //detects navigation changes

  // Handle search bar input changes
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value); // Update searchQuery state
  };
  
  // Fetch all books
  const fetchBooks = () => {
    setLoading(true);
    setError(null); // Clear any previous errors
    console.log('Fetching all books...');
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
    //console.log(`Searching for books with query: "${query}"`);
    fetch(`/api/books/search?name=${query}`)
      .then((response) => {
        if (!response.ok) throw new Error('Could not find book with this name');
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
      .catch((error) => {
        setError(error.message); 
        setBooks([]); // Set books state to empty array on error
      })
      .finally(() => setLoading(false)); // Stop loading
  };

  // Handle search form submission
  const sortBooks = (books, option) => {
    switch (option) {
      case 'reverse':
        return books.sort((a, b) => b.booktitle.localeCompare(a.booktitle));
      case 'pageNumbers':
        return books.sort((a, b) => b.pages - a.pages); // Sort by page count, longest to shortest
      case 'pageNumbersAsc':
        return books.sort((a, b) => a.pages - b.pages);
      default:
        return books.sort((a, b) => a.booktitle.localeCompare(b.booktitle)); // Alphabetical sorting by default
    }
  };
  const filteredBooks = filterOption === 'Available'
  ? books.filter((book) => book.availablecopies > 0)
  : books;

// Sort filtered books
const sortedBooks = sortBooks(filteredBooks, sortOption);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      fetchBooksByName(searchQuery); 
      console.log('searchQuery:', searchQuery);
    } else {
      fetchBooks(); 
      console.log('searchQuery No:', searchQuery);
    }
  }, [searchQuery, location.state]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooksByName(searchQuery);
  };

  // Render the component
  return (
    <div>
      <h1>Browse</h1>

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


      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Loading message */}
      {loading && <p>Loading books...</p>}

      {searchQuery.trim() !== '' && !loading && (
        <BookList books={books} 
        isHomePage={true}
        /> 
      )}
      {!searchQuery.trim() && !loading && sortedBooks.length > 0 && (
        <BookList books={sortedBooks}
        isHomePage={true} /> 
      )}
    </div>
  );
}

export default Home;
