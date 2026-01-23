import { Router } from 'express';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import taskRoutes from './task.routes';
import dailyUpdateRoutes from './dailyUpdate.routes';
import commentRoutes from './comment.routes';
import notificationRoutes from './notification.routes';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'TaskFlow API is running',
        timestamp: new Date().toISOString(),
    });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/', taskRoutes);
router.use('/', dailyUpdateRoutes);
router.use('/', commentRoutes);
router.use('/', notificationRoutes);

export default router;
