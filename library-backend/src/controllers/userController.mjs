import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail } from '../repositories/userRepository.mjs';
import { getReservationById, getReservationsByUserId, getReservationsByUser, updateLoanDueDate, insertExtension, updateLoanWithExtensionId, checkLoanOwnership, fetchExtendedBooks, fetchRecommendationsForUser} from '../repositories/userRepository.mjs';
import { incrementAvailableCopies, setReservationInactive } from '../repositories/bookRepository.mjs';

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

    res.status(200).json({ message: 'Login successful!', token, userRole: user.userrole });
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

    // Increase available copies
    await incrementAvailableCopies(reservation.bookid);

    // Inactivate reservation
    await setReservationInactive(reservationId);
    res.status(200).json({ message: 'Reservation canceled successfully.' });
  } catch (error) {
    next(error);
  }
};

export const getUserReservationDetails = async (req, res, next) => {
  try {
    const userId = req.user.userId; 
    const reservations = await getReservationsByUser(userId);

    res.status(200).json({ reservations });
  } catch (error) {
    console.error("Error fetching reservations:", error.message);
    next(error); // Pass the error to the error-handling middleware
  }
};

export const extendLoanDueDate = async (req, res, next) => {
  try {
    const { bookId } = req.params; 
    const userId = req.user.userId; 

    
    const loan = await checkLoanOwnership(bookId, userId);
    if (!loan) {
      return res.status(403).json({ error: 'You can only extend your own active loans.' });
    }

    
    const currentDueDate = new Date(loan.loanduedate);
    const newDueDate = new Date(currentDueDate);
    newDueDate.setDate(currentDueDate.getDate() + 14); 

    
    await updateLoanDueDate(loan.loanid, newDueDate);

   
    const extensionId = await insertExtension(loan.loanid, newDueDate);

    
    await updateLoanWithExtensionId(loan.loanid, extensionId);

    res.status(200).json({ message: 'Loan due date extended successfully.', newDueDate });
  } catch (error) {
    console.error('Error extending loan due date:', error.message);
    next(error);
  }
};

export const getExtendedBooks = async (req, res, next) => {
  try {
    const userId = req.user.userId; 

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const extendedBooks = await fetchExtendedBooks(userId);

    res.status(200).json({ extendedBooks });
  } catch (error) {
    console.error('Error fetching extended books:', error.message);
    next(error);
  }
};

export const getRecommendationsForUser = async (req, res, next) => {
  try {
    const userId = req.user.userId; 

    
    const recommendations = await fetchRecommendationsForUser(userId);

    if (recommendations.length === 0) {
      return res.status(200).json({ message: 'No recommendations found for this user.' });
    }

    res.status(200).json({ recommendations });
  } catch (error) {
    console.error('Error fetching recommendations:', error.message);
    next(error);
  }
};