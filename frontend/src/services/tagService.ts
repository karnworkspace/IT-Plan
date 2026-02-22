import api from './api';
import type { Tag } from '../types';

export const tagService = {
  getAllTags: async (): Promise<Tag[]> => {
    const response = await api.get('/tags');
    return response.data.data?.tags || [];
  },

  createTag: async (data: { name: string; color?: string }): Promise<Tag> => {
    const response = await api.post('/tags', data);
    return response.data.data?.tag;
  },

  updateTag: async (id: string, data: { name?: string; color?: string }): Promise<Tag> => {
    const response = await api.put(`/tags/${id}`, data);
    return response.data.data?.tag;
  },

  deleteTag: async (id: string): Promise<void> => {
    await api.delete(`/tags/${id}`);
  },
};
