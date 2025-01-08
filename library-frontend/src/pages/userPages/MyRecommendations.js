import React, { useEffect, useState, useCallback } from 'react';
import '../../css/Home.css';
import BookList from '../../books/BookList';

const MyRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // Fetch user recommendations
  const fetchUserRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to be logged in to view your recommendations.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/users/recommendations', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []); // Assuming the API returns an array of books
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRecommend = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token'); // Assuming the user token is stored in localStorage
      if (!token) {
        setError('You need to be logged in to get recommendations.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/books/recommend-books', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendedBooks(data.recommendations || []); // Assuming API returns recommendations as an array
      setRefresh((prev) => !prev);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
      
    }
  };

  useEffect(() => {
    fetchUserRecommendations();
  }, [refresh, fetchUserRecommendations]); // Re-fetch recommendations when `refresh` changes

  const handleRefresh = () => {
    setRefresh(!refresh); // Toggle refresh state to re-fetch recommendations
  };

  if (loading) return <p>Loading your recommendations...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="user-recommendations-container">
      <h1> My Recommendations</h1>

      
      <button onClick={handleRecommend} className="refresh-button">
          Recommend me!
        </button>

      {/* Display Recommendations or No Recommendations Message */}
      {recommendations.length > 0 ? (
        <BookList
          books={recommendations}
          getRecommendationInfo={(book) => {
            if (book.reason) {
              return `Recommended because: ${book.reason}`; // Display the reason for recommendation
            }
            return 'Recommended for you!';
          }}
        /> // Reuse BookList to display recommended books
      ) : (
        <p>No recommendations available at the moment.</p>
      )}


      
    </div>
  );
};

export default MyRecommendations;
