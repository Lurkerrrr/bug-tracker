import { BadRequestException } from '@nestjs/common';
import { ReadyForQAState } from './ready-for-qa.state';
import { InTestState } from './in-test.state';
import { BlockedOnHoldState } from './blocked-on-hold.state';
import { TicketStatus } from '../enums/ticket-status.enum';

const ctx = { status: TicketStatus.READY_FOR_QA };

describe('ReadyForQAState', () => {
    let state: ReadyForQAState;
    beforeEach(() => { state = new ReadyForQAState(); });

    it('should have correct status', () => {
        expect(state.getStatus()).toBe(TicketStatus.READY_FOR_QA);
    });

    it('should have correct display name', () => {
        expect(state.getDisplayName()).toBe('Ready for QA');
    });

    it('should transition to InTest', () => {
        expect(state.startTesting(ctx)).toBeInstanceOf(InTestState);
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