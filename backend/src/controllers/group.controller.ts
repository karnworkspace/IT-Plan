import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import groupService from '../services/group.service';

export const getGroups = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { type } = req.query;
    const groups = await groupService.getAllGroups(type as string | undefined);
    return sendSuccess(res, { groups });
  } catch (error) {
    return sendError(res, 'Failed to fetch groups', 500);
  }
};

export const getGroup = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const group = await groupService.getGroupById(id);
    if (!group) return sendError(res, 'Group not found', 404);
    return sendSuccess(res, { group });
  } catch (error) {
    return sendError(res, 'Failed to fetch group', 500);
  }
};

export const createGroup = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { name, description, type, color } = req.body;

    if (!name || name.trim().length === 0) {
      return sendError(res, 'Group name is required', 400);
    }

    const validTypes = ['USER_GROUP', 'PROJECT_GROUP'];
    if (type && !validTypes.includes(type)) {
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
    return sendError(res, 'Failed to create group', 500);
  }
};

export const updateGroup = async (req: Request, res: Response, _next: NextFunction) => {
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
    return sendError(res, 'Failed to update group', 500);
  }
};

export const deleteGroup = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const deleted = await groupService.deleteGroup(id);
    if (!deleted) return sendError(res, 'Group not found', 404);
    return sendSuccess(res, { message: 'Group deleted successfully' });
  } catch (error) {
    return sendError(res, 'Failed to delete group', 500);
  }
};

export const addGroupMember = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const { userId } = req.body;

    if (!userId) return sendError(res, 'userId is required', 400);

    const member = await groupService.addMember(id, userId);
    return sendSuccess(res, { member }, undefined, 201);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return sendError(res, 'User is already a member of this group', 400);
    }
    return sendError(res, 'Failed to add member', 500);
  }
};

export const removeGroupMember = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { id, userId } = req.params as { id: string; userId: string };
    const removed = await groupService.removeMember(id, userId);
    if (!removed) return sendError(res, 'Member not found in group', 404);
    return sendSuccess(res, { message: 'Member removed' });
  } catch (error) {
    return sendError(res, 'Failed to remove member', 500);
  }
};

export const addGroupProject = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const { projectId } = req.body;

    if (!projectId) return sendError(res, 'projectId is required', 400);

    const groupProject = await groupService.addProject(id, projectId);
    return sendSuccess(res, { groupProject }, undefined, 201);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return sendError(res, 'Project is already in this group', 400);
    }
    return sendError(res, 'Failed to add project', 500);
  }
};

export const removeGroupProject = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { id, projectId } = req.params as { id: string; projectId: string };
    const removed = await groupService.removeProject(id, projectId);
    if (!removed) return sendError(res, 'Project not found in group', 404);
    return sendSuccess(res, { message: 'Project removed from group' });
  } catch (error) {
    return sendError(res, 'Failed to remove project', 500);
  }
};
