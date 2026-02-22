import api from './api';

// Re-export entity type for backward compatibility
export type { ActivityLog } from '../types';

export const activityLogService = {
  getProjectActivities: async (projectId: string, limit = 50, offset = 0) => {
    const response = await api.get(`/projects/${projectId}/activities`, {
      params: { limit, offset }
    });
    return response.data;
  },

  getTaskActivities: async (taskId: string, limit = 50, offset = 0) => {
    const response = await api.get(`/tasks/${taskId}/activities`, {
      params: { limit, offset }
    });
    return response.data;
  },

  getUserActivities: async (userId: string, limit = 50, offset = 0) => {
    const response = await api.get(`/users/${userId}/activities`, {
      params: { limit, offset }
    });
    return response.data;
  },

  getRecentActivities: async (limit = 20, offset = 0) => {
    const response = await api.get('/activities/recent', {
      params: { limit, offset }
    });
    return response.data;
  },
};
