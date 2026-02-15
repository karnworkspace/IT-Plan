import api from './api';
import type { Task, TasksResponse, TaskStats } from '../types';

// Re-export entity types for backward compatibility
export type { Task, TasksResponse, TaskStats } from '../types';

// Input types (request-specific, kept here)
export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  assigneeIds?: string[];
  dueDate?: string;
  startDate?: string;
  progress?: number;
  parentTaskId?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  assigneeIds?: string[];
  dueDate?: string;
  startDate?: string;
  progress?: number;
}

// Task Service
export const taskService = {
  /**
   * Get tasks for a project
   */
  async getTasks(
    projectId: string,
    params?: {
      page?: number;
      pageSize?: number;
      status?: string;
      priority?: string;
      assigneeId?: string;
      search?: string;
    }
  ): Promise<TasksResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.assigneeId) queryParams.append('assigneeId', params.assigneeId);
    if (params?.search) queryParams.append('search', params.search);

    const response = await api.get(`/projects/${projectId}/tasks?${queryParams.toString()}`);
    return response.data.data;
  },

  /**
   * Get my tasks (assigned to or created by current user)
   */
  async getMyTasks(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    priority?: string;
  }): Promise<TasksResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('limit', params.pageSize.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);

    const response = await api.get(`/my-tasks?${queryParams.toString()}`);
    return response.data.data;
  },

  /**
   * Get task by ID
   */
  async getTask(id: string): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data.task;
  },

  /**
   * Get task stats
   */
  async getTaskStats(projectId: string): Promise<TaskStats> {
    const response = await api.get(`/projects/${projectId}/tasks/stats`);
    return response.data.data.stats;
  },

  /**
   * Create new task
   */
  async createTask(projectId: string, data: CreateTaskInput): Promise<Task> {
    const response = await api.post(`/projects/${projectId}/tasks`, data);
    return response.data.data.task;
  },

  /**
   * Update task
   */
  async updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data.data.task;
  },

  /**
   * Update task status
   */
  async updateTaskStatus(id: string, data: { status?: string; progress?: number }): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/status`, data);
    return response.data.data.task;
  },

  /**
   * Get sub-tasks
   */
  async getSubTasks(taskId: string): Promise<Task[]> {
    const response = await api.get(`/tasks/${taskId}/subtasks`);
    return response.data.data.subTasks;
  },

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};

export default taskService;
