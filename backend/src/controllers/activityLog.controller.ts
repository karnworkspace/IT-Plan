import { Request, Response, NextFunction } from 'express';
import activityLogService from '../services/activityLog.service';
import { sendSuccess, sendError } from '../utils/response';

export async function getProjectActivities(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId } = req.params;
    const { limit = '50', offset = '0' } = req.query;

    const activities = await activityLogService.getProjectActivities(
      String(projectId),
      Number(limit),
      Number(offset)
    );

    sendSuccess(res, { activities });
  } catch (error) {
    next(error);
  }
}

export async function getTaskActivities(req: Request, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    const { limit = '50', offset = '0' } = req.query;

    const activities = await activityLogService.getTaskActivities(
      String(taskId),
      Number(limit),
      Number(offset)
    );

    sendSuccess(res, { activities });
  } catch (error) {
    next(error);
  }
}

export async function getUserActivities(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const { limit = '50', offset = '0' } = req.query;

    const activities = await activityLogService.getUserActivities(
      String(userId),
      Number(limit),
      Number(offset)
    );

    sendSuccess(res, { activities });
  } catch (error) {
    next(error);
  }
}

export async function getRecentActivities(req: Request, res: Response, next: NextFunction) {
  try {
    const { limit = '20', offset = '0' } = req.query;

    const activities = await activityLogService.getRecentActivities(
      Number(limit),
      Number(offset)
    );

    sendSuccess(res, { activities });
  } catch (error) {
    next(error);
  }
}
