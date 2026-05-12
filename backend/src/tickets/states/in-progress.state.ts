import { BaseTicketState } from './base-ticket.state';
import { ITicketState, TicketContext } from './ticket-state.interface';
import { TicketStatus } from '../enums/ticket-status.enum';
import { CodeReviewState, BlockedOnHoldState } from './index';

export class InProgressState extends BaseTicketState {
    getStatus(): TicketStatus {
        return TicketStatus.IN_PROGRESS;
    }

    getDisplayName(): string {
        return 'In Progress';
    }

    sendToCodeReview(_context: TicketContext): ITicketState {
        return new CodeReviewState();
    }

    block(_context: TicketContext): ITicketState {
        return new BlockedOnHoldState();
    }
}