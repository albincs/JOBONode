import express from 'express';
const router = express.Router();
import * as testimonialController from '../controllers/testimonialController.js';



/**
 * @swagger
 * /testimonials:
 *   get:
 *     summary: Retrieve a list of approved testimonials
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: A list of testimonials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Testimonial'
 */
router.get('/', testimonialController.getAllTestimonials);

export default router;
