import { BaseTicketState } from './base-ticket.state';
import { TicketStatus } from '../enums/ticket-status.enum';

export class ClosedOutState extends BaseTicketState {
    getStatus(): TicketStatus {
        return TicketStatus.CLOSED_OUT;
    }

    getDisplayName(): string {
        return 'Closed out';
    }

    // Terminal state - no transitions allowed
}