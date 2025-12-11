import express from 'express';
const router = express.Router();
import * as aboutController from '../controllers/aboutController.js';



/**
 * @swagger
 * /about:
 *   get:
 *     summary: Retrieve 'About Us' information
 *     tags: [About Us]
 *     responses:
 *       200:
 *         description: A list of About Us entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AboutUs'
 */
router.get('/', aboutController.getAllAboutUs);

/**
 * @swagger
 * /about/{slug}:
 *   get:
 *     summary: Get an 'About Us' entry by slug
 *     tags: [About Us]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The slug
 *     responses:
 *       200:
 *         description: The About Us entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AboutUs'
 *       404:
 *         description: Entry not found
 */
router.get('/:slug', aboutController.getAboutUsBySlug);

export default router;
