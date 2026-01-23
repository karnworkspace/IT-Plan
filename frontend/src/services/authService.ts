// Authentication Service
import apiClient from './api';

export interface LoginEmailRequest {
    email: string;
    password: string;
    remember?: boolean;
}

export interface LoginPinRequest {
    email: string;
    pin: string;
    rememberDevice?: boolean;
}

export interface SetupPinRequest {
    pin: string;
    confirmPin: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            pinSetAt?: string | null;
        };
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

class AuthService {
    // Login with email/password
    async loginWithEmail(data: LoginEmailRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        return response.data;
    }

    // Login with PIN
    async loginWithPin(data: LoginPinRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login-pin', data);
        return response.data;
    }

    // Setup PIN (first time)
    async setupPin(data: SetupPinRequest): Promise<ApiResponse<null>> {
        const response = await apiClient.post<ApiResponse<null>>('/auth/setup-pin', data);
        return response.data;
    }

    // Change PIN
    async changePin(currentPin: string, newPin: string, confirmNewPin: string): Promise<ApiResponse<null>> {
        const response = await apiClient.put<ApiResponse<null>>('/auth/change-pin', {
            currentPin,
            newPin,
            confirmNewPin,
        });
        return response.data;
    }

    // Request PIN reset
    async requestPinReset(email: string): Promise<ApiResponse<null>> {
        const response = await apiClient.post<ApiResponse<null>>('/auth/reset-pin', { email });
        return response.data;
    }

    // Confirm PIN reset
    async confirmPinReset(token: string, newPin: string, confirmNewPin: string): Promise<ApiResponse<null>> {
        const response = await apiClient.post<ApiResponse<null>>('/auth/reset-pin/confirm', {
            token,
            newPin,
            confirmNewPin,
        });
        return response.data;
    }

    // Refresh access token
    async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
        const response = await apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', {
            refreshToken,
        });
        return response.data.data!;
    }

    // Logout
    async logout(): Promise<void> {
        await apiClient.post('/auth/logout');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    // Get current user
    async getCurrentUser(): Promise<AuthResponse['data']['user']> {
        const response = await apiClient.get<ApiResponse<AuthResponse['data']['user']>>('/auth/me');
        return response.data.data!;
    }
}

export const authService = new AuthService();
