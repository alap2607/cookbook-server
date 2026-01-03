import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { ADMIN_PASSWORD, activeSessions } from '../models/Auth';

// Helper function to generate secure random token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Helper function to validate password
function validatePassword(inputPassword: string, correctPassword: string): boolean {
  return inputPassword === correctPassword;
}

// POST /api/auth/login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password is required',
        code: 'VALIDATION_ERROR',
        status: 400,
      });
    }

    // Validate password against admin password
    if (validatePassword(password, ADMIN_PASSWORD)) {
      const token = generateToken();
      activeSessions.add(token);

      return res.json({
        success: true,
        token,
        message: 'Login successful',
      });
    }

    // Invalid password - return 401 Unauthorized
    return res.status(401).json({
      success: false,
      error: 'Invalid password',
      code: 'INVALID_CREDENTIALS',
      status: 401,
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
    const isValid = activeSessions.has(token);
    res.json({ valid: isValid });
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
