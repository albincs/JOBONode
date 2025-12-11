import express from 'express';
const router = express.Router();
import * as projectController from '../controllers/projectController.js';



/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Retrieve a list of projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: A list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
router.get('/', projectController.getAllProjects);

/**
 * @swagger
 * /projects/{slug}:
 *   get:
 *     summary: Get a project by slug
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The project slug
 *     responses:
 *       200:
 *         description: The project description by slug
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */
router.get('/:slug', projectController.getProjectBySlug);
// To handle both ID and Slug safely like Django's split paths, we can define specific patterns or order them.
// Django had:
// projects/<int:pk>/
// projects/<slug:slug>/
// In Express:
router.get('/id/:id', projectController.getProjectById); // Explicit ID route to be safe

// Or use regex to differentiate if mixed in root param
// router.get('/:id(\\d+)', projectController.getProjectById);
// router.get('/:slug', projectController.getProjectBySlug);

export default router;
