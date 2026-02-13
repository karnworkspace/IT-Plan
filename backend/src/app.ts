import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { apiLimiter } from './middlewares/rateLimiter.middleware';

// Create Express app
const app: Application = express();

// Middleware
app.use(cors({
    origin: config.cors.origin,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Routes
app.use('/api/v1', routes);

// Root endpoint
app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'Welcome to TaskFlow API',
        version: '1.0.0',
        docs: '/api/v1/health',
    });
});

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
