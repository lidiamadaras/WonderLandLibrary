import React, { useEffect, useState, useCallback } from 'react';
import '../../css/Home.css';
import BookList from '../../books/BookList';

const MyLoans = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);

    // Fetch user loans
    const fetchUserLoans = useCallback(async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You need to be logged in to view your loans.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/users/loans-info', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch loans');
        }

        const data = await response.json();
        setLoans(data.loans || []); // Assuming the API returns an array of loans
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchUserLoans();
    }, [refresh, fetchUserLoans]); // Re-fetch loans when `refresh` changes

    const handleRefresh = () => {
      setRefresh(!refresh); // Toggle refresh state to re-fetch loans
    };

    if (loading) return <p>Loading your loans...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
      <div className="user-loans-container">
        <h1> My Loans</h1>
        
        
        {/* Display Loans or No Active Loans Message */}
        {loans.length > 0 ? (
          <BookList books={loans} 
          getLoanDueDate={(loan) => {
            if (loan.loanduedate) {
              const date = new Date(loan.loanduedate);
              return `Due: ${date.toLocaleDateString()}`; // Formats the date as per the user's locale
            }
            return 'No due date available';
          }}
          /> // Reuse BookList to display loaned books
        ) : (
          <p>You have no active loans.</p>
        )}
      </div>
    );
};

export default MyLoans;
