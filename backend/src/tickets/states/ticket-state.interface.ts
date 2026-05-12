import { TicketStatus } from '../../tickets/enums/ticket-status.enum';

export interface TicketContext {
    status: TicketStatus;
    assigneeId?: string;
}

export interface ITicketState {
    getStatus(): TicketStatus;
    getDisplayName(): string;
    startProgress(context: TicketContext): ITicketState;
    sendToCodeReview(context: TicketContext): ITicketState;
    approveCodeReview(context: TicketContext): ITicketState;
    sendToQA(context: TicketContext): ITicketState;
    startTesting(context: TicketContext): ITicketState;
    passTesting(context: TicketContext): ITicketState;
    failTesting(context: TicketContext): ITicketState;
    acceptBusiness(context: TicketContext): ITicketState;
    archive(context: TicketContext): ITicketState;
    block(context: TicketContext): ITicketState;
    unblock(context: TicketContext): ITicketState;
    reject(context: TicketContext): ITicketState;
    reopen(context: TicketContext): ITicketState;
    moveToBacklog(context: TicketContext): ITicketState;
}