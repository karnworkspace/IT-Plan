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
  tagIds?: string[];
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
  tagIds?: string[];
  dueDate?: Date;
  startDate?: Date;
  progress?: number;
}

export interface TaskFilters {
  projectId: string;
  status?: string;
  assigneeId?: string;
  priority?: string;
  tagId?: string;
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
      tagId,
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
    if (tagId) where.taskTags = { some: { tagId } };

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
        taskTags: { include: { tag: { select: { id: true, name: true, color: true } } } },
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
        { sortOrder: 'asc' },
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
        taskTags: { include: { tag: { select: { id: true, name: true, color: true } } } },
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
        taskTags: data.tagIds?.length ? {
          create: data.tagIds.map(tid => ({ tagId: tid })),
        } : undefined,
      },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
        taskAssignees: { include: { user: { select: { id: true, name: true } } } },
        taskTags: { include: { tag: { select: { id: true, name: true, color: true } } } },
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

    // Handle tags
    const { tagIds, ...dataWithoutTags } = data;
    if (tagIds !== undefined) {
      await prisma.taskTag.deleteMany({ where: { taskId: id } });
      if (tagIds.length > 0) {
        await prisma.taskTag.createMany({
          data: tagIds.map(tid => ({ taskId: id, tagId: tid })),
        });
      }
    }

    // Handle multiple assignees
    const { assigneeIds, ...updateData } = dataWithoutTags;
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
        taskTags: { include: { tag: { select: { id: true, name: true, color: true } } } },
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
        { sortOrder: 'asc' },
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
  /**
   * Reorder tasks within a status column
   */
  async reorderTasks(taskIds: string[]): Promise<void> {
    await prisma.$transaction(
      taskIds.map((id, index) =>
        prisma.task.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );
  }

  /**
   * Convert a top-level task into a subtask under a parent
   */
  async convertToSubtask(taskId: string, parentTaskId: string, userId: string): Promise<any> {
    if (taskId === parentTaskId) {
      throw new Error('A task cannot be its own parent');
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { _count: { select: { subTasks: true } } },
    });
    if (!task) throw new Error('Task not found');
    if (task.parentTaskId) throw new Error('Task is already a subtask');
    if (task._count.subTasks > 0) throw new Error('Cannot convert a task that has subtasks');

    const parent = await prisma.task.findUnique({ where: { id: parentTaskId } });
    if (!parent) throw new Error('Parent task not found');
    if (parent.projectId !== task.projectId) throw new Error('Parent must be in the same project');
    if (parent.parentTaskId) throw new Error('Cannot nest subtask under another subtask');

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { parentTaskId },
      include: {
        project: { select: { id: true, name: true } },
        parentTask: { select: { id: true, title: true } },
      },
    });

    await activityLogService.createActivityLog({
      userId,
      action: 'UPDATED',
      entityType: 'task',
      entityId: taskId,
      projectId: task.projectId,
      taskId,
      metadata: { convertedTo: 'subtask', parentTaskId },
    });

    return updated;
  }

  /**
   * Get all tasks with a specific tag (cross-project)
   */
  async getTasksByTag(tagId: string, filters?: { status?: string; priority?: string; page?: number; limit?: number }): Promise<PaginationResult<any>> {
    const { status, priority, page = 1, limit = 100 } = filters || {};

    const where: any = { taskTags: { some: { tagId } } };
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const total = await prisma.task.count({ where });

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: { select: { id: true, name: true, color: true } },
        assignee: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
        taskAssignees: { include: { user: { select: { id: true, name: true } } } },
        taskTags: { include: { tag: { select: { id: true, name: true, color: true } } } },
        _count: { select: { comments: true, dailyUpdates: true, subTasks: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        { sortOrder: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return { data: tasks, pagination: { page, limit, total } };
  }

  /**
   * Convert a subtask into an independent top-level task
   */
  async convertToTask(taskId: string, userId: string): Promise<any> {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new Error('Task not found');
    if (!task.parentTaskId) throw new Error('Task is already a top-level task');

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { parentTaskId: null },
      include: {
        project: { select: { id: true, name: true } },
      },
    });

    await activityLogService.createActivityLog({
      userId,
      action: 'UPDATED',
      entityType: 'task',
      entityId: taskId,
      projectId: task.projectId,
      taskId,
      metadata: { convertedTo: 'task', previousParentId: task.parentTaskId },
    });

    return updated;
  }
}

export default new TaskService();
