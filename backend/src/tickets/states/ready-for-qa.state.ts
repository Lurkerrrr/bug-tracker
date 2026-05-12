import { BaseTicketState } from './base-ticket.state';
import { ITicketState, TicketContext } from './ticket-state.interface';
import { TicketStatus } from '../enums/ticket-status.enum';
import { InTestState, BlockedOnHoldState } from './index';

export class ReadyForQAState extends BaseTicketState {
    getStatus(): TicketStatus {
        return TicketStatus.READY_FOR_QA;
    }

    getDisplayName(): string {
        return 'Ready for QA';
    }

    startTesting(_context: TicketContext): ITicketState {
        return new InTestState();
    }

    block(_context: TicketContext): ITicketState {
        return new BlockedOnHoldState();
    }
}