import { Request } from 'express';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface PinLoginRequest {
    email: string;
    pin: string;
}

export interface SetupPinRequest {
    pin: string;
    confirmPin: string;
}

export interface ChangePinRequest {
    currentPin: string;
    newPin: string;
    confirmNewPin: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
