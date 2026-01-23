import express, { Application } from 'express';
import cors from 'cors';
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

// Start server
const PORT = config.port;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
    console.log(`🌐 CORS enabled for: ${config.cors.origin}`);
    console.log(`\n✅ Server started successfully!`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    process.exit(1);
});

export default app;
