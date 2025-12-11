import express from 'express';
const router = express.Router();
import * as cmsController from '../controllers/cmsController.js';



/**
 * @swagger
 * /cms:
 *   get:
 *     summary: Retrieve a list of CMS tables
 *     tags: [CMS]
 *     responses:
 *       200:
 *         description: A list of CMS tables
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CmsTable'
 */
router.get('/', cmsController.getAllCmsTables);

/**
 * @swagger
 * /cms/{slug}:
 *   get:
 *     summary: Get a CMS table by slug
 *     tags: [CMS]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The CMS table slug
 *     responses:
 *       200:
 *         description: The CMS table details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CmsTable'
 *       404:
 *         description: CMS Table not found
 */
router.get('/:slug', cmsController.getCmsTableBySlug);

export default router;
