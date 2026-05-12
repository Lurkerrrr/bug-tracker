import { BadRequestException } from '@nestjs/common';
import { BlockedOnHoldState } from './blocked-on-hold.state';
import { InProgressState } from './in-progress.state';
import { ToDoState } from './todo.state';
import { TicketStatus } from '../enums/ticket-status.enum';

const ctx = { status: TicketStatus.BLOCKED_ON_HOLD };

describe('BlockedOnHoldState', () => {
    let state: BlockedOnHoldState;
    beforeEach(() => { state = new BlockedOnHoldState(); });

    it('should have correct status', () => {
        expect(state.getStatus()).toBe(TicketStatus.BLOCKED_ON_HOLD);
    });

    it('should have correct display name', () => {
        expect(state.getDisplayName()).toBe('Blocked/On Hold');
    });

    it('should transition to InProgress on unblock', () => {
        expect(state.unblock(ctx)).toBeInstanceOf(InProgressState);
    });

    it('should transition to ToDo on moveToBacklog', () => {
        expect(state.moveToBacklog(ctx)).toBeInstanceOf(ToDoState);
    });

    it('should throw on passTesting', () => {
        expect(() => state.passTesting(ctx)).toThrow(BadRequestException);
    });

    it('should throw on acceptBusiness', () => {
        expect(() => state.acceptBusiness(ctx)).toThrow(BadRequestException);
    });

    it('should throw on archive', () => {
        expect(() => state.archive(ctx)).toThrow(BadRequestException);
    });
});