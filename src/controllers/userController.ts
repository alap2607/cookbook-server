import { Request, Response, NextFunction } from 'express';
import * as storage from '../utils/fileStorage';

// Get current user profile
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await storage.readUsers();
    // For now, return the first user as the current user
    const currentUser = users[0];

    if (!currentUser) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404,
      });
    }

    res.json(currentUser);
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await storage.findUserById(id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404,
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await storage.updateUser(id, updates);

    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404,
      });
    }

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};
