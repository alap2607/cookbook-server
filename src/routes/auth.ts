import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

// POST /api/auth/login - Login with password
router.post('/login', authController.login);

// POST /api/auth/validate - Validate token
router.post('/validate', authController.validateToken);

// POST /api/auth/logout - Logout and invalidate token
router.post('/logout', authController.logout);

export default router;
