import jwt from 'jsonwebtoken';

// Set to store blacklisted tokens
const blacklistedTokens = new Set();

// Logout middleware: adds token to blacklist
export const logout = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  blacklistedTokens.add(token);
  res.status(200).json({ message: 'Logged out successfully' });
};

// Authenticate middleware: checks token validity
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token is missing.' });
  }

  // Check if token is blacklisted
  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ error: 'Token is no longer valid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token data to request
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token.' });
  }
};
