import { BadRequestException } from '@nestjs/common';
import { ToDoState } from './todo.state';
import { InProgressState } from './in-progress.state';
import { RejectedState } from './rejected.state';
import { BlockedOnHoldState } from './blocked-on-hold.state';
import { TicketStatus } from '../enums/ticket-status.enum';

const ctx = { status: TicketStatus.TO_DO };

describe('ToDoState', () => {
    let state: ToDoState;
    beforeEach(() => { state = new ToDoState(); });

    it('should have correct status', () => {
        expect(state.getStatus()).toBe(TicketStatus.TO_DO);
    });

    it('should have correct display name', () => {
        expect(state.getDisplayName()).toBe('To Do');
    });

    it('should transition to InProgress', () => {
        expect(state.startProgress(ctx)).toBeInstanceOf(InProgressState);
    });

    it('should transition to Rejected', () => {
        expect(state.reject(ctx)).toBeInstanceOf(RejectedState);
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

    it('should throw on archive', () => {
        expect(() => state.archive(ctx)).toThrow(BadRequestException);
    });
});