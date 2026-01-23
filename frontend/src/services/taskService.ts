import api from './api';

// Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'BLOCKED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  projectId: string;
  assigneeId?: string;
  createdById: string;
  dueDate?: string;
  startDate?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  project?: {
    id: string;
    name: string;
  };
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  dueDate?: string;
  startDate?: string;
  progress?: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  dueDate?: string;
  startDate?: string;
  progress?: number;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  inReview: number;
  done: number;
  blocked: number;
  overdue: number;
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
   * Delete task
   */
  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};

export default taskService;
