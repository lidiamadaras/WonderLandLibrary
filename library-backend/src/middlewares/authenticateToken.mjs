import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token is missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // A dekódolt adatokat a kéréshez adod
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token.' });
  }
};

export default authenticateToken;
