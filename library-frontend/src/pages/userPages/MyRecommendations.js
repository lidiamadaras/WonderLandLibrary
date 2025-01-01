import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom'; // Add this
import '../../css/Home.css';

function MyRecommendations({ filterOption, sortOption }) {
  const [searchQuery, setSearchQuery] = useState(''); // Search bar value
  const [books, setBooks] = useState([]); // Books state
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(false); // Loading state
  const location = useLocation();   //detects navigation changes

  // Handle search bar input changes
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value); // Update searchQuery state
  };
  useEffect(() => {
    
  }, [searchQuery, location.state]);


  // Render the component
  return (
    <div>
      <h1>My Recommendations</h1>

      
    </div>
  );
}

export default MyRecommendations;
