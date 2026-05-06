import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import attachmentService from '../services/attachment.service';
import { sendSuccess, sendError } from '../utils/response';
import { extractUserId } from '../utils/auth';
import { canAccessTask } from '../services/task.service';
import prisma from '../config/database';

/** Remove uploaded files from disk (cleanup on auth failure) */
function cleanupFiles(files: Express.Multer.File[] | undefined) {
  if (!files) return;
  for (const f of files) {
    fs.unlink(f.path, () => {});
  }
}

/**
 * Upload images for a comment
 */
export const uploadCommentImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params as { commentId: string };
    const userId = extractUserId(req);
    const files = req.files as Express.Multer.File[];

    // Check access via comment → task (files already on disk from multer, cleanup if unauthorized)
    const comment = await prisma.comment.findUnique({ where: { id: commentId }, select: { taskId: true } });
    if (!comment || !(await canAccessTask(userId, comment.taskId))) {
      cleanupFiles(files);
      return sendError(res, 'Comment not found', 404);
    }

    if (!files || files.length === 0) {
      return sendError(res, 'No files uploaded', 400);
    }

    const attachments = [];
    for (const file of files) {
      const attachment = await attachmentService.createAttachment({
        commentId,
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      });
      attachments.push(attachment);
    }

    return sendSuccess(res, { attachments }, undefined, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get attachments for a comment
 */
export const getCommentAttachments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params as { commentId: string };
    const userId = extractUserId(req);

    const comment = await prisma.comment.findUnique({ where: { id: commentId }, select: { taskId: true } });
    if (!comment || !(await canAccessTask(userId, comment.taskId))) {
      return sendError(res, 'Comment not found', 404);
    }

    const attachments = await attachmentService.getCommentAttachments(commentId);
    return sendSuccess(res, { attachments });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete attachment
 */
export const deleteAttachment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const userId = extractUserId(req);

    const deleted = await attachmentService.deleteAttachment(id, userId);
    if (!deleted) {
      return sendError(res, 'Attachment not found', 404);
    }
    return sendSuccess(res, { message: 'Attachment deleted' });
  } catch (error) {
    next(error);
  }
};
