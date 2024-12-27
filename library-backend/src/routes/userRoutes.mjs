import express from 'express';
import { registerUser, registerAdmin, loginUser } from '../controllers/userController.mjs';
import { authenticateToken, logout } from '../middlewares/authMiddleware.mjs';
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

// Get all reservations for the logged-in user
router.get('/reservations', authenticateToken, getUserReservations);

// Cancel a reservation
router.put('/reservations/:reservationId', authenticateToken, cancelReservation);


export default router;
