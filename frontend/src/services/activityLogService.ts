import api from './api';

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: string;
  projectId?: string;
  taskId?: string;
  createdAt: string;
  user?: { id: string; name: string };
  project?: { id: string; name: string };
  task?: { id: string; title: string };
}

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
};
