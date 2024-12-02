import express from 'express';
import { registerUser, registerAdmin, loginUser } from '../controllers/userController.mjs';
import authenticateToken from '../middlewares/authenticateToken.mjs';
import authorizeRole from '../middlewares/authorizeRole.mjs';

const router = express.Router();

// Registration endpoints
router.post('/register', registerUser);
router.post('/register-admin', registerAdmin);

// Login endpoint
router.post('/login', loginUser);

// Protected endpoint (példa)
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

export default router;
