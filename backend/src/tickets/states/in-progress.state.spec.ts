import { BadRequestException } from '@nestjs/common';
import { InProgressState } from './in-progress.state';
import { CodeReviewState } from './code-review.state';
import { BlockedOnHoldState } from './blocked-on-hold.state';
import { TicketStatus } from '../enums/ticket-status.enum';

const ctx = { status: TicketStatus.IN_PROGRESS };

describe('InProgressState', () => {
    let state: InProgressState;
    beforeEach(() => { state = new InProgressState(); });

    it('should have correct status', () => {
        expect(state.getStatus()).toBe(TicketStatus.IN_PROGRESS);
    });

    it('should have correct display name', () => {
        expect(state.getDisplayName()).toBe('In Progress');
    });

    it('should transition to CodeReview', () => {
        expect(state.sendToCodeReview(ctx)).toBeInstanceOf(CodeReviewState);
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