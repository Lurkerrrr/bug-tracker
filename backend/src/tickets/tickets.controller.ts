import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import {
    CreateTicketDto,
    UpdateTicketDto,
    TransitionTicketDto,
    LogTimeDto,
} from './dto/ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entity/user.entity';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.TESTER)
    create(@Body() dto: CreateTicketDto, @Request() req) {
        return this.ticketsService.create(dto, req.user);
    }

    @Get()
    findAll() {
        return this.ticketsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ticketsService.findOne(id);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN, UserRole.DEVELOPER, UserRole.TESTER)
    update(@Param('id') id: string, @Body() dto: UpdateTicketDto, @Request() req) {
        return this.ticketsService.update(id, dto, req.user);
    }

    @Patch(':id/transition')
    transition(
        @Param('id') id: string,
        @Body() dto: TransitionTicketDto,
        @Request() req,
    ) {
        return this.ticketsService.transition(id, dto, req.user);
    }

    @Patch(':id/log-time')
    @Roles(UserRole.DEVELOPER)
    logTime(@Param('id') id: string, @Body() dto: LogTimeDto, @Request() req) {
        return this.ticketsService.logTime(id, dto, req.user);
    }

    @Patch(':id/assign-to-me')
    @Roles(UserRole.DEVELOPER)
    assignToMe(@Param('id') id: string, @Request() req) {
        return this.ticketsService.assignToMe(id, req.user);
    }
}