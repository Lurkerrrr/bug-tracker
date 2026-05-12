import { BadRequestException } from '@nestjs/common';
import { DoneState } from './done.state';
import { ClosedState } from './closed.state';
import { ReopenedState } from './reopened.state';
import { TicketStatus } from '../enums/ticket-status.enum';

const ctx = { status: TicketStatus.DONE };

describe('DoneState', () => {
    let state: DoneState;
    beforeEach(() => { state = new DoneState(); });

    it('should have correct status', () => {
        expect(state.getStatus()).toBe(TicketStatus.DONE);
    });

    it('should have correct display name', () => {
        expect(state.getDisplayName()).toBe('Done');
    });

    it('should transition to Closed', () => {
        expect(state.acceptBusiness(ctx)).toBeInstanceOf(ClosedState);
    });

    it('should transition to Reopened', () => {
        expect(state.reopen(ctx)).toBeInstanceOf(ReopenedState);
    });

    it('should throw on startProgress', () => {
        expect(() => state.startProgress(ctx)).toThrow(BadRequestException);
    });

    it('should throw on passTesting', () => {
        expect(() => state.passTesting(ctx)).toThrow(BadRequestException);
    });

    it('should throw on archive', () => {
        expect(() => state.archive(ctx)).toThrow(BadRequestException);
    });
});