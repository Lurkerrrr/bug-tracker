import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { TicketEvent } from './entities/ticket-event.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Ticket, TicketEvent])],
    providers: [TicketsService],
    controllers: [TicketsController],
    exports: [TicketsService],
})
export class TicketsModule { }