import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

// GET /api/users/me - Get current user profile
router.get('/me', userController.getCurrentUser);

// GET /api/users/:id - Get user by ID
router.get('/:id', userController.getUserById);

// PUT /api/users/:id - Update user profile
router.put('/:id', userController.updateUser);

export default router;
