import React, { useEffect, useState, useCallback } from 'react';
import '../../css/Home.css';
import BookList from '../../books/BookList';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);  // Change reservations to wishlist
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);

    // Fetch user wishlist
    const fetchUserWishlist = useCallback(async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You need to be logged in to view your wishlist.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/books/bookshelf', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch wishlist');
        }

        const data = await response.json();
        setWishlist(data.wishlist || []); // Assuming the API returns an array of wishlist items
        console.log("Wishlist: " + data.wishlist);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchUserWishlist();
    }, [refresh, fetchUserWishlist]); // Re-fetch wishlist when `refresh` changes

    const handleRefresh = () => {
      setRefresh(!refresh); // Toggle refresh state to re-fetch wishlist
    };

    if (loading) return <p>Loading your wishlist...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
      <div className="user-wishlist-container">
        <h1> My Wishlist</h1>
        
        {/* Display Wishlist or No Active Wishlist Message */}
        {wishlist.length > 0 ? (
          <BookList books={wishlist} 
          /> // Reuse BookList to display books in the wishlist
        ) : (
          <p>You have no books in your wishlist.</p>
        )}
      </div>
    );
};

export default Wishlist;
