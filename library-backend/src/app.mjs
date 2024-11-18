import express from 'express';
import morgan from 'morgan';
import bookRoutes from './routes/bookRoutes.mjs';

const app = express();
const port = 3000;

// Middleware-k
app.use(morgan('dev'));
app.use(express.json());

// Útvonalak regisztrálása
app.use('/api', bookRoutes);

// Hibakezelő middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Belső szerver hiba.' });
});

// Szerver indítása
app.listen(port, () => {
  console.log(`Backend fut a http://localhost:${port} címen`);
});