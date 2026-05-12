import { IsString, IsEnum, IsOptional, IsUUID, MinLength, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketType, TicketPriority } from '../entities/ticket.entity';

export class CreateTicketDto {
    @ApiProperty({ example: 'Login button not working' })
    @IsString()
    @MinLength(3)
    title: string;

    @ApiPropertyOptional({ example: 'Users cannot login on mobile' })
    @IsString()
    @IsOptional()
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
    @IsOptional()
    title?: string;

    @ApiPropertyOptional({ example: 'Updated description' })
    @IsString()
    @IsOptional()
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
    @ApiProperty({ example: 'startProgress' })
    @IsString()
    action: string;

    @ApiProperty({ example: 'Starting work on this ticket' })
    @IsString()
    @MinLength(3)
    comment: string;
}

export class LogTimeDto {
    @ApiProperty({ example: 30 })
    @IsInt()
    @Min(1)
    minutes: number;
}