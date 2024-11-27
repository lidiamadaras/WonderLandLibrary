import express from 'express';
import morgan from 'morgan';
import bookRoutes from './routes/bookRoutes.mjs';
import userRoutes from './routes/userRoutes.mjs';

const app = express();
const port = 5000;

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Register routes
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error.' });
});

// Start server
app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});
