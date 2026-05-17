import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto, UpdateTicketDto, TransitionTicketDto, LogTimeDto } from './dto/ticket.dto';
import { TicketStateFactory } from './states/ticket-state.factory';
import { TicketStatus } from './enums/ticket-status.enum';
import { TicketAction } from './enums/ticket-action.enum';
import { User, UserRole } from '../users/entity/user.entity';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private readonly ticketsRepository: Repository<Ticket>,
    ) { }

    async create(dto: CreateTicketDto, reporter: User): Promise<Ticket> {
        const ticket = this.ticketsRepository.create({
            ...dto,
            reporterId: reporter.id,
            status: TicketStatus.TO_DO,
        });
        return this.ticketsRepository.save(ticket);
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

    async update(id: string, dto: UpdateTicketDto, user: User): Promise<Ticket> {
        const ticket = await this.findOne(id);
        this.assertOwnerOrAdmin(ticket, user, 'update');
        Object.assign(ticket, dto);
        return this.ticketsRepository.save(ticket);
    }

    private readonly logger = new Logger(TicketsService.name);

    async delete(id: string, reason: string, user: User): Promise<void> {
        const ticket = await this.findOne(id);
        this.assertOwnerOrAdmin(ticket, user, 'delete');
        this.logger.log(
            `Ticket #${id} deleted by user ${user.id} (${user.role}). Reason: ${reason}`,
        );
        await this.ticketsRepository.delete(id);
    }

    async transition(
        id: string,
        dto: TransitionTicketDto,
        user: User,
    ): Promise<Ticket> {
        const ticket = await this.findOne(id);
        this.assertOwnerOrAdmin(ticket, user, 'transition');

        const currentState = TicketStateFactory.create(ticket.status);
        const context = {
            status: ticket.status,
            assigneeId: ticket.assigneeId,
        };

        // Use TicketAction enum values to invoke state machine methods
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
        ticket.status = newState.getStatus();
        ticket.statusComment = dto.comment;
        return this.ticketsRepository.save(ticket);
    }

    async logTime(id: string, dto: LogTimeDto, user: User): Promise<Ticket> {
        const ticket = await this.findOne(id);
        this.assertAssigneeOrAdmin(ticket, user, 'log time on');
        ticket.timeLogged += dto.minutes;
        return this.ticketsRepository.save(ticket);
    }

    async assignToMe(id: string, user: User): Promise<Ticket> {
        const ticket = await this.findOne(id);
        ticket.assigneeId = user.id;
        return this.ticketsRepository.save(ticket);
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
}