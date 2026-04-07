import prisma from '../config/database';
import { AppError } from '../utils/AppError';

// Types
export interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  status?: string;
  projectType?: string;
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
  projectType?: string;
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
   * Get projects for Annual Plan Timeline view
   */
  async getTimelineData(): Promise<any[]> {
    const projects = await prisma.project.findMany({
      where: { category: { not: null }, projectType: 'PROJECT' },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        tasks: {
          where: { parentTaskId: null },
          select: {
            id: true, title: true, status: true, priority: true, progress: true,
            startDate: true, dueDate: true,
            assignee: { select: { id: true, name: true } },
            taskTags: { include: { tag: { select: { id: true, name: true, color: true } } } },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: { select: { tasks: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return projects.map(p => {
      const totalTasks = p.tasks.length;
      const doneTasks = p.tasks.filter(t => t.status === 'DONE').length;
      const holdTasks = p.tasks.filter(t => t.status === 'HOLD').length;
      const cancelledTasks = p.tasks.filter(t => t.status === 'CANCELLED').length;
      const countable = totalTasks - holdTasks - cancelledTasks;
      const progress = countable > 0 ? Math.round((doneTasks / countable) * 100) : 0;
      return {
        id: p.id, name: p.name, projectCode: p.projectCode, category: p.category,
        status: p.status, color: p.color, businessOwner: p.businessOwner,
        sortOrder: p.sortOrder, timeline: p.timeline,
        startDate: p.startDate, endDate: p.endDate,
        progress, totalTasks, doneTasks,
        owner: p.owner,
        members: p.members.map(m => ({ id: m.user.id, name: m.user.name, role: m.role })),
        tasks: p.tasks,
      };
    });
  }

  /**
   * Get all projects with filters and pagination
   */
  async getAllProjects(filters: ProjectFilters = {}, user?: { id: string; role: string }): Promise<PaginationResult<any>> {
    const { status, ownerId, projectType, page = 1, limit = 20 } = filters;

    // Build where clause
    const where: any = {};
    if (status) where.status = status;
    if (ownerId) where.ownerId = ownerId;
    if (projectType) where.projectType = projectType;

    // Role-based filtering
    if (user) {
      if (user.role === 'ADMIN') {
        // Admin sees all — no additional filter
      } else if (user.role === 'MANAGER') {
        // Manager sees projects they own or are a member of
        where.members = { some: { userId: user.id } };
      } else {
        // MEMBER sees only projects they're a member of
        where.members = { some: { userId: user.id } };
      }
    }

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
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
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
   * Get projects where the user is a member
   */
  async getMyProjects(userId: string, filters: { status?: string; projectType?: string; page?: number; limit?: number } = {}): Promise<PaginationResult<any>> {
    const { status, projectType, page = 1, limit = 100 } = filters;

    const where: any = {
      members: { some: { userId } },
    };
    if (status) where.status = status;
    if (projectType) where.projectType = projectType;

    const total = await prisma.project.count({ where });

    const projects = await prisma.project.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        _count: { select: { tasks: true, members: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return { data: projects, pagination: { page, limit, total } };
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
          status: data.status || 'ACTIVE',
          projectType: data.projectType || 'PROJECT',
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
    // Check if user is owner or ADMIN
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return null;
    }

    // Allow owner, ADMIN, or OWNER role
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (project.ownerId !== userId && user?.role !== 'ADMIN' && user?.role !== 'OWNER') {
      throw new AppError('You do not have permission to update this project', 403);
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
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return false;
    }

    // System ADMIN can delete any project
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (project.ownerId !== userId && user?.role !== 'ADMIN') {
      throw new AppError('You do not have permission to delete this project', 403);
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
    const hold = tasks.filter(t => t.status === 'HOLD').length;
    const cancelled = tasks.filter(t => t.status === 'CANCELLED').length;
    const countable = total - hold - cancelled;
    const progress = countable > 0 ? Math.round((completed / countable) * 100) : 0;

    return {
      total_tasks: total,
      completed_tasks: completed,
      in_progress_tasks: inProgress,
      todo_tasks: todo,
      blocked_tasks: blocked,
      hold_tasks: hold,
      cancelled_tasks: cancelled,
      progress,
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
    // System ADMIN bypasses project-level check
    const requesterUser = await prisma.user.findUnique({ where: { id: requesterId }, select: { role: true } });
    const isSystemAdmin = requesterUser?.role === 'ADMIN';

    if (!isSystemAdmin) {
      const requesterMember = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: requesterId } }
      });
      if (!requesterMember || !['OWNER', 'ADMIN'].includes(requesterMember.role)) {
        throw new AppError('Only project owners and admins can add members', 403);
      }
    }

    // Check if user already exists
    const existingMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } }
    });

    if (existingMember) {
      throw new AppError('User is already a member of this project', 400);
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
    // System ADMIN bypasses project-level check
    const requesterUser = await prisma.user.findUnique({ where: { id: requesterId }, select: { role: true } });
    const isSystemAdmin = requesterUser?.role === 'ADMIN';

    if (!isSystemAdmin) {
      const requesterMember = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: requesterId } }
      });
      if (!requesterMember || requesterMember.role !== 'OWNER') {
        throw new AppError('Only project owners can change member roles', 403);
      }
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
    // System ADMIN bypasses project-level check
    const requesterUser = await prisma.user.findUnique({ where: { id: requesterId }, select: { role: true } });
    const isSystemAdmin = requesterUser?.role === 'ADMIN';

    if (!isSystemAdmin) {
      const requesterMember = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: requesterId } }
      });
      if (!requesterMember || !['OWNER', 'ADMIN'].includes(requesterMember.role)) {
        throw new AppError('Only project owners and admins can remove members', 403);
      }
    }

    // Prevent removing the owner
    const targetMember = await prisma.projectMember.findUnique({
      where: { id: memberId }
    });

    if (targetMember?.role === 'OWNER') {
      throw new AppError('Cannot remove project owner', 400);
    }

    await prisma.projectMember.delete({ where: { id: memberId } });
  }

  /**
   * Reorder projects within a status column
   */
  async reorderProjects(projectIds: string[]): Promise<void> {
    await prisma.$transaction(
      projectIds.map((id, index) =>
        prisma.project.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );
  }
}

export default new ProjectService();
