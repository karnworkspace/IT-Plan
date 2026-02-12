import { RequestHandler } from 'express';

/**
 * Rate limiting disabled - internal use only
 * Middleware pass-through (no-op)
 */
const noOp: RequestHandler = (_req, _res, next) => next();

export const authLimiter = noOp;
export const apiLimiter = noOp;
