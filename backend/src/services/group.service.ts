import prisma from '../config/database';

export interface CreateGroupInput {
  name: string;
  description?: string;
  type: 'USER_GROUP' | 'PROJECT_GROUP';
  color?: string;
}

export interface UpdateGroupInput {
  name?: string;
  description?: string;
  color?: string;
}

export class GroupService {
  /**
   * Get all groups
   */
  async getAllGroups(type?: string): Promise<any[]> {
    const where: any = {};
    if (type) where.type = type;

    const groups = await prisma.group.findMany({
      where,
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        projects: {
          include: {
            project: {
              select: { id: true, name: true, color: true, status: true },
            },
          },
        },
        _count: {
          select: { members: true, projects: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return groups;
  }

  /**
   * Get group by ID
   */
  async getGroupById(id: string): Promise<any | null> {
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
        },
        projects: {
          include: {
            project: {
              select: { id: true, name: true, color: true, status: true, description: true },
            },
          },
        },
        _count: {
          select: { members: true, projects: true },
        },
      },
    });

    return group;
  }

  /**
   * Create group
   */
  async createGroup(data: CreateGroupInput): Promise<any> {
    const group = await prisma.group.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        color: data.color || '#1890ff',
      },
      include: {
        _count: { select: { members: true, projects: true } },
      },
    });

    return group;
  }

  /**
   * Update group
   */
  async updateGroup(id: string, data: UpdateGroupInput): Promise<any | null> {
    const existing = await prisma.group.findUnique({ where: { id } });
    if (!existing) return null;

    const group = await prisma.group.update({
      where: { id },
      data,
      include: {
        _count: { select: { members: true, projects: true } },
      },
    });

    return group;
  }

  /**
   * Delete group
   */
  async deleteGroup(id: string): Promise<boolean> {
    const existing = await prisma.group.findUnique({ where: { id } });
    if (!existing) return false;

    await prisma.group.delete({ where: { id } });
    return true;
  }

  /**
   * Add member to group
   */
  async addMember(groupId: string, userId: string): Promise<any> {
    const member = await prisma.groupMember.create({
      data: { groupId, userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return member;
  }

  /**
   * Remove member from group
   */
  async removeMember(groupId: string, userId: string): Promise<boolean> {
    const existing = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    if (!existing) return false;

    await prisma.groupMember.delete({
      where: { groupId_userId: { groupId, userId } },
    });
    return true;
  }

  /**
   * Add project to group
   */
  async addProject(groupId: string, projectId: string): Promise<any> {
    const groupProject = await prisma.groupProject.create({
      data: { groupId, projectId },
      include: {
        project: { select: { id: true, name: true, color: true, status: true } },
      },
    });

    return groupProject;
  }

  /**
   * Remove project from group
   */
  async removeProject(groupId: string, projectId: string): Promise<boolean> {
    const existing = await prisma.groupProject.findUnique({
      where: { groupId_projectId: { groupId, projectId } },
    });
    if (!existing) return false;

    await prisma.groupProject.delete({
      where: { groupId_projectId: { groupId, projectId } },
    });
    return true;
  }
}

export default new GroupService();
