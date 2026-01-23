import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Types
export interface CreateDailyUpdateInput {
  taskId: string;
  progress: number;
  status: string;
  notes?: string;
}

export interface UpdateDailyUpdateInput {
  progress?: number;
  status?: string;
  notes?: string;
}

export class DailyUpdateService {
  /**
   * Get all daily updates for a task
   */
  async getTaskUpdates(taskId: string): Promise<any[]> {
    const updates = await prisma.dailyUpdate.findMany({
      where: { taskId },
      orderBy: {
        date: 'desc',
      },
    });

    return updates;
  }

  /**
   * Get daily update by ID
   */
  async getUpdateById(id: string): Promise<any | null> {
    const update = await prisma.dailyUpdate.findUnique({
      where: { id },
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
    });

    return update;
  }

  /**
   * Create new daily update
   */
  async createDailyUpdate(data: CreateDailyUpdateInput, userId: string): Promise<any> {
    // Check if user has permission to update this task
    const task = await prisma.task.findUnique({
      where: { id: data.taskId },
      include: {
        project: true,
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    const isAssignee = task.assigneeId === userId;
    const isCreator = task.createdById === userId;
    const isProjectOwner = task.project.ownerId === userId;

    if (!isAssignee && !isCreator && !isProjectOwner) {
      throw new Error('You do not have permission to update this task');
    }

    return await prisma.dailyUpdate.create({
      data: {
        taskId: data.taskId,
        progress: data.progress,
        status: data.status,
        notes: data.notes,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  /**
   * Update daily update
   */
  async updateDailyUpdate(id: string, data: UpdateDailyUpdateInput, userId: string): Promise<any | null> {
    // Check if update exists and get task info
    const update = await prisma.dailyUpdate.findUnique({
      where: { id },
      include: {
        task: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!update) {
      throw new Error('Daily update not found');
    }

    // Check permission
    const isAssignee = update.task.assigneeId === userId;
    const isCreator = update.task.createdById === userId;
    const isProjectOwner = update.task.project.ownerId === userId;

    if (!isAssignee && !isCreator && !isProjectOwner) {
      throw new Error('You do not have permission to update this daily update');
    }

    return await prisma.dailyUpdate.update({
      where: { id },
      data,
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  /**
   * Delete daily update
   */
  async deleteDailyUpdate(id: string, userId: string): Promise<boolean> {
    // Check if update exists and get task info
    const update = await prisma.dailyUpdate.findUnique({
      where: { id },
      include: {
        task: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!update) {
      return false;
    }

    // Check permission
    const isAssignee = update.task.assigneeId === userId;
    const isCreator = update.task.createdById === userId;
    const isProjectOwner = update.task.project.ownerId === userId;

    if (!isAssignee && !isCreator && !isProjectOwner) {
      throw new Error('You do not have permission to delete this daily update');
    }

    await prisma.dailyUpdate.delete({
      where: { id },
    });

    return true;
  }

  /**
   * Get daily updates for a date range
   */
  async getUpdatesByDateRange(taskId: string, startDate: Date, endDate: Date): Promise<any[]> {
    const updates = await prisma.dailyUpdate.findMany({
      where: {
        taskId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return updates;
  }
}

export default new DailyUpdateService();
