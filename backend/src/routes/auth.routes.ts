import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authLimiter, authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login with email and password
 * @access  Public
 */
router.post('/login', authLimiter, authController.login);

/**
 * @route   POST /api/v1/auth/login-pin
 * @desc    Login with PIN
 * @access  Public
 */
router.post('/login-pin', authLimiter, authController.loginWithPin);

/**
 * @route   POST /api/v1/auth/setup-pin
 * @desc    Setup PIN for user
 * @access  Private
 */
router.post('/setup-pin', authenticate, authController.setupPin);

/**
 * @route   POST /api/v1/auth/change-pin
 * @desc    Change PIN
 * @access  Private
 */
router.post('/change-pin', authenticate, authController.changePin);

/**
 * @route   POST /api/v1/auth/reset-pin
 * @desc    Reset PIN (requires password)
 * @access  Private
 */
router.post('/reset-pin', authenticate, authController.resetPin);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', authLimiter, authController.forgotPassword);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', authLimiter, authController.resetPassword);

/**
 * @route   POST /api/v1/auth/forgot-pin
 * @desc    Request PIN reset
 * @access  Public
 */
router.post('/forgot-pin', authLimiter, authController.forgotPin);

/**
 * @route   POST /api/v1/auth/reset-pin-token
 * @desc    Reset PIN with token
 * @access  Public
 */
router.post('/reset-pin-token', authLimiter, authController.resetPinWithToken);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post('/logout', authController.logout);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
