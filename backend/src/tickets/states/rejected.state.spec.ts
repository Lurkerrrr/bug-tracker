import { BadRequestException } from '@nestjs/common';
import { RejectedState } from './rejected.state';
import { ClosedState } from './closed.state';
import { TicketStatus } from '../enums/ticket-status.enum';

const ctx = { status: TicketStatus.REJECTED };

describe('RejectedState', () => {
    let state: RejectedState;
    beforeEach(() => { state = new RejectedState(); });

    it('should have correct status', () => {
        expect(state.getStatus()).toBe(TicketStatus.REJECTED);
    });

    it('should have correct display name', () => {
        expect(state.getDisplayName()).toBe('Rejected');
    });

    it('should transition to Closed', () => {
        expect(state.acceptBusiness(ctx)).toBeInstanceOf(ClosedState);
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