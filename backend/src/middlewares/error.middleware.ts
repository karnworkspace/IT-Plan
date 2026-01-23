import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

/**
 * Global error handler middleware
 */
export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error('Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    sendError(res, message, statusCode);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    sendError(res, `Route ${req.originalUrl} not found`, 404);
};
