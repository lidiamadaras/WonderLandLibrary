import express from 'express';
import { registerUser, registerAdmin, loginUser } from '../controllers/userController.mjs';

const router = express.Router();

// Registration endpoints
router.post('/register', registerUser);
router.post('/register-admin', registerAdmin);

// Login endpoint
router.post('/login', loginUser);

export default router;