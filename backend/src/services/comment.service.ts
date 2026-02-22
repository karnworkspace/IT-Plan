import prisma from '../config/database';

// Types
export interface CreateCommentInput {
  taskId: string;
  userId: string;
  content: string;
  parentCommentId?: string;
}

export interface UpdateCommentInput {
  content?: string;
}

export class CommentService {
  /**
   * Get all comments for a task
   */
  async getTaskComments(taskId: string): Promise<any[]> {
    const comments = await prisma.comment.findMany({
      where: { taskId, parentCommentId: null },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        attachments: true,
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            attachments: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments;
  }

  /**
   * Get comment by ID
   */
  async getCommentById(id: string): Promise<any | null> {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return comment;
  }

  /**
   * Create new comment
   */
  async createComment(data: CreateCommentInput): Promise<any> {
    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id: data.taskId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return await prisma.comment.create({
      data: {
        taskId: data.taskId,
        userId: data.userId,
        content: data.content,
        parentCommentId: data.parentCommentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        attachments: true,
      },
    });
  }

  /**
   * Update comment
   */
  async updateComment(id: string, data: UpdateCommentInput, userId: string): Promise<any | null> {
    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    // Only the comment author can update it
    if (comment.userId !== userId) {
      throw new Error('You do not have permission to update this comment');
    }

    return await prisma.comment.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Delete comment
   */
  async deleteComment(id: string, userId: string): Promise<boolean> {
    // Check if comment exists and get task info
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        task: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!comment) {
      return false;
    }

    // Check permission (author, creator, or project owner)
    const isAuthor = comment.userId === userId;
    const isCreator = comment.task.createdById === userId;
    const isProjectOwner = comment.task.project.ownerId === userId;

    if (!isAuthor && !isCreator && !isProjectOwner) {
      throw new Error('You do not have permission to delete this comment');
    }

    await prisma.comment.delete({
      where: { id },
    });

    return true;
  }

  /**
   * Get comments by user
   */
  async getUserComments(userId: string, limit: number = 20): Promise<any[]> {
    const comments = await prisma.comment.findMany({
      where: { userId },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return comments;
  }
}

export default new CommentService();
