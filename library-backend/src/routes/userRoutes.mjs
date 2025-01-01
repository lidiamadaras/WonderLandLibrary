import express from 'express';
import { registerUser, registerAdmin, loginUser, getUserReservationDetails, extendLoanDueDate, getExtendedBooks, getRecommendationsForUser } from '../controllers/userController.mjs';
import { authenticateToken, logout } from '../middlewares/authMiddleware.mjs';
import {
  getUserReservations,
  cancelReservation,
} from '../controllers/userController.mjs';
import { getUserLoans } from '../controllers/bookController.mjs';
getUserLoans

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

router.get('/reservations-info', authenticateToken, getUserReservationDetails);

router.get('/loans-info', authenticateToken, getUserLoans);

router.get('/extensions-info', authenticateToken, getExtendedBooks);

router.get('/recommendations', authenticateToken, getRecommendationsForUser);

// Cancel a reservation
router.put('/reservations/:reservationId', authenticateToken, cancelReservation);

// Extend loan duration
router.put('/extend-loan/:bookId', authenticateToken, extendLoanDueDate);


export default router;
