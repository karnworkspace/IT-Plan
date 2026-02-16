import api from './api';
import type { Comment, Attachment } from '../types';

// Re-export entity types for backward compatibility
export type { Comment, Attachment, CommentsResponse } from '../types';

// Input types (request-specific, kept here)
export interface CreateCommentInput {
  content: string;
}

export interface UpdateCommentInput {
  content?: string;
}

// Comment Service
export const commentService = {
  /**
   * Get comments for a task
   */
  async getTaskComments(taskId: string): Promise<Comment[]> {
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data.data.comments;
  },

  /**
   * Get comment by ID
   */
  async getComment(id: string): Promise<Comment> {
    const response = await api.get(`/comments/${id}`);
    return response.data.data.comment;
  },

  /**
   * Create new comment
   */
  async createComment(taskId: string, data: CreateCommentInput): Promise<Comment> {
    const response = await api.post(`/tasks/${taskId}/comments`, data);
    return response.data.data.comment;
  },

  /**
   * Update comment
   */
  async updateComment(id: string, data: UpdateCommentInput): Promise<Comment> {
    const response = await api.put(`/comments/${id}`, data);
    return response.data.data.comment;
  },

  /**
   * Delete comment
   */
  async deleteComment(id: string): Promise<void> {
    await api.delete(`/comments/${id}`);
  },

  /**
   * Upload images for a comment
   */
  async uploadImages(commentId: string, files: File[]): Promise<Attachment[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const response = await api.post(`/comments/${commentId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data.attachments;
  },

  /**
   * Delete attachment
   */
  async deleteAttachment(id: string): Promise<void> {
    await api.delete(`/attachments/${id}`);
  },

  /**
   * Get comments by user
   */
  async getUserComments(params?: {
    limit?: number;
  }): Promise<Comment[]> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await api.get(`/user/comments?${queryParams.toString()}`);
    return response.data.data.comments;
  },
};

export default commentService;
