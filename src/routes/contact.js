import express from 'express';
const router = express.Router();
import * as contactController from '../controllers/contactController.js';



/**
 * @swagger
 * /contact-us:
 *   post:
 *     summary: Create a new contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: The contact message was successfully created
 *       400:
 *         description: Validation error or missing CAPTCHA
 */
router.post('/', contactController.createContact);

export default router;
