import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail } from '../repositories/userRepository.mjs';
import { getReservationById, getReservationsByUserId, deleteReservation } from '../repositories/userRepository.mjs';

// Admin registration
export const registerAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required!' });
    }
3
    // Check if the email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'This email is already registered.' });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = await createUser(firstName, lastName, email, passwordHash, 'admin');

    res.status(201).json({ message: 'Admin registration successful!', user: newAdmin });
  } catch (error) {
    next(error); // Error handling
  }
};

// User registration
export const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required!' });
    }

    // Check if the email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'This email is already registered.' });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await createUser(firstName, lastName, email, passwordHash);

    res.status(201).json({ message: 'User registration successful!', user: newUser });
  } catch (error) {
    next(error); // Error handling
  }
};

// User login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required!' });
    }

    // Retrieve user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.userpasswordhash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.userid, role: user.userrole },
      process.env.JWT_SECRET
    );

    res.status(200).json({ message: 'Login successful!', token });
  } catch (error) {
    next(error); // Error handling
  }
};


// Get all reservations for a user
export const getUserReservations = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const reservations = await getReservationsByUserId(userId);

    res.status(200).json({ reservations });
  } catch (error) {
    next(error);
  }
};

// Cancel a reservation
export const cancelReservation = async (req, res, next) => {
  try {
    const { reservationId } = req.params;
    const userId = req.user.userId;

    // Check if the reservation belongs to the user
    const reservation = await getReservationById(reservationId);
    if (!reservation || reservation.userid !== userId) {
      return res.status(403).json({ error: 'You can only cancel your own reservations.' });
    }

  
    await deleteReservation(reservationId);
    res.status(200).json({ message: 'Reservation canceled successfully.' });
  } catch (error) {
    next(error);
  }
};