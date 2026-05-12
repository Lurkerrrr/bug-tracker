import { BaseTicketState } from './base-ticket.state';
import { ITicketState, TicketContext } from './ticket-state.interface';
import { TicketStatus } from '../enums/ticket-status.enum';
import { ClosedOutState, ReopenedState } from './index';

export class ClosedState extends BaseTicketState {
    getStatus(): TicketStatus {
        return TicketStatus.CLOSED;
    }

    getDisplayName(): string {
        return 'Closed';
    }

    archive(_context: TicketContext): ITicketState {
        return new ClosedOutState();
    }

    reopen(_context: TicketContext): ITicketState {
        return new ReopenedState();
    }
}