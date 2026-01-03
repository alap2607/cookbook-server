// Type definitions for authentication
export interface LoginRequest {
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  message?: string;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
}

// Admin password from environment variable
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// In-memory session storage
// In production, use Redis or a database for persistent sessions
export const activeSessions = new Set<string>();
