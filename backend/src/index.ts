import app from './app';
import { config } from './config';
import { startAllJobs } from './jobs';

// Start server
const PORT = config.port;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
    console.log(`🌐 CORS enabled for: ${config.cors.origin}`);
    console.log(`\n✅ Server started successfully!`);

    // Start background jobs
    startAllJobs();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    process.exit(1);
});

export default server;
