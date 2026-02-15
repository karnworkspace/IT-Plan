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
import { validateUUID } from '../middlewares/validate.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User notification routes
router.get('/notifications', getUserNotifications);
router.get('/notifications/unread/count', getUnreadCount);
router.post('/notifications', createNotification);

// Individual notification routes
router.get('/notifications/:id', validateUUID('id'), getNotification);
router.put('/notifications/:id/read', validateUUID('id'), markAsRead);
router.delete('/notifications/:id', validateUUID('id'), deleteNotification);

// Bulk actions
router.put('/notifications/read-all', markAllAsRead);
router.delete('/notifications/old', clearOldNotifications);

export default router;
