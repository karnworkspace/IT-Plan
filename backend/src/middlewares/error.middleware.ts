import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { AppError } from '../utils/AppError';

/**
 * Global error handler middleware
 */
export const errorHandler = (
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error('Error:', err.message);

    // AppError — use statusCode from error
    if (err instanceof AppError) {
        sendError(res, err.message, err.statusCode);
        return;
    }

    // Prisma known errors
    if ('code' in err && (err as Record<string, unknown>).code === 'P2002') {
        sendError(res, 'Duplicate entry', 409);
        return;
    }
    if ('code' in err && (err as Record<string, unknown>).code === 'P2025') {
        sendError(res, 'Record not found', 404);
        return;
    }

    // Unknown errors
    sendError(res, 'Internal server error', 500);
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
