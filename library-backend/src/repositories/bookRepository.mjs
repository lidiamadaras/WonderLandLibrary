import pool from '../config/db.mjs';

// Lekérdezés: összes könyv
export const getAllBooks = async () => {
  try {
    const result = await pool.query('SELECT * FROM Book;');
    return result.rows; // Az összes könyv adata
  } catch (error) {
    console.error('Hiba az összes könyv lekérdezése során:', error.message);
    throw error;
  }
};

// Lekérdezés: könyv ID alapján
export const getBookById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM Book WHERE BookID = $1;', [id]);
    return result.rows[0]; // Egy könyv, vagy undefined, ha nincs találat
  } catch (error) {
    console.error('Hiba a könyv lekérdezése során ID alapján:', error.message);
    throw error;
  }
};

// Lekérdezés: könyv név alapján
export const getBookByName = async (name) => {
  try {
    const result = await pool.query('SELECT * FROM Book WHERE BookTitle ILIKE $1;', [`%${name}%`]);
    return result.rows; // Tömb a találatokkal
  } catch (error) {
    console.error('Hiba a könyv lekérdezése során név alapján:', error.message);
    throw error;
  }
};