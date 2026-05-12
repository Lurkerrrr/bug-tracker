import { BadRequestException } from '@nestjs/common';
import { CodeReviewState } from './code-review.state';
import { ReadyForQAState } from './ready-for-qa.state';
import { InProgressState } from './in-progress.state';
import { BlockedOnHoldState } from './blocked-on-hold.state';
import { TicketStatus } from '../enums/ticket-status.enum';

const ctx = { status: TicketStatus.CODE_REVIEW };

describe('CodeReviewState', () => {
    let state: CodeReviewState;
    beforeEach(() => { state = new CodeReviewState(); });

    it('should have correct status', () => {
        expect(state.getStatus()).toBe(TicketStatus.CODE_REVIEW);
    });

    it('should have correct display name', () => {
        expect(state.getDisplayName()).toBe('Code Review');
    });

    it('should transition to ReadyForQA', () => {
        expect(state.approveCodeReview(ctx)).toBeInstanceOf(ReadyForQAState);
    });

    it('should transition back to InProgress', () => {
        expect(state.startProgress(ctx)).toBeInstanceOf(InProgressState);
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