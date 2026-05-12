import { BadRequestException } from '@nestjs/common';
import { InTestState } from './in-test.state';
import { DoneState } from './done.state';
import { ReopenedState } from './reopened.state';
import { BlockedOnHoldState } from './blocked-on-hold.state';
import { TicketStatus } from '../enums/ticket-status.enum';

const ctx = { status: TicketStatus.IN_TEST };

describe('InTestState', () => {
    let state: InTestState;
    beforeEach(() => { state = new InTestState(); });

    it('should have correct status', () => {
        expect(state.getStatus()).toBe(TicketStatus.IN_TEST);
    });

    it('should have correct display name', () => {
        expect(state.getDisplayName()).toBe('In Test');
    });

    it('should transition to Done on pass', () => {
        expect(state.passTesting(ctx)).toBeInstanceOf(DoneState);
    });

    it('should transition to Reopened on fail', () => {
        expect(state.failTesting(ctx)).toBeInstanceOf(ReopenedState);
    });

    it('should transition to BlockedOnHold', () => {
        expect(state.block(ctx)).toBeInstanceOf(BlockedOnHoldState);
    });

    it('should throw on acceptBusiness', () => {
        expect(() => state.acceptBusiness(ctx)).toThrow(BadRequestException);
    });

    it('should throw on archive', () => {
        expect(() => state.archive(ctx)).toThrow(BadRequestException);
    });
});