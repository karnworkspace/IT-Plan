import rateLimit from 'express-rate-limit';

// Skip rate limiting in test or development environment
const isTestEnv = process.env.NODE_ENV === 'test';
const isDevEnv = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

/**
 * Rate limiter for authentication endpoints
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: (isTestEnv || isDevEnv) ? 500 : 50, // Higher limit for dev/testing
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
    max: (isTestEnv || isDevEnv) ? 500 : 100, // Higher limit for dev/testing
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isTestEnv, // Skip in test environment
});
