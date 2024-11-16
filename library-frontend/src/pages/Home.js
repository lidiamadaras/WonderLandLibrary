// src/pages/Home.js
import React, {useState} from 'react';
import '../css/Home.css';


function Home() {
  // search bar's value
  const [searchQuery, setSearchQuery] = useState('');
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value); // Save input to `searchQuery`
  };

  const handleSearch = (event) => {
    event.preventDefault();
    // This is where you would call the API with `searchQuery` as a parameter
    console.log("Searching for:", searchQuery); // For now, just log the search
  };


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

    </div>
  );
}

export default Home;
