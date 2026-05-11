import { BaseTicketState } from './base-ticket.state';
import { ITicketState, TicketContext } from './ticket-state.interface';
import { TicketStatus } from '../enums/ticket-status.enum';
import { InProgressState, RejectedState, BlockedOnHoldState } from './index';

export class ToDoState extends BaseTicketState {
    getStatus(): TicketStatus {
        return TicketStatus.TO_DO;
    }

    getDisplayName(): string {
        return 'To Do';
    }

    startProgress(_context: TicketContext): ITicketState {
        return new InProgressState();
    }

    reject(_context: TicketContext): ITicketState {
        return new RejectedState();
    }

    block(_context: TicketContext): ITicketState {
        return new BlockedOnHoldState();
    }
}