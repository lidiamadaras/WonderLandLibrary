// src/pages/Home.js
import React, {useEffect, useState} from 'react';
import '../css/Home.css';


function Home() {
  // search bar's value
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]); // Könyvek állapota
  const [error, setError] = useState(null); // Hibák állapota
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value); // Save input to `searchQuery`
  };

  const handleSearch = (event) => {
    event.preventDefault();
    // This is where you would call the API with `searchQuery` as a parameter
    console.log("Searching for:", searchQuery); // For now, just log the search
  };


  useEffect(() => {
    // Adatok lekérése az API-ról
    fetch('/api/books')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Nem sikerült a könyveket lekérni');
        }
        return response.json();
      })
      .then((data) => setBooks(data.books)) // Könyvek állapotának frissítése
      .catch((err) => setError(err.message)); // Hiba állapotának frissítése
  }, []); // Csak egyszer fut le, amikor a komponens betöltődik





  return (
    <div>
      <h1>Browse all books</h1>
    
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
      {/* Hibaüzenet megjelenítése, ha van /}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/ Könyvek listájának megjelenítése */}
      {books.length > 0 ? (
        <ul>
          {books.map((book) => (
            <li key={book.bookid}>
              <strong>{book.booktitle}</strong> by Author ID {book.authorid}
            </li>
          ))}
        </ul>
      ) : (
        !error && <p>Loading books...</p> // Betöltési üzenet, ha nincs hiba
      )}
    </div>
  );
}

export default Home;
