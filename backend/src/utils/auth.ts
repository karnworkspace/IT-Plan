import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Request } from 'express';
import { config } from '../config';

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, config.security.bcryptRounds);
};

/**
 * Compare a plain text password with a hashed password
 */
export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};

/**
 * Hash a PIN using bcrypt
 */
export const hashPin = async (pin: string): Promise<string> => {
    return bcrypt.hash(pin, config.security.bcryptRounds);
};

/**
 * Compare a plain text PIN with a hashed PIN
 */
export const comparePin = async (pin: string, hashedPin: string): Promise<boolean> => {
    return bcrypt.compare(pin, hashedPin);
};

/**
 * Validate PIN format and security requirements
 */
export const validatePin = (pin: string): { valid: boolean; error?: string } => {
    // Check length
    if (pin.length !== 6) {
        return { valid: false, error: 'PIN must be exactly 6 digits' };
    }

    // Check if all characters are digits
    if (!/^\d{6}$/.test(pin)) {
        return { valid: false, error: 'PIN must contain only digits' };
    }

    // Check for sequential numbers (e.g., 123456, 654321)
    const isSequential = (str: string): boolean => {
        for (let i = 0; i < str.length - 1; i++) {
            const diff = parseInt(str[i + 1]) - parseInt(str[i]);
            if (Math.abs(diff) !== 1) return false;
        }
        return true;
    };

    if (isSequential(pin) || isSequential(pin.split('').reverse().join(''))) {
        return { valid: false, error: 'PIN cannot be sequential (e.g., 123456)' };
    }

    // Check for all same digits (e.g., 111111)
    if (/^(\d)\1{5}$/.test(pin)) {
        return { valid: false, error: 'PIN cannot be all the same digit' };
    }

    return { valid: true };
};

/**
 * Generate JWT access token
 */
export const generateAccessToken = (payload: { id: string; email: string; role: string }): string => {
    const options: SignOptions = {
        expiresIn: config.jwt.accessExpiry as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, config.jwt.accessSecret, options);
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (payload: { id: string }): string => {
    const options: SignOptions = {
        expiresIn: config.jwt.refreshExpiry as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, config.jwt.refreshSecret, options);
};

/**
 * Verify JWT access token
 */
export const verifyAccessToken = (token: string): any => {
    try {
        return jwt.verify(token, config.jwt.accessSecret);
    } catch (error) {
        throw new Error('Invalid or expired access token');
    }
};

/**
 * Verify JWT refresh token
 */
export const verifyRefreshToken = (token: string): any => {
    try {
        return jwt.verify(token, config.jwt.refreshSecret);
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};

/**
 * Extract user ID from JWT token in request
 */
export const extractUserId = (req: Request & { headers: { authorization?: string } }): string => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('No valid authorization header');
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyAccessToken(token);
    
    return decoded.id;
};
