import { BaseTicketState } from './base-ticket.state';
import { ITicketState, TicketContext } from './ticket-state.interface';
import { TicketStatus } from '../enums/ticket-status.enum';

export class RejectedState extends BaseTicketState {
    getStatus(): TicketStatus {
        return TicketStatus.REJECTED;
    }

    getDisplayName(): string {
        return 'Rejected';
    }

    acceptBusiness(_context: TicketContext): ITicketState {
        return new ClosedState();
    }
}

import { ClosedState } from './closed.state';