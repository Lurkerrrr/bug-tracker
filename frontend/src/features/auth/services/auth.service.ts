import apiClient from '../../../api/api.client';
import type { LoginDto, RegisterDto } from '../types/auth.types';
import type { User } from '../types/auth.types';

export const authService = {
    async login(dto: LoginDto): Promise<User> {
        // Tokens are set as httpOnly cookies by the server automatically
        const response = await apiClient.post<{ user: User }>('/auth/login', dto);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
    },

    async register(dto: RegisterDto): Promise<User> {
        const response = await apiClient.post<{ user: User }>('/auth/register', dto);
        return response.data.user;
    },

    async logout(): Promise<void> {
        try {
            // Tell server to invalidate refresh token and clear cookies
            await apiClient.post('/auth/logout');
        } finally {
            localStorage.removeItem('user');
        }
    },

    getCurrentUser(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated(): boolean {
        // httpOnly cookies are not readable by JS so we use localStorage user as indicator
        return !!localStorage.getItem('user');
    },
};