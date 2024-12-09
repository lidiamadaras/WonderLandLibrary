import pool from '../config/db.mjs';

export const createUser = async (firstName, lastName, email, passwordHash, role = 'user') => {
  const query = `
    INSERT INTO LibraryUser (UserFirstName, UserLastName, UserEmail, UserPasswordHash, UserRole)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [firstName, lastName, email, passwordHash, role];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getUserByEmail = async (email) => {
  const query = `
    SELECT * FROM LibraryUser WHERE UserEmail = $1;
  `;
  const values = [email];
  const result = await pool.query(query, values);
  return result.rows[0];
};


// Get all reservations for a user
export const getReservationsByUserId = async (userId) => {
  const query = `
    SELECT * FROM Reservation WHERE UserId = $1 AND ReservationStatus = 'active';
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

// Get a specific reservation by ID
export const getReservationById = async (reservationId) => {
  const query = `
    SELECT * FROM Reservation WHERE ReservationId = $1;
  `;
  const result = await pool.query(query, [reservationId]);
  return result.rows[0];
};

// Delete a reservation
export const deleteReservation = async (reservationId) => {
  const query = `
    DELETE FROM Reservation WHERE ReservationId = $1;
  `;
  await pool.query(query, [reservationId]);
};
