import { Router } from 'express';
import prisma from '../config/database';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import taskRoutes from './task.routes';
import dailyUpdateRoutes from './dailyUpdate.routes';
import commentRoutes from './comment.routes';
import notificationRoutes from './notification.routes';
import activityLogRoutes from './activityLog.routes';
import groupRoutes from './group.routes';
import uploadRoutes from './upload.routes';
import userRoutes from './user.routes';
import tagRoutes from './tag.routes';

const router = Router();

// Health check endpoint with DB connectivity
router.get('/health', async (_req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({
            success: true,
            message: 'TaskFlow API is running',
            timestamp: new Date().toISOString(),
            database: 'connected',
        });
    } catch {
        res.status(503).json({
            success: false,
            message: 'TaskFlow API is running but database is unreachable',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
        });
    }
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/', taskRoutes);
router.use('/', dailyUpdateRoutes);
router.use('/', commentRoutes);
router.use('/', notificationRoutes);
router.use('/', activityLogRoutes);
router.use('/groups', groupRoutes);
router.use('/', uploadRoutes);
router.use('/users', userRoutes);
router.use('/', tagRoutes);

export default router;
