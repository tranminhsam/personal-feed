import express from 'express';
import { authController } from '../controllers/authController.js';
import { requireAuth, optionalAuth } from '../utils/auth.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', optionalAuth, authController.me);
router.post('/change-password', requireAuth, authController.changePassword);

export default router;
