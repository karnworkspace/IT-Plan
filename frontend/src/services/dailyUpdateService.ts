import api from './api';

// Types
export interface DailyUpdate {
  id: string;
  taskId: string;
  date: string;
  progress: number;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'BLOCKED';
  notes?: string;
  createdAt: string;
  task?: {
    id: string;
    title: string;
  };
}

export interface CreateDailyUpdateInput {
  date?: string;
  progress: number;
  status: string;
  notes?: string;
}

export interface UpdateDailyUpdateInput {
  date?: string;
  progress?: number;
  status?: string;
  notes?: string;
}

// Daily Update Service
export const dailyUpdateService = {
  /**
   * Get daily updates for a task
   */
  async getTaskUpdates(taskId: string): Promise<DailyUpdate[]> {
    const response = await api.get(`/tasks/${taskId}/updates`);
    return response.data.data.updates;
  },

  /**
   * Get daily updates by date range
   */
  async getUpdatesByDateRange(
    taskId: string,
    startDate: string,
    endDate: string
  ): Promise<DailyUpdate[]> {
    const response = await api.get(
      `/tasks/${taskId}/updates/range?start_date=${startDate}&end_date=${endDate}`
    );
    return response.data.data.updates;
  },

  /**
   * Get daily update by ID
   */
  async getUpdate(id: string): Promise<DailyUpdate> {
    const response = await api.get(`/updates/${id}`);
    return response.data.data.update;
  },

  /**
   * Create daily update
   */
  async createUpdate(taskId: string, data: CreateDailyUpdateInput): Promise<DailyUpdate> {
    const response = await api.post(`/tasks/${taskId}/updates`, data);
    return response.data.data.update;
  },

  /**
   * Update daily update
   */
  async updateUpdate(id: string, data: UpdateDailyUpdateInput): Promise<DailyUpdate> {
    const response = await api.put(`/updates/${id}`, data);
    return response.data.data.update;
  },

  /**
   * Delete daily update
   */
  async deleteUpdate(id: string): Promise<void> {
    await api.delete(`/updates/${id}`);
  },
};

export default dailyUpdateService;
