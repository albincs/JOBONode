import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';
import roleMiddleware from '../middleware/role.js';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (Admin only)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, staff, user]
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Error
 */
// Only admin should be able to register new staff/admins? 
// Or open registration? "Admin can manage users addition" implies Admin does it.
// So we protect this route.
router.post('/register', authMiddleware, roleMiddleware(['admin']), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User profile
 */
router.get('/me', authMiddleware, authController.getMe);

export default router;
