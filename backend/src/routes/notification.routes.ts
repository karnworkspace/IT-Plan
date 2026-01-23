import { Router } from 'express';
import {
  getUserNotifications,
  getNotification,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  clearOldNotifications,
} from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User notification routes
router.get('/notifications', getUserNotifications);
router.get('/notifications/unread/count', getUnreadCount);
router.post('/notifications', createNotification);

// Individual notification routes
router.get('/notifications/:id', getNotification);
router.put('/notifications/:id/read', markAsRead);
router.delete('/notifications/:id', deleteNotification);

// Bulk actions
router.put('/notifications/read-all', markAllAsRead);
router.delete('/notifications/old', clearOldNotifications);

export default router;
