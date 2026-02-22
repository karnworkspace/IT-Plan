import { Request, Response, NextFunction } from 'express';
import tagService from '../services/tag.service';
import { sendSuccess, sendError } from '../utils/response';

export async function getAllTags(_req: Request, res: Response, next: NextFunction) {
  try {
    const tags = await tagService.getAllTags();
    sendSuccess(res, { tags });
  } catch (error) {
    next(error);
  }
}

export async function createTag(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, color } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return sendError(res, 'Tag name is required');
    }

    const tag = await tagService.createTag({ name: name.trim(), color });
    sendSuccess(res, { tag }, 'Tag created', 201);
  } catch (error: any) {
    if (error.message === 'Tag name already exists') {
      return sendError(res, error.message, 409);
    }
    next(error);
  }
}

export async function updateTag(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const tag = await tagService.updateTag(String(id), {
      name: name?.trim(),
      color,
    });
    sendSuccess(res, { tag });
  } catch (error: any) {
    if (error.message === 'Tag not found') {
      return sendError(res, error.message, 404);
    }
    if (error.message === 'Tag name already exists') {
      return sendError(res, error.message, 409);
    }
    next(error);
  }
}

export async function deleteTag(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await tagService.deleteTag(String(id));
    sendSuccess(res, null, 'Tag deleted');
  } catch (error: any) {
    if (error.message === 'Tag not found') {
      return sendError(res, error.message, 404);
    }
    next(error);
  }
}
