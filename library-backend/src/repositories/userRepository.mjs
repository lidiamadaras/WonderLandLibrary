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

export const getReservationsByUser = async (userId) => {
  const result = await pool.query(
    `
    SELECT 
        b.BookTitle, 
        b.ISBN, 
        b.PublishYear, 
        b.Pages, 
        r.ReservationDate,
        r.ReservationStatus
    FROM 
        Reservation r
    INNER JOIN 
        Book b ON r.BookId = b.BookId
    WHERE 
        r.UserId = $1
    `,
    [userId]
  );
  return result.rows;
};


export const checkLoanOwnership = async (bookId, userId) => {
  try {
    const result = await pool.query(
      `
      SELECT LoanId, LoanDueDate
      FROM Loan
      WHERE BookId = $1 AND UserId = $2 AND ReturnDate IS NULL;
      `,
      [bookId, userId]
    );
    return result.rows[0] || null; // Ha nincs találat, visszatér null-lal
  } catch (error) {
    console.error('Error checking loan ownership:', error.message);
    throw error;
  }
};

export const updateLoanDueDate = async (loanId, newDueDate) => {
  try {
    await pool.query(
      `
      UPDATE Loan
      SET LoanDueDate = $1
      WHERE LoanId = $2;
      `,
      [newDueDate, loanId]
    );
  } catch (error) {
    console.error('Error updating loan due date:', error.message);
    throw error;
  }
};

export const insertExtension = async (loanId, newDueDate) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO Extensions (LoanId, NewDueDate)
      VALUES ($1, $2)
      RETURNING ExtensionId;
      `,
      [loanId, newDueDate]
    );
    return result.rows[0].extensionid;
  } catch (error) {
    console.error('Error inserting extension:', error.message);
    throw error;
  }
};

export const updateLoanWithExtensionId = async (loanId, extensionId) => {
  try {
    await pool.query(
      `
      UPDATE Loan
      SET ExtensionId = $1
      WHERE LoanId = $2;
      `,
      [extensionId, loanId]
    );
  } catch (error) {
    console.error('Error updating loan with extension ID:', error.message);
    throw error;
  }
};

export const fetchExtendedBooks = async (userId) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        b.BookTitle,
        b.ISBN,
        b.PublishYear,
        b.Pages,
        l.LoanDate,
        l.LoanDueDate
      FROM Loan l
      INNER JOIN Book b ON l.BookId = b.BookId
      INNER JOIN Extensions e ON l.ExtensionId = e.ExtensionId
      WHERE l.UserId = $1
      ORDER BY e.NewDueDate DESC;
      `,
      [userId]
    );

    return result.rows;
  } catch (error) {
    console.error('Error fetching extended books from database:', error.message);
    throw error;
  }
};