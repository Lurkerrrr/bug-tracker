import apiClient from '../../../api/api.client';
import { User } from '../types/user.types';

export const usersService = {
    async getAll(): Promise<User[]> {
        const response = await apiClient.get<User[]>('/users');
        return response.data;
    },

    async getTeam(): Promise<User[]> {
        const response = await apiClient.get<User[]>('/users/team');
        return response.data;
    },
};
