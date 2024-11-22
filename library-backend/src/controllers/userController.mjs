import bcrypt from 'bcrypt';
import { createUser, getUserByEmail } from '../repositories/userRepository.mjs';

// Admin regisztráció
export const registerAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email és jelszó megadása kötelező!' });
    }

    // Ellenőrizzük, hogy az email már létezik-e
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Ez az email cím már regisztrálva van.' });
    }

    // Jelszó hash-elése
    const passwordHash = await bcrypt.hash(password, 10);

    // Új admin létrehozása
    const newAdmin = await createUser(firstName, lastName, email, passwordHash, 'admin');

    res.status(201).json({ message: 'Sikeres admin regisztráció!', user: newAdmin });
  } catch (error) {
    next(error); // Hibakezelés
  }
};

// Meglévő függvény: Felhasználó regisztráció
export const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email és jelszó megadása kötelező!' });
    }

    // Ellenőrizzük, hogy az email már létezik-e
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Ez az email cím már regisztrálva van.' });
    }

    // Jelszó hash-elése
    const passwordHash = await bcrypt.hash(password, 10);

    // Új felhasználó létrehozása
    const newUser = await createUser(firstName, lastName, email, passwordHash);

    res.status(201).json({ message: 'Sikeres regisztráció!', user: newUser });
  } catch (error) {
    next(error); // Hibakezelés
  }
};
