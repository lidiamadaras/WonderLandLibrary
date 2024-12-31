import React, { useEffect, useState, useCallback } from 'react';
import '../../css/Home.css';
import BookList from '../../books/BookList';

const MyReservals = () => {
    const [reservations, setReservations] = useState([]);  // Change extensions to reservations
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);

    // Fetch user reservations
    const fetchUserReservations = useCallback(async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You need to be logged in to view your reservations.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/users/reservations-info', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch reservations');
        }

        const data = await response.json();
        setReservations(data.reservations || []); // Assuming the API returns an array of reservations
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchUserReservations();
    }, [refresh, fetchUserReservations]); // Re-fetch reservations when `refresh` changes

    const handleRefresh = () => {
      setRefresh(!refresh); // Toggle refresh state to re-fetch reservations
    };

    if (loading) return <p>Loading your reservations...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
      <div className="user-reservations-container">
        <h1> My Reservations</h1>
        
        {/* Display Reservations or No Active Reservations Message */}
        {reservations.length > 0 ? (
          <BookList books={reservations} 
          getLoanDueDate={(reservation) => {  // Adjusted to use reservation
            if (reservation.reservationdate) {
              const date = new Date(reservation.reservationdate); // Adjusted to use reservationdate
              return `Reserved at: ${date.toLocaleDateString()}`; // Formats the date as per the user's locale
            }
            return 'No reservation date available';
          }}
          /> // Reuse BookList to display reserved books
        ) : (
          <p>You have no active reservations.</p>
        )}
      </div>
    );
};

export default MyReservals;
