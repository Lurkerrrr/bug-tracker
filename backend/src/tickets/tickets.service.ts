import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketEvent, TicketEventType } from './entities/ticket-event.entity';
import { CreateTicketDto, UpdateTicketDto, TransitionTicketDto, LogTimeDto } from './dto/ticket.dto';
import { TicketStateFactory } from './states/ticket-state.factory';
import { TicketStatus } from './enums/ticket-status.enum';
import { TicketAction } from './enums/ticket-action.enum';
import { User, UserRole } from '../users/entity/user.entity';

@Injectable()
export class TicketsService {
    private readonly logger = new Logger(TicketsService.name);

    constructor(
        @InjectRepository(Ticket)
        private readonly ticketsRepository: Repository<Ticket>,
        @InjectRepository(TicketEvent)
        private readonly ticketEventsRepository: Repository<TicketEvent>,
        private readonly dataSource: DataSource,
    ) { }

    async create(dto: CreateTicketDto, reporter: User): Promise<Ticket> {
        const ticket = this.ticketsRepository.create({
            ...dto,
            reporterId: reporter.id,
            status: TicketStatus.TO_DO,
        });
        const saved = await this.ticketsRepository.save(ticket);
        await this.recordEvent({
            ticketId: saved.id,
            ticketTitle: saved.title,
            userId: reporter.id,
            userUsername: reporter.username,
            eventType: TicketEventType.CREATED,
            fromStatus: null,
            toStatus: TicketStatus.TO_DO,
            comment: null,
        });
        return saved;
    }

    // Password excluded automatically via @Exclude() on User entity + ClassSerializerInterceptor
    async findAll(): Promise<Ticket[]> {
        return this.ticketsRepository.find({
            relations: ['reporter', 'assignee'],
        });
    }

    async findOne(id: string): Promise<Ticket> {
        const ticket = await this.ticketsRepository.findOne({
            where: { id },
            relations: ['reporter', 'assignee'],
        });
        if (!ticket) {
            throw new NotFoundException(`Ticket #${id} not found`);
        }
        return ticket;
    }

    async findEvents(ticketId: string): Promise<TicketEvent[]> {
        return this.ticketEventsRepository.find({
            where: { ticketId },
            order: { createdAt: 'ASC' },
        });
    }

    async update(id: string, dto: UpdateTicketDto, user: User): Promise<Ticket> {
        const ticket = await this.findOne(id);
        this.assertOwnerOrAdmin(ticket, user, 'update');
        Object.assign(ticket, dto);
        const saved = await this.ticketsRepository.save(ticket);
        await this.recordEvent({
            ticketId: saved.id,
            ticketTitle: saved.title,
            userId: user.id,
            userUsername: user.username,
            eventType: TicketEventType.UPDATED,
            fromStatus: null,
            toStatus: null,
            comment: null,
        });
        return saved;
    }

    async transition(
        id: string,
        dto: TransitionTicketDto,
        user: User,
    ): Promise<Ticket> {
        const ticket = await this.findOne(id);
        this.assertOwnerOrAdmin(ticket, user, 'transition');

        const currentState = TicketStateFactory.create(ticket.status);
        const fromStatus = ticket.status;
        const context = {
            status: ticket.status,
            assigneeId: ticket.assigneeId,
        };

        const actionMethodMap: Record<TicketAction, () => any> = {
            [TicketAction.START_PROGRESS]: () => currentState.startProgress(context),
            [TicketAction.SEND_TO_CODE_REVIEW]: () => currentState.sendToCodeReview(context),
            [TicketAction.APPROVE_CODE_REVIEW]: () => currentState.approveCodeReview(context),
            [TicketAction.START_TESTING]: () => currentState.startTesting(context),
            [TicketAction.PASS_TESTING]: () => currentState.passTesting(context),
            [TicketAction.FAIL_TESTING]: () => currentState.failTesting(context),
            [TicketAction.ACCEPT_BUSINESS]: () => currentState.acceptBusiness(context),
            [TicketAction.ARCHIVE]: () => currentState.archive(context),
            [TicketAction.BLOCK]: () => currentState.block(context),
            [TicketAction.UNBLOCK]: () => currentState.unblock(context),
            [TicketAction.REJECT]: () => currentState.reject(context),
            [TicketAction.REOPEN]: () => currentState.reopen(context),
            [TicketAction.MOVE_TO_BACKLOG]: () => currentState.moveToBacklog(context),
        };

        const newState = actionMethodMap[dto.action]();
        const toStatus = newState.getStatus();

        await this.dataSource.transaction(async (manager) => {
            ticket.status = toStatus;
            ticket.statusComment = dto.comment;
            await manager.save(Ticket, ticket);
            await manager.save(TicketEvent, this.ticketEventsRepository.create({
                ticketId: ticket.id,
                ticketTitle: ticket.title,
                userId: user.id,
                userUsername: user.username,
                eventType: TicketEventType.TRANSITIONED,
                fromStatus,
                toStatus,
                comment: dto.comment,
            }));
        });

        return this.findOne(id);
    }

