import prisma from '../config/database';
import notificationService from './notification.service';
import activityLogService from './activityLog.service';

// Types
export interface CreateTaskInput {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  assigneeIds?: string[];
  createdById: string;
  priority?: string;
  status?: string;
  dueDate?: Date;
  startDate?: Date;
  parentTaskId?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  assigneeIds?: string[];
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

    // Build where clause — only top-level tasks by default
    const where: any = { projectId, parentTaskId: null };

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
        taskAssignees: { include: { user: { select: { id: true, name: true } } } },
        _count: {
          select: {
            comments: true,
            dailyUpdates: true,
            subTasks: true,
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
        parentTask: {
          select: {
            id: true,
            title: true,
          },
        },
        subTasks: {
          include: {
            assignee: {
              select: { id: true, name: true },
            },
            _count: {
              select: { subTasks: true },
            },
          },
          orderBy: { createdAt: 'asc' },
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
        taskAssignees: { include: { user: { select: { id: true, name: true } } } },
        _count: {
          select: {
            comments: true,
            dailyUpdates: true,
            subTasks: true,
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
    // Resolve assignees: use assigneeIds array or fall back to single assigneeId
    const assigneeIds = data.assigneeIds?.length ? data.assigneeIds : (data.assigneeId ? [data.assigneeId] : []);
    const primaryAssigneeId = assigneeIds[0] || null;

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        assigneeId: primaryAssigneeId,
        createdById: data.createdById,
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate || null,
        startDate: data.startDate || null,
        status: data.status || 'TODO',
        progress: 0,
        parentTaskId: data.parentTaskId || null,
        taskAssignees: assigneeIds.length > 0 ? {
          create: assigneeIds.map(uid => ({ userId: uid })),
        } : undefined,
      },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
        taskAssignees: { include: { user: { select: { id: true, name: true } } } },
      },
    });

    // Trigger notifications for all assignees
    for (const uid of assigneeIds) {
      if (uid !== data.createdById) {
        await notificationService.createNotification({
          userId: uid,
          type: 'TASK_ASSIGNED',
          title: 'New Task Assigned',
          message: `You have been assigned to task: ${task.title}`,
          taskId: task.id,
          projectId: task.projectId,
        });
      }
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
    // Check if user has permission (assignee, creator, project owner, or ADMIN)
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
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'OWNER';

    if (!isAssignee && !isCreator && !isProjectOwner && !isAdmin) {
      throw new Error('You do not have permission to update this task');
    }

    // Handle multiple assignees
    const { assigneeIds, ...updateData } = data;
    if (assigneeIds !== undefined) {
      // Set primary assignee
      updateData.assigneeId = assigneeIds[0] || undefined;

      // Replace all task assignees
      await prisma.taskAssignee.deleteMany({ where: { taskId: id } });
      if (assigneeIds.length > 0) {
        await prisma.taskAssignee.createMany({
          data: assigneeIds.map(uid => ({ taskId: id, userId: uid })),
        });
      }

      // Notify new assignees
      for (const uid of assigneeIds) {
        if (uid !== existingTask.assigneeId && uid !== userId) {
          await notificationService.createNotification({
            userId: uid,
            type: 'TASK_ASSIGNED',
            title: 'Task Assigned to You',
            message: `You have been assigned to task: ${existingTask.title}`,
            taskId: id,
            projectId: existingTask.projectId,
          });
        }
      }
    } else if (data.assigneeId && data.assigneeId !== existingTask.assigneeId) {
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
      data: updateData,
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
        taskAssignees: { include: { user: { select: { id: true, name: true } } } },
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

    // System ADMIN can delete any task
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    const isSystemAdmin = user?.role === 'ADMIN';

    if (!isAssignee && !isCreator && !isProjectOwner && !isSystemAdmin) {
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
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'OWNER';

    if (!isAssignee && !isCreator && !isProjectOwner && !isAdmin) {
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
  /**
   * Get all tasks based on user role and team visibility
   */
  async getMyTasks(user: { id: string; email: string; role: string }, filters?: { status?: string; priority?: string; page?: number; limit?: number }): Promise<PaginationResult<any>> {
    const { status, priority, page = 1, limit = 50 } = filters || {};

    let where: any = {};

    // 1. CHIAN / OHM / ADMIN Logic -> See ALL Tasks
    const isAdminView =
      user.email === 'monchiant@sena.co.th' ||
      user.email === 'adinuna@sena.co.th' ||
      user.role === 'ADMIN';

    if (isAdminView) {
      // No assignee filter = All tasks
      where = {};
    } else {
      // 2. Determine visibility for Normal Users
      // Find TEAM user ID (Shared tasks)
      // Ideally we cache this, but for now we look it up.
      // We assume the user with email 'team@sena.co.th' is the bucket for team tasks.
      const teamUser = await prisma.user.findUnique({
        where: { email: 'team@sena.co.th' },
        select: { id: true }
      });

      // Users who can see TEAM tasks
      const teamViewers = ['tharab@sena.co.th', 'nattapongm@sena.co.th'];

      if (teamViewers.includes(user.email) && teamUser) {
        // Can see My Assigned Tasks OR Team Tasks
        where = {
          OR: [
            { assigneeId: user.id },
            { assigneeId: teamUser.id },
          ],
        };
      } else {
        // Strict: ONLY Assigned Tasks (No CreatedBy logic anymore!)
        where = { assigneeId: user.id };
      }
    }

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
   * Get sub-tasks of a parent task
   */
  async getSubTasks(parentTaskId: string): Promise<any[]> {
    const subTasks = await prisma.task.findMany({
      where: { parentTaskId },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { subTasks: true, comments: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return subTasks;
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
    const hold = tasks.filter((t) => t.status === 'HOLD').length;
    const cancelled = tasks.filter((t) => t.status === 'CANCELLED').length;

    return {
      total_tasks: total,
      todo_tasks: todo,
      in_progress_tasks: inProgress,
      in_review_tasks: inReview,
      completed_tasks: done,
      blocked_tasks: blocked,
      hold_tasks: hold,
      cancelled_tasks: cancelled,
      completion_rate: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  }
}

export default new TaskService();
