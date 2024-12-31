import React, { useEffect, useState, useCallback } from 'react';
import '../../css/Home.css';
import BookList from '../../books/BookList';

const MyExtensions = () => {
    const [extensions, setExtensions] = useState([]);  // Change loans to extensions
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);

    // Fetch user extensions
    const fetchUserExtensions = useCallback(async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You need to be logged in to view your extensions.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/users/extensions-info', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch extensions');
        }

        const data = await response.json();
        setExtensions(data.extensions || []); // Assuming the API returns an array of extensions
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchUserExtensions();
    }, [refresh, fetchUserExtensions]); // Re-fetch extensions when `refresh` changes

    const handleRefresh = () => {
      setRefresh(!refresh); // Toggle refresh state to re-fetch extensions
    };

    if (loading) return <p>Loading your extensions...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
      <div className="user-extensions-container">
        <h1> My Extensions</h1>
        
        {/* Display Extensions or No Active Extensions Message */}
        {extensions.length > 0 ? (
          <BookList books={extensions} 
          getLoanDueDate={(extension) => {  // Adjusted to use extension
            if (extension.loanduedate) {
              const date = new Date(extension.loanduedate);
              return `Due: ${date.toLocaleDateString()}`; // Formats the date as per the user's locale
            }
            return 'No due date available';
          }}
          /> // Reuse BookList to display extended books
        ) : (
          <p>You have no active extensions.</p>
        )}
      </div>
    );
};

export default MyExtensions;
