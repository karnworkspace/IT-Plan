import prisma from '../config/database';

// Types
export interface CreateNotificationInput {
  userId: string;
  type: 'TASK_ASSIGNED' | 'TASK_DUE_SOON' | 'TASK_OVERDUE' | 'TASK_COMPLETED' | 'COMMENT_ADDED' | 'PROJECT_INVITE' | 'DAILY_REMINDER';
  title: string;
  message: string;
  taskId?: string;
  projectId?: string;
}

export class NotificationService {
  /**
   * Create new notification
   */
  async createNotification(data: CreateNotificationInput): Promise<any> {
    return await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        taskId: data.taskId,
        projectId: data.projectId,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Get notifications for user
   */
  async getUserNotifications(userId: string, limit: number = 20, offset: number = 0): Promise<any[]> {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return notifications;
  }

  /**
   * Get notification by ID
   */
  async getNotificationById(id: string, userId: string): Promise<any | null> {
    const notification = await prisma.notification.findUnique({
      where: { id },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Check if notification belongs to user
    if (notification && notification.userId !== userId) {
      throw new Error('Notification not found');
    }

    return notification;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string, userId: string): Promise<any | null> {
    // Check if notification exists and belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found');
    }

    return await prisma.notification.update({
      where: { id },
      data: { isRead: true },
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Mark all notifications as read for user
   */
  async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return result.count;
  }

  /**
   * Delete notification
   */
  async deleteNotification(id: string, userId: string): Promise<boolean> {
    // Check if notification exists and belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      return false;
    }

    await prisma.notification.delete({
      where: { id },
    });

    return true;
  }

  /**
   * Get unread count for user
   */
  async getUnreadCount(userId: string): Promise<number> {
    return await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  /**
   * Clear old notifications (older than 30 days)
   */
  async clearOldNotifications(userId: string, days: number = 30): Promise<number> {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const result = await prisma.notification.deleteMany({
      where: {
        userId,
        createdAt: {
          lt: dateThreshold,
        },
      },
    });

    return result.count;
  }
}

export default new NotificationService();
