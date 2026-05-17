import apiClient from '../../../api/api.client';
import type { LoginDto, RegisterDto } from '../types/auth.types';
import type { User } from '../types/auth.types';

export const authService = {
    async login(dto: LoginDto): Promise<User> {
        // Tokens are set as httpOnly cookies by the server automatically
        const response = await apiClient.post<{ user: User }>('/auth/login', dto);
        return response.data.user;
    },

    async me(): Promise<User> {
        const response = await apiClient.get<{ user: User }>('/auth/me');
        return response.data.user;
    },

    async register(dto: RegisterDto): Promise<User> {
        const response = await apiClient.post<{ user: User }>('/auth/register', dto);
        return response.data.user;
    },

    async logout(): Promise<void> {
        await apiClient.post('/auth/logout');
    },
};