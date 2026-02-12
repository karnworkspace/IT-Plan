import api from './api';

// Types
export interface Attachment {
  id: string;
  commentId: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  attachments?: Attachment[];
}

export interface CreateCommentInput {
  content: string;
}

export interface UpdateCommentInput {
  content?: string;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
  page: number;
  pageSize: number;
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
