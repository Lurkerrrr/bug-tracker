import { BaseTicketState } from './base-ticket.state';
import { ITicketState, TicketContext } from './ticket-state.interface';
import { TicketStatus } from '../enums/ticket-status.enum';

export class ReopenedState extends BaseTicketState {
    getStatus(): TicketStatus {
        return TicketStatus.REOPENED;
    }

    getDisplayName(): string {
        return 'Reopened';
    }

    startProgress(_context: TicketContext): ITicketState {
        return new InProgressState();
    }

    moveToBacklog(_context: TicketContext): ITicketState {
        return new ToDoState();
    }

    block(_context: TicketContext): ITicketState {
        return new BlockedOnHoldState();
    }
}

import { InProgressState } from './in-progress.state';
import { ToDoState } from './todo.state';
import { BlockedOnHoldState } from './blocked-on-hold.state';