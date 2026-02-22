import { Response } from 'express';
import { AuthRequest } from '../types';
import * as userService from '../services/user.service';
import { sendSuccess, sendError } from '../utils/response';

export const getUsersList = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await userService.getUsersList();
    sendSuccess(res, { users });
  } catch (error) {
    sendError(res, 'Failed to fetch users list', 500);
  }
};

export const getUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    sendSuccess(res, { users });
  } catch (error) {
    sendError(res, 'Failed to fetch users', 500);
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, email, role } = req.body;
    const user = await userService.updateUser(id, { name, email, role });
    sendSuccess(res, { user }, 'User updated');
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to update user';
    sendError(res, msg, msg === 'User not found' ? 404 : 400);
  }
};

export const resetUserPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      sendError(res, 'Password must be at least 6 characters');
      return;
    }
    await userService.resetPassword(id, newPassword);
    sendSuccess(res, null, 'Password reset successfully');
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to reset password';
    sendError(res, msg, msg === 'User not found' ? 404 : 400);
  }
};
