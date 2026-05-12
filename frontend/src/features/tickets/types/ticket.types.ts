export enum TicketStatus {
    TO_DO = 'To Do',
    IN_PROGRESS = 'In Progress',
    CODE_REVIEW = 'Code Review',
    READY_FOR_QA = 'Ready for QA',
    IN_TEST = 'In Test',
    DONE = 'Done',
    CLOSED = 'Closed',
    CLOSED_OUT = 'Closed out',
    REJECTED = 'Rejected',
    BLOCKED_ON_HOLD = 'Blocked/On Hold',
    REOPENED = 'Reopened',
}

export enum TicketType {
    BUG = 'Bug',
    TASK = 'Task',
    EPIC = 'Epic',
}

export enum TicketPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
    CRITICAL = 'Critical',
}

export interface Ticket {
    id: string;
    title: string;
    description?: string;
    type: TicketType;
    priority: TicketPriority;
    status: TicketStatus;
    statusComment?: string;
    reporterId: string;
    assigneeId?: string;
    reporter?: {
        id: string;
        username: string;
        email: string;
    };
    assignee?: {
        id: string;
        username: string;
        email: string;
    };
    timeLogged: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTicketDto {
    title: string;
    description?: string;
    type?: TicketType;
    priority?: TicketPriority;
    assigneeId?: string;
}

export interface UpdateTicketDto {
    title?: string;
    description?: string;
    priority?: TicketPriority;
    assigneeId?: string;
}

export interface TransitionTicketDto {
    action: string;
    comment: string;
}

export interface LogTimeDto {
    minutes: number;
}

export const TICKET_TRANSITIONS: Record<TicketStatus, { action: string; label: string }[]> = {
    [TicketStatus.TO_DO]: [
        { action: 'startProgress', label: 'Start Progress' },
        { action: 'reject', label: 'Reject' },
        { action: 'block', label: 'Block / On Hold' },
    ],
    [TicketStatus.IN_PROGRESS]: [
        { action: 'sendToCodeReview', label: 'Send to Code Review' },
        { action: 'block', label: 'Block / On Hold' },
    ],
    [TicketStatus.CODE_REVIEW]: [
        { action: 'approveCodeReview', label: 'Approve Code Review' },
        { action: 'startProgress', label: 'Request Changes' },
        { action: 'block', label: 'Block / On Hold' },
    ],
    [TicketStatus.READY_FOR_QA]: [
        { action: 'startTesting', label: 'Start Testing' },
        { action: 'block', label: 'Block / On Hold' },
    ],
    [TicketStatus.IN_TEST]: [
        { action: 'passTesting', label: 'Pass Testing' },
        { action: 'failTesting', label: 'Fail Testing' },
        { action: 'block', label: 'Block / On Hold' },
    ],
    [TicketStatus.DONE]: [
        { action: 'acceptBusiness', label: 'Accept' },
        { action: 'reopen', label: 'Reopen' },
    ],
    [TicketStatus.CLOSED]: [
        { action: 'archive', label: 'Archive' },
        { action: 'reopen', label: 'Reopen' },
    ],
    [TicketStatus.CLOSED_OUT]: [],
    [TicketStatus.REJECTED]: [
        { action: 'acceptBusiness', label: 'Close' },
    ],
    [TicketStatus.BLOCKED_ON_HOLD]: [
        { action: 'unblock', label: 'Unblock' },
        { action: 'moveToBacklog', label: 'Move to Backlog' },
    ],
    [TicketStatus.REOPENED]: [
        { action: 'startProgress', label: 'Start Progress' },
        { action: 'moveToBacklog', label: 'Move to Backlog' },
        { action: 'block', label: 'Block / On Hold' },
    ],
};