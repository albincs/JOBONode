import express from 'express';
const router = express.Router();
import * as categoryController from '../controllers/categoryController.js';



/**
 * @swagger
 * /project-categories:
 *   get:
 *     summary: Retrieve a list of project categories
 *     tags: [Project Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProjectCategory'
 */
router.get('/', categoryController.getAllCategories);

/**
 * @swagger
 * /project-categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Project Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: The category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectCategory'
 *       404:
 *         description: Category not found
 */
router.get('/:id', categoryController.getCategoryById);

export default router;
