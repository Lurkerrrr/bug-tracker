import { BaseTicketState } from './base-ticket.state';
import { ITicketState, TicketContext } from './ticket-state.interface';
import { TicketStatus } from '../enums/ticket-status.enum';
import { ReadyForQAState, InProgressState, BlockedOnHoldState } from './index';

export class CodeReviewState extends BaseTicketState {
    getStatus(): TicketStatus {
        return TicketStatus.CODE_REVIEW;
    }

    getDisplayName(): string {
        return 'Code Review';
    }

    approveCodeReview(_context: TicketContext): ITicketState {
        return new ReadyForQAState();
    }

    startProgress(_context: TicketContext): ITicketState {
        return new InProgressState();
    }

    block(_context: TicketContext): ITicketState {
        return new BlockedOnHoldState();
    }
}