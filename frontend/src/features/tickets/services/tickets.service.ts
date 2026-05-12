import apiClient from '../../../api/api.client';
import type {
    Ticket,
    CreateTicketDto,
    UpdateTicketDto,
    TransitionTicketDto,
    LogTimeDto,
} from '../types/ticket.types';

export const ticketsService = {
    async getAll(): Promise<Ticket[]> {
        const response = await apiClient.get<Ticket[]>('/tickets');
        return response.data;
    },

    async getById(id: string): Promise<Ticket> {
        const response = await apiClient.get<Ticket>(`/tickets/${id}`);
        return response.data;
    },

    async create(dto: CreateTicketDto): Promise<Ticket> {
        const response = await apiClient.post<Ticket>('/tickets', dto);
        return response.data;
    },

    async update(id: string, dto: UpdateTicketDto): Promise<Ticket> {
        const response = await apiClient.put<Ticket>(`/tickets/${id}`, dto);
        return response.data;
    },

    async transition(id: string, dto: TransitionTicketDto): Promise<Ticket> {
        const response = await apiClient.patch<Ticket>(
            `/tickets/${id}/transition`,
            dto
        );
        return response.data;
    },

    async logTime(id: string, dto: LogTimeDto): Promise<Ticket> {
        const response = await apiClient.patch<Ticket>(
            `/tickets/${id}/log-time`,
            dto
        );
        return response.data;
    },

    async assignToMe(id: string): Promise<Ticket> {
        const response = await apiClient.patch<Ticket>(
            `/tickets/${id}/assign-to-me`
        );
        return response.data;
    },
};