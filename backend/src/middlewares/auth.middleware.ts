import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyAccessToken } from '../utils/auth';
import { sendError } from '../utils/response';

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            sendError(res, 'No token provided', 401);
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyAccessToken(token);

        // Attach user info to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error: any) {
        sendError(res, error.message || 'Invalid token', 401);
    }
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        sendError(res, 'Authentication required', 401);
        return;
    }

    if (req.user.role !== 'ADMIN') {
        sendError(res, 'Admin access required', 403);
        return;
    }

    next();
};
