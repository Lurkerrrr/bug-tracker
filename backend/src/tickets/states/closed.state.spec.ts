import { BadRequestException } from '@nestjs/common';
import { ClosedState } from './closed.state';
import { ClosedOutState } from './closed-out.state';
import { ReopenedState } from './reopened.state';
import { TicketStatus } from '../enums/ticket-status.enum';

const ctx = { status: TicketStatus.CLOSED };

describe('ClosedState', () => {
    let state: ClosedState;
    beforeEach(() => { state = new ClosedState(); });

    it('should have correct status', () => {
        expect(state.getStatus()).toBe(TicketStatus.CLOSED);
    });

    it('should have correct display name', () => {
        expect(state.getDisplayName()).toBe('Closed');
    });

    it('should transition to ClosedOut', () => {
        expect(state.archive(ctx)).toBeInstanceOf(ClosedOutState);
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
});