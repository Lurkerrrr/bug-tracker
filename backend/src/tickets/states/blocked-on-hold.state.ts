import { BaseTicketState } from './base-ticket.state';
import { ITicketState, TicketContext } from './ticket-state.interface';
import { TicketStatus } from '../enums/ticket-status.enum';

export class BlockedOnHoldState extends BaseTicketState {
    getStatus(): TicketStatus {
        return TicketStatus.BLOCKED_ON_HOLD;
    }

    getDisplayName(): string {
        return 'Blocked/On Hold';
    }

    unblock(_context: TicketContext): ITicketState {
        return new InProgressState();
    }

    moveToBacklog(_context: TicketContext): ITicketState {
        return new ToDoState();
    }
}

import { InProgressState } from './in-progress.state';
import { ToDoState } from './todo.state';