import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Types
export interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  startDate?: Date;
  endDate?: Date;
  ownerId: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
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
    // Use transaction to create project and add owner as member
    return await prisma.$transaction(async (tx) => {
      // Create the project
      const project = await tx.project.create({
        data: {
          name: data.name,
          description: data.description,
          color: data.color || '#1890ff',
          icon: data.icon,
          startDate: data.startDate,
          endDate: data.endDate,
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

      // Add owner as a project member with OWNER role
      await tx.projectMember.create({
        data: {
          projectId: project.id,
          userId: data.ownerId,
          role: 'OWNER',
        },
      });

      return project;
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

  /**
   * Get all members of a project
   */
  async getProjectMembers(projectId: string): Promise<any[]> {
    return await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: { id: true, email: true, name: true }
        }
      },
      orderBy: { joinedAt: 'asc' }
    });
  }

  /**
   * Add member to project
   */
  async addProjectMember(projectId: string, userId: string, role: string, requesterId: string): Promise<any> {
    // Check if requester is owner or admin
    const requesterMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: requesterId } }
    });

    if (!requesterMember || !['OWNER', 'ADMIN'].includes(requesterMember.role)) {
      throw new Error('Only project owners and admins can add members');
    }

    // Check if user already exists
    const existingMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } }
    });

    if (existingMember) {
      throw new Error('User is already a member of this project');
    }

    return await prisma.projectMember.create({
      data: { projectId, userId, role },
      include: {
        user: { select: { id: true, email: true, name: true } }
      }
    });
  }

  /**
   * Update member role
   */
  async updateMemberRole(projectId: string, memberId: string, role: string, requesterId: string): Promise<any> {
    // Check if requester has permission
    const requesterMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: requesterId } }
    });

    if (!requesterMember || requesterMember.role !== 'OWNER') {
      throw new Error('Only project owners can change member roles');
    }

    return await prisma.projectMember.update({
      where: { id: memberId },
      data: { role },
      include: {
        user: { select: { id: true, email: true, name: true } }
      }
    });
  }

  /**
   * Remove member from project
   */
  async removeProjectMember(projectId: string, memberId: string, requesterId: string): Promise<void> {
    // Check if requester has permission
    const requesterMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: requesterId } }
    });

    if (!requesterMember || !['OWNER', 'ADMIN'].includes(requesterMember.role)) {
      throw new Error('Only project owners and admins can remove members');
    }

    // Prevent removing the owner
    const targetMember = await prisma.projectMember.findUnique({
      where: { id: memberId }
    });

    if (targetMember?.role === 'OWNER') {
      throw new Error('Cannot remove project owner');
    }

    await prisma.projectMember.delete({ where: { id: memberId } });
  }
}

export default new ProjectService();
