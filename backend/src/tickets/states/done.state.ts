import { BaseTicketState } from './base-ticket.state';
import { ITicketState, TicketContext } from './ticket-state.interface';
import { TicketStatus } from '../enums/ticket-status.enum';
import { ClosedState, ReopenedState } from './index';

export class DoneState extends BaseTicketState {
    getStatus(): TicketStatus {
        return TicketStatus.DONE;
    }

    getDisplayName(): string {
        return 'Done';
    }

    acceptBusiness(_context: TicketContext): ITicketState {
        return new ClosedState();
    }

    reopen(_context: TicketContext): ITicketState {
        return new ReopenedState();
    }
}