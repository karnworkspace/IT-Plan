import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

export class AuthController {
    /**
     * Register a new user
     */
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, name } = req.body;

            // Validate input
            if (!email || !password || !name) {
                sendError(res, 'Email, password, and name are required', 400);
                return;
            }

            const user = await authService.register(email, password, name);

            sendSuccess(res, user, 'User registered successfully', 201);
        } catch (error: any) {
            sendError(res, error.message, 400);
        }
    }

    /**
     * Login with email and password
     */
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                sendError(res, 'Email and password are required', 400);
                return;
            }

            const result = await authService.login(email, password);

            sendSuccess(res, result, 'Login successful');
        } catch (error: any) {
            sendError(res, error.message, 401);
        }
    }

    /**
     * Login with PIN
     */
    async loginWithPin(req: Request, res: Response): Promise<void> {
        try {
            const { email, pin } = req.body;

            // Validate input
            if (!email || !pin) {
                sendError(res, 'Email and PIN are required', 400);
                return;
            }

            const result = await authService.loginWithPin(email, pin);

            sendSuccess(res, result, 'Login successful');
        } catch (error: any) {
            sendError(res, error.message, 401);
        }
    }

    /**
     * Setup PIN for user
     */
    async setupPin(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { pin, confirmPin } = req.body;
            const userId = req.user?.id;

            // Validate input
            if (!pin || !confirmPin) {
                sendError(res, 'PIN and confirmation PIN are required', 400);
                return;
            }

            if (!userId) {
                sendError(res, 'User not authenticated', 401);
                return;
            }

            const user = await authService.setupPin(userId, pin, confirmPin);

            sendSuccess(res, user, 'PIN setup successfully');
        } catch (error: any) {
            sendError(res, error.message, 400);
        }
    }

    /**
     * Change PIN
     */
    async changePin(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { currentPin, newPin, confirmNewPin } = req.body;
            const userId = req.user?.id;

            // Validate input
            if (!currentPin || !newPin || !confirmNewPin) {
                sendError(
                    res,
                    'Current PIN, new PIN, and confirmation PIN are required',
                    400
                );
                return;
            }

            if (!userId) {
                sendError(res, 'User not authenticated', 401);
                return;
            }

            const result = await authService.changePin(
                userId,
                currentPin,
                newPin,
                confirmNewPin
            );

            sendSuccess(res, result, 'PIN changed successfully');
        } catch (error: any) {
            sendError(res, error.message, 400);
        }
    }

    /**
     * Reset PIN
     */
    async resetPin(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { password } = req.body;
            const userId = req.user?.id;

            // Validate input
            if (!password) {
                sendError(res, 'Password is required', 400);
                return;
            }

            if (!userId) {
                sendError(res, 'User not authenticated', 401);
                return;
            }

            const result = await authService.resetPin(userId, password);

            sendSuccess(res, result, 'PIN reset successfully');
        } catch (error: any) {
            sendError(res, error.message, 400);
        }
    }

    /**
     * Refresh access token
     */
    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const { refreshToken } = req.body;

            // Validate input
            if (!refreshToken) {
                sendError(res, 'Refresh token is required', 400);
                return;
            }

            const result = await authService.refreshAccessToken(refreshToken);

            sendSuccess(res, result, 'Token refreshed successfully');
        } catch (error: any) {
            sendError(res, error.message, 401);
        }
    }

    /**
     * Logout user
     */
    async logout(req: Request, res: Response): Promise<void> {
        try {
            const { refreshToken } = req.body;

            // Validate input
            if (!refreshToken) {
                sendError(res, 'Refresh token is required', 400);
                return;
            }

            const result = await authService.logout(refreshToken);

            sendSuccess(res, result, 'Logged out successfully');
        } catch (error: any) {
            sendError(res, error.message, 400);
        }
    }

    /**
     * Get current user
     */
    async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;

            if (!userId) {
                sendError(res, 'User not authenticated', 401);
                return;
            }

            const user = await authService.getCurrentUser(userId);

            sendSuccess(res, user);
        } catch (error: any) {
            sendError(res, error.message, 404);
        }
    }
}

export default new AuthController();
