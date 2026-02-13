import crypto from 'crypto';
import prisma from '../config/database';
import { config } from '../config';
import {
    hashPassword,
    comparePassword,
    hashPin,
    comparePin,
    validatePin,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../utils/auth';

// Token expiry time (1 hour)
const RESET_TOKEN_EXPIRY = 60 * 60 * 1000;

export class AuthService {
    /**
     * Register a new user
     */
    async register(email: string, password: string, name: string) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }

        // Validate password
        if (!password || password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        // Validate name
        if (!name || name.trim().length === 0) {
            throw new Error('Name is required');
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        return user;
    }

    /**
     * Login with email and password
     */
    async login(email: string, password: string) {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            const remainingTime = Math.ceil(
                (user.lockedUntil.getTime() - Date.now()) / 1000 / 60
            );
            throw new Error(
                `Account is locked. Please try again in ${remainingTime} minutes`
            );
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            // Increment login attempts
            const loginAttempts = user.loginAttempts + 1;
            const updateData: any = { loginAttempts };

            // Lock account if max attempts reached
            if (loginAttempts >= config.security.maxLoginAttempts) {
                updateData.lockedUntil = new Date(
                    Date.now() + config.security.accountLockoutDuration
                );
            }

            await prisma.user.update({
                where: { id: user.id },
                data: updateData,
            });

            throw new Error('Invalid email or password');
        }

        // Reset login attempts and update last login
        await prisma.user.update({
            where: { id: user.id },
            data: {
                loginAttempts: 0,
                lockedUntil: null,
                lastLoginAt: new Date(),
            },
        });

        // Generate tokens
        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        const refreshToken = generateRefreshToken({ id: user.id });

        // Store refresh token
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                pinSetAt: user.pinSetAt,
            },
            accessToken,
            refreshToken,
        };
    }

    /**
     * Login with PIN
     */
    async loginWithPin(email: string, pin: string) {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error('Invalid email or PIN');
        }

        // Check if PIN is set
        if (!user.pinHash) {
            throw new Error('PIN is not set for this account');
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            const remainingTime = Math.ceil(
                (user.lockedUntil.getTime() - Date.now()) / 1000 / 60
            );
            throw new Error(
                `Account is locked. Please try again in ${remainingTime} minutes`
            );
        }

        // Verify PIN
        const isPinValid = await comparePin(pin, user.pinHash);

        if (!isPinValid) {
            // Increment login attempts
            const loginAttempts = user.loginAttempts + 1;
            const updateData: any = { loginAttempts };

            // Lock account if max attempts reached
            if (loginAttempts >= config.security.maxLoginAttempts) {
                updateData.lockedUntil = new Date(
                    Date.now() + config.security.accountLockoutDuration
                );
            }

            await prisma.user.update({
                where: { id: user.id },
                data: updateData,
            });

            throw new Error('Invalid email or PIN');
        }

        // Reset login attempts and update last login
        await prisma.user.update({
            where: { id: user.id },
            data: {
                loginAttempts: 0,
                lockedUntil: null,
                lastLoginAt: new Date(),
            },
        });

        // Generate tokens
        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        const refreshToken = generateRefreshToken({ id: user.id });

        // Store refresh token
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                pinSetAt: user.pinSetAt,
            },
            accessToken,
            refreshToken,
        };
    }

    /**
     * Setup PIN for user
     */
    async setupPin(userId: string, pin: string, confirmPin: string) {
        // Validate PIN match
        if (pin !== confirmPin) {
            throw new Error('PINs do not match');
        }

        // Validate PIN format
        const validation = validatePin(pin);
        if (!validation.valid) {
            throw new Error(validation.error || 'Invalid PIN');
        }

        // Hash PIN
        const pinHash = await hashPin(pin);

        // Update user
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                pinHash,
                pinSetAt: new Date(),
            },
            select: {
                id: true,
                email: true,
                name: true,
                pinSetAt: true,
            },
        });

        return user;
    }

    /**
     * Change PIN
     */
    async changePin(
        userId: string,
        currentPin: string,
        newPin: string,
        confirmNewPin: string
    ) {
        // Find user
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.pinHash) {
            throw new Error('PIN is not set for this account');
        }

        // Verify current PIN
        const isCurrentPinValid = await comparePin(currentPin, user.pinHash);
        if (!isCurrentPinValid) {
            throw new Error('Current PIN is incorrect');
        }

        // Validate new PIN match
        if (newPin !== confirmNewPin) {
            throw new Error('New PINs do not match');
        }

        // Validate new PIN format
        const validation = validatePin(newPin);
        if (!validation.valid) {
            throw new Error(validation.error || 'Invalid PIN');
        }

        // Hash new PIN
        const newPinHash = await hashPin(newPin);

        // Update user
        await prisma.user.update({
            where: { id: userId },
            data: {
                pinHash: newPinHash,
                pinSetAt: new Date(),
            },
        });

        return { message: 'PIN changed successfully' };
    }

    /**
     * Reset PIN (requires password verification)
     */
    async resetPin(userId: string, password: string) {
        // Find user
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        // Remove PIN
        await prisma.user.update({
            where: { id: userId },
            data: {
                pinHash: null,
                pinSetAt: null,
            },
        });

        return { message: 'PIN reset successfully' };
    }

    /**
     * Request password reset - generates token and returns it
     * In production, this would send an email instead
     */
    async requestPasswordReset(email: string) {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // For security, don't reveal if email exists
            return { message: 'If an account exists with this email, a reset link has been sent' };
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY);

        // Store token in database
        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: hashedToken,
                passwordResetExpires: expiresAt,
            },
        });

        // In production, send email here
        // For UAT, return the token directly
        return {
            message: 'Password reset token generated',
            resetToken, // Only return this in UAT/dev mode
            expiresAt,
        };
    }

    /**
     * Reset password with token
     */
    async resetPasswordWithToken(
        token: string,
        newPassword: string,
        confirmPassword: string
    ) {
        // Validate passwords match
        if (newPassword !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        // Validate password length
        if (!newPassword || newPassword.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        // Hash the token for comparison
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid token
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpires: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
                // Reset login attempts
                loginAttempts: 0,
                lockedUntil: null,
            },
        });

        return { message: 'Password reset successfully' };
    }

    /**
     * Request PIN reset - generates token and returns it
     * In production, this would send an email instead
     */
    async requestPinReset(email: string) {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // For security, don't reveal if email exists
            return { message: 'If an account exists with this email, a reset link has been sent' };
        }

        // Check if PIN is set
        if (!user.pinHash) {
            throw new Error('PIN is not set for this account');
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY);

        // Store token in database
        await prisma.user.update({
            where: { id: user.id },
            data: {
                pinResetToken: hashedToken,
                pinResetExpires: expiresAt,
            },
        });

        // In production, send email here
        // For UAT, return the token directly
        return {
            message: 'PIN reset token generated',
            resetToken, // Only return this in UAT/dev mode
            expiresAt,
        };
    }

    /**
     * Reset PIN with token
     */
    async resetPinWithToken(
        token: string,
        newPin: string,
        confirmPin: string
    ) {
        // Validate PINs match
        if (newPin !== confirmPin) {
            throw new Error('PINs do not match');
        }

        // Validate PIN format
        const validation = validatePin(newPin);
        if (!validation.valid) {
            throw new Error(validation.error || 'Invalid PIN');
        }

        // Hash the token for comparison
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid token
        const user = await prisma.user.findFirst({
            where: {
                pinResetToken: hashedToken,
                pinResetExpires: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        // Hash new PIN
        const newPinHash = await hashPin(newPin);

        // Update PIN and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                pinHash: newPinHash,
                pinSetAt: new Date(),
                pinResetToken: null,
                pinResetExpires: null,
                // Reset login attempts
                loginAttempts: 0,
                lockedUntil: null,
            },
        });

        return { message: 'PIN reset successfully' };
    }

    /**
     * Refresh access token
     */
    async refreshAccessToken(refreshToken: string) {
        // Verify refresh token
        try {
            verifyRefreshToken(refreshToken);
        } catch {
            throw new Error('Invalid or expired refresh token');
        }

        // Check if refresh token exists in database
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });

        if (!storedToken) {
            throw new Error('Refresh token not found');
        }

        // Check if token is expired
        if (storedToken.expiresAt < new Date()) {
            // Delete expired token
            await prisma.refreshToken.delete({
                where: { id: storedToken.id },
            });
            throw new Error('Refresh token expired');
        }

        // Generate new access token
        const accessToken = generateAccessToken({
            id: storedToken.user.id,
            email: storedToken.user.email,
            role: storedToken.user.role,
        });

        return { accessToken };
    }

    /**
     * Logout user
     */
    async logout(refreshToken: string) {
        // Delete refresh token
        await prisma.refreshToken.deleteMany({
            where: { token: refreshToken },
        });

        return { message: 'Logged out successfully' };
    }

    /**
     * Get current user
     */
    async getCurrentUser(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                pinSetAt: true,
                lastLoginAt: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }
}

export default new AuthService();
