import { BaseTicketState } from './base-ticket.state';
import { ITicketState, TicketContext } from './ticket-state.interface';
import { TicketStatus } from '../enums/ticket-status.enum';
import { DoneState, ReopenedState, BlockedOnHoldState } from './index';

export class InTestState extends BaseTicketState {
    getStatus(): TicketStatus {
        return TicketStatus.IN_TEST;
    }

    getDisplayName(): string {
        return 'In Test';
    }

    passTesting(_context: TicketContext): ITicketState {
        return new DoneState();
    }

    failTesting(_context: TicketContext): ITicketState {
        return new ReopenedState();
    }

    block(_context: TicketContext): ITicketState {
        return new BlockedOnHoldState();
    }
}