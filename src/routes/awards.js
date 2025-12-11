import express from 'express';
const router = express.Router();
import * as awardController from '../controllers/awardController.js';


import upload from '../middleware/upload.js';

/**
 * @swagger
 * /awards:
 *   get:
 *     summary: Retrieve a list of awards
 *     tags: [Awards]
 *     responses:
 *       200:
 *         description: A list of awards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Award'
 *   post:
 *     summary: Create a new award
 *     tags: [Awards]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: The award was successfully created
 */
router.get('/', awardController.getAllAwards);
router.post('/', upload.single('image'), awardController.createAward);

export default router;
