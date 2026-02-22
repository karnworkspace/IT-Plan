import prisma from '../config/database';

export class TagService {
  async getAllTags() {
    return await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { taskTags: true } },
      },
    });
  }

  async getTagById(id: string) {
    return await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: { select: { taskTags: true } },
      },
    });
  }

  async createTag(data: { name: string; color?: string }) {
    const existing = await prisma.tag.findUnique({
      where: { name: data.name },
    });
    if (existing) {
      throw new Error('Tag name already exists');
    }

    return await prisma.tag.create({
      data: {
        name: data.name,
        color: data.color || '#3B82F6',
      },
    });
  }

  async updateTag(id: string, data: { name?: string; color?: string }) {
    const tag = await prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new Error('Tag not found');
    }

    if (data.name && data.name !== tag.name) {
      const existing = await prisma.tag.findUnique({
        where: { name: data.name },
      });
      if (existing) {
        throw new Error('Tag name already exists');
      }
    }

    return await prisma.tag.update({
      where: { id },
      data,
    });
  }

  async deleteTag(id: string) {
    const tag = await prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new Error('Tag not found');
    }

    await prisma.tag.delete({ where: { id } });
    return true;
  }
}

export default new TagService();
