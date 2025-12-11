import express from 'express';
const router = express.Router();
import * as serviceController from '../controllers/serviceController.js';



/**
 * @swagger
 * /services:
 *   get:
 *     summary: Retrieve a list of services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: A list of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */
router.get('/', serviceController.getAllServices);

/**
 * @swagger
 * /services/{slug}:
 *   get:
 *     summary: Get a service by slug
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The service slug
 *     responses:
 *       200:
 *         description: The service details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 */
router.get('/:slug', serviceController.getServiceBySlug);

export default router;
