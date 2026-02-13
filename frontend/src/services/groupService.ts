import api from './api';

export interface Group {
  id: string;
  name: string;
  description?: string;
  type: 'USER_GROUP' | 'PROJECT_GROUP';
  color: string;
  createdAt: string;
  updatedAt: string;
  members?: {
    id: string;
    user: { id: string; name: string; email: string };
  }[];
  projects?: {
    id: string;
    project: { id: string; name: string; color: string; status: string };
  }[];
  _count?: {
    members: number;
    projects: number;
  };
}

export const groupService = {
  async getGroups(type?: string): Promise<Group[]> {
    const params = type ? `?type=${type}` : '';
    const response = await api.get(`/groups${params}`);
    return response.data.data.groups;
  },

  async getGroup(id: string): Promise<Group> {
    const response = await api.get(`/groups/${id}`);
    return response.data.data.group;
  },

  async createGroup(data: { name: string; description?: string; type: string; color?: string }): Promise<Group> {
    const response = await api.post('/groups', data);
    return response.data.data.group;
  },

  async updateGroup(id: string, data: { name?: string; description?: string; color?: string }): Promise<Group> {
    const response = await api.put(`/groups/${id}`, data);
    return response.data.data.group;
  },

  async deleteGroup(id: string): Promise<void> {
    await api.delete(`/groups/${id}`);
  },

  async addMember(groupId: string, userId: string): Promise<void> {
    await api.post(`/groups/${groupId}/members`, { userId });
  },

  async removeMember(groupId: string, userId: string): Promise<void> {
    await api.delete(`/groups/${groupId}/members/${userId}`);
  },

  async addProject(groupId: string, projectId: string): Promise<void> {
    await api.post(`/groups/${groupId}/projects`, { projectId });
  },

  async removeProject(groupId: string, projectId: string): Promise<void> {
    await api.delete(`/groups/${groupId}/projects/${projectId}`);
  },
};

export default groupService;
