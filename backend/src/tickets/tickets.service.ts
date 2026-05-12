import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto, UpdateTicketDto, TransitionTicketDto, LogTimeDto } from './dto/ticket.dto';
import { TicketStateFactory } from './states/ticket-state.factory';
import { TicketStatus } from './enums/ticket-status.enum';
import { User } from '../users/entity/user.entity';

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

    async findAll(): Promise<Ticket[]> {
        const tickets = await this.ticketsRepository.find({
            relations: ['reporter', 'assignee'],
        });
        tickets.forEach(ticket => {
            if (ticket.reporter) delete (ticket.reporter as any).password;
            if (ticket.assignee) delete (ticket.assignee as any).password;
        });
        return tickets;
    }

    async findOne(id: string): Promise<Ticket> {
        const ticket = await this.ticketsRepository.findOne({
            where: { id },
            relations: ['reporter', 'assignee'],
        });
        if (!ticket) {
            throw new NotFoundException(`Ticket #${id} not found`);
        }
        if (ticket.reporter) {
            delete (ticket.reporter as any).password;
        }
        if (ticket.assignee) {
            delete (ticket.assignee as any).password;
        }
        return ticket;
    }

    async update(id: string, dto: UpdateTicketDto): Promise<Ticket> {
        const ticket = await this.findOne(id);
        Object.assign(ticket, dto);
        return this.ticketsRepository.save(ticket);
    }

    async transition(
        id: string,
        dto: TransitionTicketDto,
        user: User,
    ): Promise<Ticket> {
        const ticket = await this.findOne(id);
        const currentState = TicketStateFactory.create(ticket.status);
        const context = {
            status: ticket.status,
            assigneeId: ticket.assigneeId,
        };

        let newState;
        switch (dto.action) {
            case 'startProgress':
                newState = currentState.startProgress(context);
                break;
            case 'sendToCodeReview':
                newState = currentState.sendToCodeReview(context);
                break;
            case 'approveCodeReview':
                newState = currentState.approveCodeReview(context);
                break;
            case 'startTesting':
                newState = currentState.startTesting(context);
                break;
            case 'passTesting':
                newState = currentState.passTesting(context);
                break;
            case 'failTesting':
                newState = currentState.failTesting(context);
                break;
            case 'acceptBusiness':
                newState = currentState.acceptBusiness(context);
                break;
            case 'archive':
                newState = currentState.archive(context);
                break;
            case 'block':
                newState = currentState.block(context);
                break;
            case 'unblock':
                newState = currentState.unblock(context);
                break;
            case 'reject':
                newState = currentState.reject(context);
                break;
            case 'reopen':
                newState = currentState.reopen(context);
                break;
            case 'moveToBacklog':
                newState = currentState.moveToBacklog(context);
                break;
            default:
                throw new BadRequestException(`Unknown action: ${dto.action}`);
        }

        ticket.status = newState.getStatus();
        ticket.statusComment = dto.comment;
        return this.ticketsRepository.save(ticket);
    }

    async logTime(id: string, dto: LogTimeDto): Promise<Ticket> {
        const ticket = await this.findOne(id);
        ticket.timeLogged += dto.minutes;
        return this.ticketsRepository.save(ticket);
    }

    async assignToMe(id: string, user: User): Promise<Ticket> {
        const ticket = await this.findOne(id);
        ticket.assigneeId = user.id;
        return this.ticketsRepository.save(ticket);
    }
}