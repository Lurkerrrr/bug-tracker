import { TicketPriority, TicketType } from '../types/ticket.types';

// Single source of truth for priority → badge variant mapping
export const PRIORITY_VARIANT: Record<TicketPriority, 'danger' | 'warning' | 'success' | 'default'> = {
    [TicketPriority.CRITICAL]: 'danger',
    [TicketPriority.HIGH]: 'danger',
    [TicketPriority.MEDIUM]: 'warning',
    [TicketPriority.LOW]: 'success',
};

// Single source of truth for ticket type → icon mapping
export const TYPE_ICON: Record<TicketType, string> = {
    [TicketType.BUG]: '🐛',
    [TicketType.TASK]: '✅',
    [TicketType.EPIC]: '⚡',
};