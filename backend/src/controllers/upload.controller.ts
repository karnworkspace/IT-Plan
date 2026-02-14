import { Request, Response, NextFunction } from 'express';
import attachmentService from '../services/attachment.service';
import { sendSuccess, sendError } from '../utils/response';
import { extractUserId } from '../utils/auth';

/**
 * Upload images for a comment
 */
export const uploadCommentImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params as { commentId: string };
    const files = req.files as Express.Multer.File[];

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
