import jwt from 'jsonwebtoken';

// Secret key for JWT (should be in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'django-insecure-secret-key-replacement'; 

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

export default authMiddleware;
