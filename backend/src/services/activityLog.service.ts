import prisma from '../config/database';

export interface CreateActivityLogInput {
  userId: string;
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'ASSIGNED' | 'COMPLETED' | 'COMMENTED';
  entityType: 'task' | 'project' | 'comment';
  entityId: string;
  metadata?: Record<string, any>;
  projectId?: string;
  taskId?: string;
}

class ActivityLogService {
  async createActivityLog(data: CreateActivityLogInput) {
    return await prisma.activityLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        projectId: data.projectId,
        taskId: data.taskId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getProjectActivities(projectId: string, limit: number = 50, offset: number = 0) {
    return await prisma.activityLog.findMany({
      where: { projectId },
      include: {
        user: { select: { id: true, name: true } },
        task: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getTaskActivities(taskId: string, limit: number = 50, offset: number = 0) {
    return await prisma.activityLog.findMany({
      where: { taskId },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getUserActivities(userId: string, limit: number = 50, offset: number = 0) {
    return await prisma.activityLog.findMany({
      where: { userId },
      include: {
        project: { select: { id: true, name: true } },
        task: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getRecentActivities(limit: number = 20, offset: number = 0) {
    return await prisma.activityLog.findMany({
      include: {
        user: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
        task: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }
}

export default new ActivityLogService();
