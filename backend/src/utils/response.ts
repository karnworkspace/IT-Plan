import { Response } from 'express';
import { ApiResponse } from '../types';

/**
 * Send success response
 */
export const sendSuccess = <T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = 200
): Response => {
    const response: ApiResponse<T> = {
        success: true,
        message,
        data,
    };
    return res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
    res: Response,
    error: string,
    statusCode: number = 400
): Response => {
    const response: ApiResponse = {
        success: false,
        error,
    };
    return res.status(statusCode).json(response);
};

/**
 * Calculate pagination metadata
 */
export const calculatePagination = (
    page: number = 1,
    limit: number = 10,
    total: number
) => {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
    };
};
