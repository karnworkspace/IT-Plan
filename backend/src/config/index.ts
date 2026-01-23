import dotenv from 'dotenv';

dotenv.config();

export const config = {
    // Server
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',

    // Database
    databaseUrl: process.env.DATABASE_URL || '',

    // JWT
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'default-access-secret',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
        accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
        refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    },

    // Security
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
        maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
        accountLockoutDuration: parseInt(process.env.ACCOUNT_LOCKOUT_DURATION || '900000', 10), // 15 minutes in ms
    },

    // CORS
    cors: {
        origin: process.env.CORS_ORIGIN 
            ? process.env.CORS_ORIGIN.split(',') 
            : ['http://localhost:5173', 'http://localhost:5174'],
    },
};
