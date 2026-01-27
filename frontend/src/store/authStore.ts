// Authentication Store using Zustand
import { create } from 'zustand';
import type { AuthResponse } from '../services/authService';
import { authService } from '../services/authService';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    pinSetAt?: string | null;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    loginWithEmail: (email: string, password: string, remember?: boolean) => Promise<void>;
    loginWithPin: (email: string, pin: string, rememberDevice?: boolean) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    setupPin: (pin: string, confirmPin: string) => Promise<void>;
    loadUser: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
    isLoading: false,
    error: null,

    register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            await authService.register({ email, password, name });
            set({ isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Registration failed';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    loginWithEmail: async (email, password, remember = false) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.loginWithEmail({ email, password, remember });
            console.log('AuthStore Login Response:', response);

            const { accessToken, refreshToken, user } = response.data;
            console.log('Destructured Token:', accessToken ? 'Yes' : 'No');

            // Save tokens
            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                console.log('Saved accessToken to localStorage');
            }
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

            set({
                user,
                accessToken,
                refreshToken,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Login failed';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    loginWithPin: async (email, pin, rememberDevice = false) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.loginWithPin({ email, pin, rememberDevice });

            const { accessToken, refreshToken, user } = response.data;

            // Save tokens
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            set({
                user,
                accessToken,
                refreshToken,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Login failed';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear state regardless of API call result
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        }
    },

    setupPin: async (pin, confirmPin) => {
        set({ isLoading: true, error: null });
        try {
            await authService.setupPin({ pin, confirmPin });

            // Update user.pinSetAt to prevent redirect loop
            const currentUser = get().user;
            if (currentUser) {
                set({
                    user: { ...currentUser, pinSetAt: new Date().toISOString() },
                    isLoading: false
                });
            } else {
                set({ isLoading: false });
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to setup PIN';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    loadUser: async () => {
        const { accessToken } = get();
        if (!accessToken) {
            set({ isAuthenticated: false });
            return;
        }

        set({ isLoading: true });
        try {
            const user = await authService.getCurrentUser();
            set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            // Token invalid, clear auth state
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    },

    clearError: () => set({ error: null }),
}));
