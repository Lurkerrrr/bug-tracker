import apiClient from '../../../api/api.client';
import type { LoginDto, RegisterDto, AuthResponse } from '../types/auth.types';

export const authService = {
    async login(dto: LoginDto): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', dto);
        return response.data;
    },

    async register(dto: RegisterDto): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', dto);
        return response.data;
    },

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    },

    getToken(): string | null {
        return localStorage.getItem('access_token');
    },

    saveSession(data: AuthResponse): void {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('access_token');
    },
};