import express from 'express';
import { registerUser, registerAdmin } from '../controllers/userController.mjs';

const router = express.Router();

// Regisztráció végpont



router.post('/register', registerUser);

router.post('/register-admin', registerAdmin);

export default router;