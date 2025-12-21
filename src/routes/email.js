import express from 'express';
import { getInbox, sendEmail } from '../controllers/emailController.js';

const router = express.Router();

router.get('/inbox', getInbox);
router.post('/send', sendEmail);

export default router;
