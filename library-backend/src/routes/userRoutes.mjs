import express from 'express';
import { registerUser, registerAdmin, loginUser } from '../controllers/userController.mjs';
import { authenticateToken, logout } from '../middlewares/authMiddleware.mjs';
import authorizeRole from '../middlewares/authorizeRole.mjs';
import {
  getUserReservations,
  cancelReservation,
} from '../controllers/userController.mjs';

const router = express.Router();

// Registration endpoints
router.post('/register', registerUser);
router.post('/register-admin', registerAdmin);

// Login endpoint
router.post('/login', loginUser);

// Logout endpoint
router.post('/logout', authenticateToken, logout);

// Protected endpoint (example)
router.get('/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'This is a protected route.',
    user: req.user, // Data provided by authenticationToken
  });
});

// Admin-only endpoint
router.get('/admin-only', authenticateToken, authorizeRole('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

// Get all reservations for the logged-in user
router.get('/reservations', authenticateToken, getUserReservations);

// Cancel a reservation
router.delete('/reservations/:reservationId', authenticateToken, cancelReservation);


export default router;
