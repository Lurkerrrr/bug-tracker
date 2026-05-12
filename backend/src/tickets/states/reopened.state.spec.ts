import { BadRequestException } from '@nestjs/common';
import { ReopenedState } from './reopened.state';
import { InProgressState } from './in-progress.state';
import { ToDoState } from './todo.state';
import { BlockedOnHoldState } from './blocked-on-hold.state';
import { TicketStatus } from '../enums/ticket-status.enum';

const ctx = { status: TicketStatus.REOPENED };

describe('ReopenedState', () => {
    let state: ReopenedState;
    beforeEach(() => { state = new ReopenedState(); });

    it('should have correct status', () => {
        expect(state.getStatus()).toBe(TicketStatus.REOPENED);
    });

    it('should have correct display name', () => {
        expect(state.getDisplayName()).toBe('Reopened');
    });

    it('should transition to InProgress', () => {
        expect(state.startProgress(ctx)).toBeInstanceOf(InProgressState);
    });

    it('should transition to ToDo on moveToBacklog', () => {
        expect(state.moveToBacklog(ctx)).toBeInstanceOf(ToDoState);
    });

    it('should transition to BlockedOnHold', () => {
        expect(state.block(ctx)).toBeInstanceOf(BlockedOnHoldState);
    });

    it('should throw on passTesting', () => {
        expect(() => state.passTesting(ctx)).toThrow(BadRequestException);
    });

    it('should throw on acceptBusiness', () => {
        expect(() => state.acceptBusiness(ctx)).toThrow(BadRequestException);
    });
});