import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const validateUUID = (...paramNames: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    for (const param of paramNames) {
      const value = req.params[param] as string | undefined;
      if (value && !UUID_REGEX.test(value)) {
        sendError(res, `Invalid ${param} format`, 400);
        return;
      }
    }
    next();
  };
};
