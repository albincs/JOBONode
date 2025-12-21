import express from 'express';
const router = express.Router();

import projectsRouter from './projects.js';
import categoriesRouter from './categories.js';
import teamRouter from './team.js';
import clientRouter from './clients.js';
import testimonialRouter from './testimonials.js';
import cmsRouter from './cms.js';
import serviceRouter from './services.js';
import aboutRouter from './about.js';
import awardRouter from './awards.js';
import contactRouter from './contact.js';
import authRouter from './auth.js';
import emailRouter from './email.js';

import authMiddleware from '../middleware/auth.js';

// Public routes
router.use('/contact-us', contactRouter);
router.use('/auth', authRouter);

// Protected routes (Authenticate all others, except GET)
const conditionalAuth = (req, res, next) => {
  if (req.method === 'GET') {
    return next();
  }
  return authMiddleware(req, res, next);
};

router.use(conditionalAuth);

router.use('/projects', projectsRouter);
router.use('/project-categories', categoriesRouter);
router.use('/team', teamRouter);
router.use('/clients', clientRouter);
router.use('/testimonials', testimonialRouter);
router.use('/cms', cmsRouter);
router.use('/services', serviceRouter);
router.use('/about', aboutRouter);
router.use('/awards', awardRouter);
router.use('/email', emailRouter);

export default router;
