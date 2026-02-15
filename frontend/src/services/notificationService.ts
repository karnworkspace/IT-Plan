import api from './api';
import type { Notification, NotificationsResponse } from '../types';

// Re-export entity types for backward compatibility
export type { Notification, NotificationsResponse } from '../types';

// Input types (request-specific, kept here)
export interface CreateNotificationInput {
  type: string;
  title: string;
  message: string;
  taskId?: string;
  projectId?: string;
}

// Notification Service
export const notificationService = {
  /**
   * Get notifications for user
   */
  async getNotifications(params?: {
    limit?: number;
    offset?: number;
  }): Promise<NotificationsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const response = await api.get(`/notifications?${queryParams.toString()}`);
    return response.data.data;
  },

  /**
   * Get notification by ID
   */
  async getNotification(id: string): Promise<Notification> {
    const response = await api.get(`/notifications/${id}`);
    return response.data.data.notification;
  },

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<{ count: number }> {
    const response = await api.get('/notifications/unread/count');
    return response.data.data;
  },

  /**
   * Create new notification
   */
  async createNotification(data: CreateNotificationInput): Promise<Notification> {
    const response = await api.post('/notifications', data);
    return response.data.data.notification;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<Notification> {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data.data.notification;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ count: number; message: string }> {
    const response = await api.put('/notifications/read-all');
    return response.data.data;
  },

  /**
   * Delete notification
   */
  async deleteNotification(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/notifications/${id}`);
    return response.data.data;
  },

  /**
   * Clear old notifications
   */
  async clearOldNotifications(days?: number): Promise<{ count: number; message: string }> {
    const queryParams = days ? `?days=${days}` : '';
    const response = await api.delete(`/notifications/old${queryParams}`);
    return response.data.data;
  },
};

export default notificationService;
