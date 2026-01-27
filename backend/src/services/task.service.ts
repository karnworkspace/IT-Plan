import { PrismaClient } from '@prisma/client';
import notificationService from './notification.service';
import activityLogService from './activityLog.service';

const prisma = new PrismaClient();

// Types
export interface CreateTaskInput {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  createdById: string;
  priority?: string;
  dueDate?: Date;
  startDate?: Date;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  dueDate?: Date;
  startDate?: Date;
  progress?: number;
}

export interface TaskFilters {
  projectId: string;
  status?: string;
  assigneeId?: string;
  priority?: string;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export class TaskService {
  /**
   * Get all tasks in a project with filters and pagination
   */
  async getAllTasks(filters: TaskFilters): Promise<PaginationResult<any>> {
    const {
      projectId,
      status,
      assigneeId,
      priority,
      dueDateFrom,
      dueDateTo,
      page = 1,
      limit = 20,
    } = filters;

    // Build where clause
    const where: any = { projectId };

    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId;
    if (priority) where.priority = priority;

    if (dueDateFrom || dueDateTo) {
      where.dueDate = {};
      if (dueDateFrom) where.dueDate.gte = dueDateFrom;
      if (dueDateTo) where.dueDate.lte = dueDateTo;
    }

    // Get total count
    const total = await prisma.task.count({ where });

    // Get tasks with pagination
    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            dailyUpdates: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return {
      data: tasks,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  /**
   * Get task by ID
   */
  async getTaskById(id: string): Promise<any | null> {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        dailyUpdates: {
          orderBy: {
            date: 'desc',
          },
        },
        _count: {
          select: {
            comments: true,
            dailyUpdates: true,
          },
        },
      },
    });

    return task;
  }

  /**
   * Create new task
   */
  async createTask(data: CreateTaskInput): Promise<any> {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        assigneeId: data.assigneeId || null,
        createdById: data.createdById,
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate || null,
        startDate: data.startDate || null,
        status: 'TODO',
        progress: 0,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Trigger notification for assignee
    if (data.assigneeId && data.assigneeId !== data.createdById) {
      await notificationService.createNotification({
        userId: data.assigneeId,
        type: 'TASK_ASSIGNED',
        title: 'New Task Assigned',
        message: `You have been assigned to task: ${task.title}`,
        taskId: task.id,
        projectId: task.projectId,
      });
    }

    // Log activity
    await activityLogService.createActivityLog({
      userId: data.createdById,
      action: 'CREATED',
      entityType: 'task',
      entityId: task.id,
      projectId: task.projectId,
      taskId: task.id,
      metadata: { title: task.title }
    });

    return task;
  }

  /**
   * Update task
   */
  async updateTask(id: string, data: UpdateTaskInput, userId: string): Promise<any | null> {
    // Check if user has permission (assignee, creator, or project owner)
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });

    if (!existingTask) {
      return null;
    }

    const isAssignee = existingTask.assigneeId === userId;
    const isCreator = existingTask.createdById === userId;
    const isProjectOwner = existingTask.project.ownerId === userId;

    if (!isAssignee && !isCreator && !isProjectOwner) {
      throw new Error('You do not have permission to update this task');
    }

    // Trigger notification when assignee changes
    if (data.assigneeId && data.assigneeId !== existingTask.assigneeId) {
      await notificationService.createNotification({
        userId: data.assigneeId,
        type: 'TASK_ASSIGNED',
        title: 'Task Assigned to You',
        message: `You have been assigned to task: ${existingTask.title}`,
        taskId: id,
        projectId: existingTask.projectId,
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Log activity
    await activityLogService.createActivityLog({
      userId,
      action: 'UPDATED',
      entityType: 'task',
      entityId: id,
      projectId: updatedTask.projectId,
      taskId: id,
      metadata: { changes: Object.keys(data) }
    });

    return updatedTask;
  }

  /**
   * Delete task
   */
  async deleteTask(id: string, userId: string): Promise<boolean> {
    // Check if user has permission
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });

    if (!task) {
      return false;
    }

    const isAssignee = task.assigneeId === userId;
    const isCreator = task.createdById === userId;
    const isProjectOwner = task.project.ownerId === userId;

    if (!isAssignee && !isCreator && !isProjectOwner) {
      throw new Error('You do not have permission to delete this task');
    }

    // Log activity before deletion (so we have record, though cascade might delete it if linked)
    await activityLogService.createActivityLog({
      userId,
      action: 'DELETED',
      entityType: 'task',
      entityId: id,
      projectId: task.projectId,
      metadata: { title: task.title }
    });

    await prisma.task.delete({
      where: { id },
    });

    return true;
  }

  /**
   * Update task status and progress
   */
  async updateTaskStatus(id: string, status: string, progress: number, userId: string): Promise<any> {
    // Check if user has permission
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });

    if (!existingTask) {
      throw new Error('Task not found');
    }

    const isAssignee = existingTask.assigneeId === userId;
    const isCreator = existingTask.createdById === userId;
    const isProjectOwner = existingTask.project.ownerId === userId;

    if (!isAssignee && !isCreator && !isProjectOwner) {
      throw new Error('You do not have permission to update this task');
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status,
        progress,
      },
    });

    // Trigger notification when task completed
    if (status === 'DONE' && existingTask.createdById !== userId) {
      await notificationService.createNotification({
        userId: existingTask.createdById,
        type: 'TASK_COMPLETED',
        title: 'Task Completed',
        message: `Task "${existingTask.title}" has been marked as completed`,
        taskId: id,
        projectId: existingTask.projectId,
      });
    }

    // Log activity
    await activityLogService.createActivityLog({
      userId,
      action: status === 'DONE' ? 'COMPLETED' : 'UPDATED',
      entityType: 'task',
      entityId: id,
      projectId: existingTask.projectId,
      taskId: id,
      metadata: { status, progress }
    });

    return updatedTask;
  }

  /**
   * Get all tasks assigned to or created by a user (across all projects)
   */
  async getMyTasks(userId: string, filters?: { status?: string; priority?: string; page?: number; limit?: number }): Promise<PaginationResult<any>> {
    const { status, priority, page = 1, limit = 50 } = filters || {};

    // Build where clause - tasks where user is assignee OR creator
    const where: any = {
      OR: [
        { assigneeId: userId },
        { createdById: userId },
      ],
    };

    if (status) where.status = status;
    if (priority) where.priority = priority;

    // Get total count
    const total = await prisma.task.count({ where });

    // Get tasks with pagination
    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            dailyUpdates: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        { dueDate: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return {
      data: tasks,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  /**
   * Get task statistics for a project
   */
  async getTaskStats(projectId: string): Promise<any> {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      select: { status: true },
    });

    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === 'TODO').length;
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const inReview = tasks.filter((t) => t.status === 'IN_REVIEW').length;
    const done = tasks.filter((t) => t.status === 'DONE').length;
    const blocked = tasks.filter((t) => t.status === 'BLOCKED').length;

    return {
      total_tasks: total,
      todo_tasks: todo,
      in_progress_tasks: inProgress,
      in_review_tasks: inReview,
      completed_tasks: done,
      blocked_tasks: blocked,
      completion_rate: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  }
}

export default new TaskService();
