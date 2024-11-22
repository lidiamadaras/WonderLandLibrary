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