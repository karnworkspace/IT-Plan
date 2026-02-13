import api from './api';

// Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  status: 'ACTIVE' | 'DELAY' | 'COMPLETED' | 'HOLD' | 'CANCELLED' | 'POSTPONE' | 'ARCHIVED';
  startDate?: string;
  endDate?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  members?: {
    id: string;
    role: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }[];
  _count?: {
    tasks: number;
    members: number;
  };
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface ProjectStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  pageSize: number;
}

// Project Service
export const projectService = {
  /**
   * Get all projects
   */
  async getProjects(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    search?: string;
  }): Promise<ProjectsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);

    const response = await api.get(`/projects?${queryParams.toString()}`);
    return response.data.data;
  },

  /**
   * Get project by ID
   */
  async getProject(id: string): Promise<Project> {
    const response = await api.get(`/projects/${id}`);
    return response.data.data.project;
  },

  /**
   * Get project stats
   */
  async getProjectStats(id: string): Promise<ProjectStats> {
    const response = await api.get(`/projects/${id}/stats`);
    return response.data.data.stats;
  },

  /**
   * Create new project
   */
  async createProject(data: CreateProjectInput): Promise<Project> {
    const response = await api.post('/projects', data);
    return response.data.data.project;
  },

  /**
   * Update project
   */
  async updateProject(id: string, data: UpdateProjectInput): Promise<Project> {
    const response = await api.put(`/projects/${id}`, data);
    return response.data.data.project;
  },

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};

export default projectService;
