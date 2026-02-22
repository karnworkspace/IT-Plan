import { Request, Response, NextFunction } from 'express';
import commentService, {
  CreateCommentInput,
  UpdateCommentInput,
} from '../services/comment.service';
import { sendSuccess, sendError } from '../utils/response';
import { extractUserId } from '../utils/auth';

/**
 * Get all comments for a task
 */
export const getTaskComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.params as { taskId: string };

    const comments = await commentService.getTaskComments(taskId);
    return sendSuccess(res, { comments }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Get comment by ID
 */
export const getComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };

    const comment = await commentService.getCommentById(id);

    if (!comment) {
      return sendError(res, 'Comment not found', 404);
    }

    return sendSuccess(res, { comment }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Create new comment
 */
export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.params as { taskId: string };
    const userId = extractUserId(req);

    // Validation
    const { content } = req.body;

    if (!content) {
      return sendError(res, 'Content is required', 400);
    }

    if (content.length < 1) {
      return sendError(res, 'Content cannot be empty', 400);
    }

    if (content.length > 1000) {
      return sendError(res, 'Content must be less than 1000 characters', 400);
    }

    const { parentCommentId } = req.body;

    const commentData: CreateCommentInput = {
      taskId,
      userId,
      content,
      parentCommentId: parentCommentId || undefined,
    };

    const comment = await commentService.createComment(commentData);
    return sendSuccess(res, { comment }, undefined, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update comment
 */
export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const userId = extractUserId(req);

    // Validation
    const { content } = req.body;

    if (content) {
      if (content.length < 1) {
        return sendError(res, 'Content cannot be empty', 400);
      }

      if (content.length > 1000) {
        return sendError(res, 'Content must be less than 1000 characters', 400);
      }
    }

    const commentData: UpdateCommentInput = {
      content,
    };

    const comment = await commentService.updateComment(id, commentData, userId);

    return sendSuccess(res, { comment }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete comment
 */
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const userId = extractUserId(req);

    const deleted = await commentService.deleteComment(id, userId);

    if (!deleted) {
      return sendError(res, 'Comment not found', 404);
    }

    return sendSuccess(res, { message: 'Comment deleted successfully' }, '200');
  } catch (error) {
    next(error);
  }
};

/**
 * Get comments by user
 */
export const getUserComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = extractUserId(req);

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const comments = await commentService.getUserComments(userId, limit);
    return sendSuccess(res, { comments }, '200');
  } catch (error) {
    next(error);
  }
};
