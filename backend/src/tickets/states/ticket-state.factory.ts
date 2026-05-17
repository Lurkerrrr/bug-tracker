import { TicketStatus } from '../enums/ticket-status.enum';
import { ITicketState } from './ticket-state.interface';
import { BadRequestException } from '@nestjs/common';
import {
    ToDoState,
    InProgressState,
    CodeReviewState,
    ReadyForQAState,
    InTestState,
    DoneState,
    ClosedState,
    ClosedOutState,
    RejectedState,
    BlockedOnHoldState,
    ReopenedState,
} from './index';

export class TicketStateFactory {
    static create(status: TicketStatus): ITicketState {
        switch (status) {
            case TicketStatus.TO_DO:
                return new ToDoState();
            case TicketStatus.IN_PROGRESS:
                return new InProgressState();
            case TicketStatus.CODE_REVIEW:
                return new CodeReviewState();
            case TicketStatus.READY_FOR_QA:
                return new ReadyForQAState();
            case TicketStatus.IN_TEST:
                return new InTestState();
            case TicketStatus.DONE:
                return new DoneState();
            case TicketStatus.CLOSED:
                return new ClosedState();
            case TicketStatus.CLOSED_OUT:
                return new ClosedOutState();
            case TicketStatus.REJECTED:
                return new RejectedState();
            case TicketStatus.BLOCKED_ON_HOLD:
                return new BlockedOnHoldState();
            case TicketStatus.REOPENED:
                return new ReopenedState();
            default:
                throw new BadRequestException(`Unknown ticket status: "${status}"`);
        }
    }
}