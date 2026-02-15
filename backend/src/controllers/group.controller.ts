import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import groupService from '../services/group.service';
import { GROUP_TYPES } from '../constants';

export const getGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.query;
    const groups = await groupService.getAllGroups(type as string | undefined);
    return sendSuccess(res, { groups });
  } catch (error) {
    next(error);
  }
};

export const getGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const group = await groupService.getGroupById(id);
    if (!group) return sendError(res, 'Group not found', 404);
    return sendSuccess(res, { group });
  } catch (error) {
    next(error);
  }
};

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, type, color } = req.body;

    if (!name || name.trim().length === 0) {
      return sendError(res, 'Group name is required', 400);
    }

    if (type && !(GROUP_TYPES as readonly string[]).includes(type)) {
      return sendError(res, 'Invalid group type', 400);
    }

    const group = await groupService.createGroup({
      name: name.trim(),
      description: description?.trim(),
      type: type || 'USER_GROUP',
      color,
    });

    return sendSuccess(res, { group }, undefined, 201);
  } catch (error) {
    next(error);
  }
};

export const updateGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const { name, description, color } = req.body;

    if (name !== undefined && name.trim().length === 0) {
      return sendError(res, 'Group name cannot be empty', 400);
    }

    const group = await groupService.updateGroup(id, {
      name: name?.trim(),
      description: description?.trim(),
      color,
    });

    if (!group) return sendError(res, 'Group not found', 404);
    return sendSuccess(res, { group });
  } catch (error) {
    next(error);
  }
};

export const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const deleted = await groupService.deleteGroup(id);
    if (!deleted) return sendError(res, 'Group not found', 404);
    return sendSuccess(res, { message: 'Group deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addGroupMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const { userId } = req.body;

    if (!userId) return sendError(res, 'userId is required', 400);

    const member = await groupService.addMember(id, userId);
    return sendSuccess(res, { member }, undefined, 201);
  } catch (error) {
    next(error);
  }
};

export const removeGroupMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, userId } = req.params as { id: string; userId: string };
    const removed = await groupService.removeMember(id, userId);
    if (!removed) return sendError(res, 'Member not found in group', 404);
    return sendSuccess(res, { message: 'Member removed' });
  } catch (error) {
    next(error);
  }
};

export const addGroupProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const { projectId } = req.body;

    if (!projectId) return sendError(res, 'projectId is required', 400);

    const groupProject = await groupService.addProject(id, projectId);
    return sendSuccess(res, { groupProject }, undefined, 201);
  } catch (error) {
    next(error);
  }
};

export const removeGroupProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, projectId } = req.params as { id: string; projectId: string };
    const removed = await groupService.removeProject(id, projectId);
    if (!removed) return sendError(res, 'Project not found in group', 404);
    return sendSuccess(res, { message: 'Project removed from group' });
  } catch (error) {
    next(error);
  }
};
