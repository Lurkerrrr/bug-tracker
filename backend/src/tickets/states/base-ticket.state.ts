import { BadRequestException } from '@nestjs/common';
import { ITicketState, TicketContext } from './ticket-state.interface';
import { TicketStatus } from '../enums/ticket-status.enum';

export abstract class BaseTicketState implements ITicketState {
    abstract getStatus(): TicketStatus;
    abstract getDisplayName(): string;

    protected illegalTransition(to: string): never {
        throw new BadRequestException(
            `Cannot transition from "${this.getDisplayName()}" to "${to}"`,
        );
    }

    startProgress(_context: TicketContext): ITicketState {
        return this.illegalTransition('In Progress');
    }

    sendToCodeReview(_context: TicketContext): ITicketState {
        return this.illegalTransition('Code Review');
    }

    approveCodeReview(_context: TicketContext): ITicketState {
        return this.illegalTransition('Ready for QA');
    }

    startTesting(_context: TicketContext): ITicketState {
        return this.illegalTransition('In Test');
    }

    passTesting(_context: TicketContext): ITicketState {
        return this.illegalTransition('Done');
    }

    failTesting(_context: TicketContext): ITicketState {
        return this.illegalTransition('Reopened');
    }

    acceptBusiness(_context: TicketContext): ITicketState {
        return this.illegalTransition('Closed');
    }

    archive(_context: TicketContext): ITicketState {
        return this.illegalTransition('Closed out');
    }

    block(_context: TicketContext): ITicketState {
        return this.illegalTransition('Blocked/On Hold');
    }

    unblock(_context: TicketContext): ITicketState {
        return this.illegalTransition('In Progress');
    }

    reject(_context: TicketContext): ITicketState {
        return this.illegalTransition('Rejected');
    }

    reopen(_context: TicketContext): ITicketState {
        return this.illegalTransition('Reopened');
    }

    moveToBacklog(_context: TicketContext): ITicketState {
        return this.illegalTransition('To Do');
    }
}