import express from 'express';
const router = express.Router();
import * as resourceController from '../controllers/resourceController.js';

router.get('/tasks', resourceController.getAllTasks);
router.get('/costs', resourceController.getAllCosts);
router.get('/project-images', resourceController.getAllProjectImages);
router.get('/project-urls', resourceController.getAllProjectURLs);

export default router;
