export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const notFound = (entity: string) => new AppError(`${entity} not found`, 404);
export const forbidden = (message: string) => new AppError(message, 403);
export const unauthorized = (message: string) => new AppError(message, 401);
export const badRequest = (message: string) => new AppError(message, 400);
