import { Request, Response, NextFunction } from 'express';
import notificationService, {
  CreateNotificationInput,
} from '../services/notification.service';
import { sendSuccess, sendError } from '../utils/response';
import { extractUserId } from '../utils/auth';

/**
 * Get all notifications for user
 */
export const getUserNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = extractUserId(req);

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const notifications = await notificationService.getUserNotifications(userId, limit, offset);
    return sendSuccess(res, { notifications }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Get notification by ID
 */
export const getNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const userId = extractUserId(req);

    const notification = await notificationService.getNotificationById(id, userId);

    if (!notification) {
      return sendError(res, 'Notification not found', 404);
    }

    return sendSuccess(res, { notification }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Create new notification (internal use)
 */
export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = extractUserId(req);

    // Validation
    const { type, title, message, taskId, projectId } = req.body;

    if (!type) {
      return sendError(res, 'Type is required', 400);
    }

    if (!title) {
      return sendError(res, 'Title is required', 400);
    }

    if (!message) {
      return sendError(res, 'Message is required', 400);
    }

    if (title.length > 100) {
      return sendError(res, 'Title must be less than 100 characters', 400);
    }

    if (message.length > 500) {
      return sendError(res, 'Message must be less than 500 characters', 400);
    }

    const notificationData: CreateNotificationInput = {
      userId,
      type,
      title,
      message,
      taskId,
      projectId,
    };

    const notification = await notificationService.createNotification(notificationData);
    return sendSuccess(res, { notification }, undefined, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const userId = extractUserId(req);

    const notification = await notificationService.markAsRead(id, userId);

    return sendSuccess(res, { notification }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = extractUserId(req);

    const count = await notificationService.markAllAsRead(userId);
    return sendSuccess(res, { count, message: `Marked ${count} notifications as read` }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const userId = extractUserId(req);

    const deleted = await notificationService.deleteNotification(id, userId);

    if (!deleted) {
      return sendError(res, 'Notification not found', 404);
    }

    return sendSuccess(res, { message: 'Notification deleted successfully' }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread count
 */
export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = extractUserId(req);

    const count = await notificationService.getUnreadCount(userId);
    return sendSuccess(res, { count }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Clear old notifications
 */
export const clearOldNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = extractUserId(req);

    const days = req.query.days ? parseInt(req.query.days as string) : 30;

    const count = await notificationService.clearOldNotifications(userId, days);
    return sendSuccess(res, { count, message: `Cleared ${count} old notifications` }, '200');
  } catch (error) {
    next(error);
  }
};
