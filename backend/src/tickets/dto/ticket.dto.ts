import { IsString, IsEnum, IsOptional, IsUUID, MinLength, MaxLength, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketType, TicketPriority } from '../entities/ticket.entity';
import { TicketAction } from '../enums/ticket-action.enum';
import { TicketEventType } from '../entities/ticket-event.entity';

export class CreateTicketDto {
    @ApiProperty({ example: 'Login button not working' })
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    title: string;

    @ApiPropertyOptional({ example: 'Users cannot login on mobile' })
    @IsString()
    @IsOptional()
    @MaxLength(10000)
    description?: string;

    @ApiPropertyOptional({ enum: TicketType, example: TicketType.BUG })
    @IsEnum(TicketType)
    @IsOptional()
    type?: TicketType;

    @ApiPropertyOptional({ enum: TicketPriority, example: TicketPriority.HIGH })
    @IsEnum(TicketPriority)
    @IsOptional()
    priority?: TicketPriority;

    @ApiPropertyOptional({ example: 'uuid-of-assignee' })
    @IsUUID()
    @IsOptional()
    assigneeId?: string;
}

export class UpdateTicketDto {
    @ApiPropertyOptional({ example: 'Updated title' })
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    @IsOptional()
    title?: string;

    @ApiPropertyOptional({ example: 'Updated description' })
    @IsString()
    @IsOptional()
    @MaxLength(10000)
    description?: string;

    @ApiPropertyOptional({ enum: TicketPriority, example: TicketPriority.HIGH })
    @IsEnum(TicketPriority)
    @IsOptional()
    priority?: TicketPriority;

    @ApiPropertyOptional({ example: 'uuid-of-assignee' })
    @IsUUID()
    @IsOptional()
    assigneeId?: string;
}

export class TransitionTicketDto {
    @ApiProperty({ enum: TicketAction, example: TicketAction.START_PROGRESS })
    @IsEnum(TicketAction)
    action: TicketAction;

    @ApiProperty({ example: 'Starting work on this ticket' })
    @IsString()
    @MinLength(3)
    @MaxLength(1000)
    comment: string;
}

export class LogTimeDto {
    @ApiProperty({ example: 30 })
    @IsInt()
    @Min(1)
    minutes: number;
}

export class DeleteTicketDto {
    @ApiProperty({ example: 'Duplicate of ticket #123' })
    @IsString()
    @MinLength(3)
    @MaxLength(1000)
    reason: string;
}

export class TicketEventResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    ticketId: string;

    @ApiProperty()
    ticketTitle: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    userUsername: string;

    @ApiProperty({ enum: TicketEventType })
    eventType: TicketEventType;

    @ApiPropertyOptional()
    fromStatus: string | null;

    @ApiPropertyOptional()
    toStatus: string | null;

    @ApiPropertyOptional()
    comment: string | null;

    @ApiProperty()
    createdAt: Date;
}