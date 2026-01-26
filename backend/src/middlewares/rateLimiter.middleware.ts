import rateLimit from 'express-rate-limit';

// Skip rate limiting in test environment
const isTestEnv = process.env.NODE_ENV === 'test';

/**
 * Rate limiter for authentication endpoints
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isTestEnv ? 1000 : 50, // Higher limit for testing, 50 for production
    message: 'Too many authentication attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isTestEnv, // Skip in test environment
});

/**
 * Rate limiter for general API endpoints
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isTestEnv ? 1000 : 100, // Higher limit for testing
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isTestEnv, // Skip in test environment
});