    async logTime(id: string, dto: LogTimeDto, user: User): Promise<Ticket> {
        const ticket = await this.findOne(id);
        this.assertAssigneeOrAdmin(ticket, user, 'log time on');
        ticket.timeLogged += dto.minutes;
        const saved = await this.ticketsRepository.save(ticket);
        await this.recordEvent({
            ticketId: saved.id,
            ticketTitle: saved.title,
            userId: user.id,
            userUsername: user.username,
            eventType: TicketEventType.TIME_LOGGED,
            fromStatus: null,
            toStatus: null,
            comment: `Logged ${dto.minutes} minutes`,
        });
        return saved;
    }

    async assignToMe(id: string, user: User): Promise<Ticket> {
        const ticket = await this.findOne(id);
        ticket.assigneeId = user.id;
        const saved = await this.ticketsRepository.save(ticket);
        await this.recordEvent({
            ticketId: saved.id,
            ticketTitle: saved.title,
            userId: user.id,
            userUsername: user.username,
            eventType: TicketEventType.ASSIGNED,
            fromStatus: null,
            toStatus: null,
            comment: null,
        });
        return saved;
    }

    async delete(id: string, reason: string, user: User): Promise<void> {
        const ticket = await this.findOne(id);
        this.assertOwnerOrAdmin(ticket, user, 'delete');

        await this.dataSource.transaction(async (manager) => {
            await manager.save(TicketEvent, this.ticketEventsRepository.create({
                ticketId: ticket.id,
                ticketTitle: ticket.title,
                userId: user.id,
                userUsername: user.username,
                eventType: TicketEventType.DELETED,
                fromStatus: ticket.status,
                toStatus: null,
                comment: reason,
            }));
            await manager.delete(Ticket, id);
        });

        this.logger.log(
            `Ticket #${id} deleted by user ${user.id} (${user.role}). Reason: ${reason}`,
        );
    }

    // Reporter, assignee, or ADMIN can update/transition a ticket
    private assertOwnerOrAdmin(ticket: Ticket, user: User, action: string): void {
        const isAdmin = user.role === UserRole.ADMIN;
        const isReporter = ticket.reporterId === user.id;
        const isAssignee = ticket.assigneeId === user.id;

        if (!isAdmin && !isReporter && !isAssignee) {
            throw new ForbiddenException(
                `You do not have permission to ${action} this ticket`,
            );
        }
    }

    // Only assignee or ADMIN can log time
    private assertAssigneeOrAdmin(ticket: Ticket, user: User, action: string): void {
        const isAdmin = user.role === UserRole.ADMIN;
        const isAssignee = ticket.assigneeId === user.id;

        if (!isAdmin && !isAssignee) {
            throw new ForbiddenException(
                `You do not have permission to ${action} this ticket`,
            );
        }
    }

    // DRY helper — writes a single event row
    private async recordEvent(data: {
        ticketId: string;
        ticketTitle: string;
        userId: string;
        userUsername: string;
        eventType: TicketEventType;
        fromStatus: TicketStatus | null;
        toStatus: TicketStatus | null;
        comment: string | null;
    }): Promise<void> {
        const event = this.ticketEventsRepository.create(data);
        await this.ticketEventsRepository.save(event);
    }
}