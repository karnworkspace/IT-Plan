import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export interface CreateAttachmentInput {
  commentId: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
}

export class AttachmentService {
  /**
   * Create attachment record
   */
  async createAttachment(data: CreateAttachmentInput) {
    return prisma.attachment.create({
      data: {
        commentId: data.commentId,
        filename: data.filename,
        path: data.path,
        mimetype: data.mimetype,
        size: data.size,
      },
    });
  }

  /**
   * Create multiple attachments for a comment
   */
  async createAttachments(commentId: string, files: CreateAttachmentInput[]) {
    const results = [];
    for (const f of files) {
      const attachment = await prisma.attachment.create({
        data: {
          commentId,
          filename: f.filename,
          path: f.path,
          mimetype: f.mimetype,
          size: f.size,
        },
      });
      results.push(attachment);
    }
    return results;
  }

  /**
   * Get attachments for a comment
   */
  async getCommentAttachments(commentId: string) {
    return prisma.attachment.findMany({
      where: { commentId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Delete attachment by ID
   */
  async deleteAttachment(id: string, userId: string): Promise<boolean> {
    const attachment = await prisma.attachment.findUnique({
      where: { id },
      include: {
        comment: {
          select: { userId: true },
        },
      },
    });

    if (!attachment) return false;

    // Only comment author can delete attachment
    if (attachment.comment.userId !== userId) {
      throw new Error('Permission denied');
    }

    // Delete file from disk
    const filePath = path.resolve(attachment.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.attachment.delete({ where: { id } });
    return true;
  }
}

export default new AttachmentService();
