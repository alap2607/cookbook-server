import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import * as storage from '../utils/fileStorage';
import { PublicUser } from '../models/User';

// In-memory session storage (maps token to user id)
const activeSessions = new Map<string, string>();

// Helper function to generate secure random token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Helper function to remove password from user object
function toPublicUser(user: { password: string } & PublicUser): PublicUser {
  const { password, ...publicUser } = user;
  return publicUser;
}

// POST /api/auth/login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required',
        code: 'VALIDATION_ERROR',
        status: 400,
      });
    }

    // Find user by username (email)
    const user = await storage.findUserByUsername(username);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
        status: 401,
      });
    }

    // Validate password
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
        status: 401,
      });
    }

    // Generate token and store session
    const token = generateToken();
    activeSessions.set(token, user.id);

    return res.json({
      success: true,
      token,
      user: toPublicUser(user),
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/validate
export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        valid: false,
        error: 'Token is required',
        code: 'VALIDATION_ERROR',
        status: 400,
      });
    }

    // Check if token exists in active sessions
    const userId = activeSessions.get(token);

    if (!userId) {
      return res.json({ valid: false });
    }

    // Get user info
    const user = await storage.findUserById(userId);

    if (!user) {
      activeSessions.delete(token);
      return res.json({ valid: false });
    }

    res.json({
      valid: true,
      user: toPublicUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;

    if (token && activeSessions.has(token)) {
      activeSessions.delete(token);
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};
