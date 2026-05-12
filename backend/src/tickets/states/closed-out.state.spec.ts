import { BadRequestException } from '@nestjs/common';
import { ClosedOutState } from './closed-out.state';
import { TicketStatus } from '../enums/ticket-status.enum';

const ctx = { status: TicketStatus.CLOSED_OUT };

describe('ClosedOutState', () => {
    let state: ClosedOutState;
    beforeEach(() => { state = new ClosedOutState(); });

    it('should have correct status', () => {
        expect(state.getStatus()).toBe(TicketStatus.CLOSED_OUT);
    });

    it('should have correct display name', () => {
        expect(state.getDisplayName()).toBe('Closed out');
    });

    it('should throw on startProgress - terminal state', () => {
        expect(() => state.startProgress(ctx)).toThrow(BadRequestException);
    });

    it('should throw on passTesting - terminal state', () => {
        expect(() => state.passTesting(ctx)).toThrow(BadRequestException);
    });

    it('should throw on acceptBusiness - terminal state', () => {
        expect(() => state.acceptBusiness(ctx)).toThrow(BadRequestException);
    });

    it('should throw on reopen - terminal state', () => {
        expect(() => state.reopen(ctx)).toThrow(BadRequestException);
    });

    it('should throw on block - terminal state', () => {
        expect(() => state.block(ctx)).toThrow(BadRequestException);
    });
});