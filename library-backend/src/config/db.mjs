import pkg from 'pg';
import dotenv from 'dotenv';


dotenv.config();


const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

(async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Connection succeeded!');
  } catch (error) {
    console.error('An error occurred during connection:', error.message);
  }
})();

export default pool;
