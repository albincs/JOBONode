import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'django-insecure-secret-key-replacement';

export const register = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Check email
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
        return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Map role to Django fields if needed for compatibility
    let is_staff = false;
    let is_superuser = false;
    
    if (role === 'admin') {
        is_staff = true;
        is_superuser = true;
    } else if (role === 'staff') {
        is_staff = true;
    }

    // Create user
    // Note: Django stores password in a specific format (e.g., pbkdf2_sha256$...).
    // If we simply use bcrypt hash string, Django won't be able to read it unless we implement a custom password hasher in Django
    // OR we format it like Django does.
    // For now, we will store standard bcrypt hash.
    // If interoperability is strictly required, we'd need to use 'passlib' or similar in Node or stick to Django's format.
    // Given 'need the same as node api app', we assume this Node app is the primary interface now or parallel.
    
    // NOTE: 'role' is a custom field in our Sequelize model, it might not exist in actual DB schema unless we migrate.
    // We'll proceed assuming we can write to it. Squelize sync might block or error if column missing.
    // We added 'role' to User model.
    
    const newUser = await User.create({
      username,
      password: password_hash, // We store this in 'password' column (varchar 128)
      email,
      role: role || 'user',
      is_staff,
      is_superuser,
      date_joined: new Date(),
      is_active: true
    });

    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

import crypto from 'crypto';

// Helper to verify Django password
const verifyDjangoPassword = (password, storedHash) => {
  const parts = storedHash.split('$');
  if (parts.length !== 4) return false;

  const algorithm = parts[0];
  const iterations = parseInt(parts[1], 10);
  const salt = parts[2];
  const hash = parts[3];

  if (algorithm !== 'pbkdf2_sha256') return false;

  const key = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
  const keyBase64 = key.toString('base64');
  
  return keyBase64 === hash;
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    let isMatch = false;

    if (user.password.startsWith('pbkdf2_sha256$')) {
        isMatch = verifyDjangoPassword(password, user.password);
    } else {
        isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, is_staff: user.is_staff, is_superuser: user.is_superuser }, // payload
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: ['id', 'username', 'email', 'role'] });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
