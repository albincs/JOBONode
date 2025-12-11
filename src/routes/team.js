import express from 'express';
const router = express.Router();
import * as teamController from '../controllers/teamController.js';



/**
 * @swagger
 * /team:
 *   get:
 *     summary: Retrieve a list of team members
 *     tags: [Team]
 *     responses:
 *       200:
 *         description: A list of team members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Team'
 */
router.get('/', teamController.getAllTeamMembers);

/**
 * @swagger
 * /team/{id}:
 *   get:
 *     summary: Get a team member by ID
 *     tags: [Team]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The team member ID
 *     responses:
 *       200:
 *         description: The team member description
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       404:
 *         description: Team member not found
 */
router.get('/:id', teamController.getTeamMemberById);

export default router;
