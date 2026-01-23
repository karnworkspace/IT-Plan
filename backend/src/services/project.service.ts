import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Types
export interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  ownerId: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  status?: string;
}

export interface ProjectFilters {
  status?: string;
  ownerId?: string;
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

export class ProjectService {
  /**
   * Get all projects with filters and pagination
   */
  async getAllProjects(filters: ProjectFilters = {}): Promise<PaginationResult<any>> {
    const { status, ownerId, page = 1, limit = 20 } = filters;

    // Build where clause
    const where: any = {};
    if (status) where.status = status;
    if (ownerId) where.ownerId = ownerId;

    // Get total count
    const total = await prisma.project.count({ where });

    // Get projects with pagination
    const projects = await prisma.project.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data: projects,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  /**
   * Get project by ID
   */
  async getProjectById(id: string): Promise<any | null> {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
      },
    });

    return project;
  }

  /**
   * Create new project
   */
  async createProject(data: CreateProjectInput): Promise<any> {
    return await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        color: data.color || '#1890ff',
        icon: data.icon,
        ownerId: data.ownerId,
      },
      include: {
        owner: {
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
   * Update project
   */
  async updateProject(id: string, data: UpdateProjectInput, userId: string): Promise<any | null> {
    // Check if user is owner
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return null;
    }

    if (project.ownerId !== userId) {
      throw new Error('You do not have permission to update this project');
    }

    return await prisma.project.update({
      where: { id },
      data,
      include: {
        owner: {
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
   * Delete project
   */
  async deleteProject(id: string, userId: string): Promise<boolean> {
    // Check if user is owner
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return false;
    }

    if (project.ownerId !== userId) {
      throw new Error('You do not have permission to delete this project');
    }

    await prisma.project.delete({
      where: { id },
    });

    return true;
  }

  /**
   * Get project statistics
   */
  async getProjectStats(projectId: string): Promise<any> {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      select: { status: true },
    });

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'DONE').length;
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const todo = tasks.filter(t => t.status === 'TODO').length;
    const blocked = tasks.filter(t => t.status === 'BLOCKED').length;

    return {
      total_tasks: total,
      completed_tasks: completed,
      in_progress_tasks: inProgress,
      todo_tasks: todo,
      blocked_tasks: blocked,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
}

export default new ProjectService();
