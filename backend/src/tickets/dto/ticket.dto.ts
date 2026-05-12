import {
    IsString,
    IsEnum,
    IsOptional,
    IsUUID,
    MinLength,
    IsInt,
    Min,
} from 'class-validator';
import { TicketType, TicketPriority } from '../entities/ticket.entity';

export class CreateTicketDto {
    @IsString()
    @MinLength(3)
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(TicketType)
    @IsOptional()
    type?: TicketType;

    @IsEnum(TicketPriority)
    @IsOptional()
    priority?: TicketPriority;

    @IsUUID()
    @IsOptional()
    assigneeId?: string;
}

export class UpdateTicketDto {
    @IsString()
    @MinLength(3)
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(TicketPriority)
    @IsOptional()
    priority?: TicketPriority;

    @IsUUID()
    @IsOptional()
    assigneeId?: string;
}

export class TransitionTicketDto {
    @IsString()
    action: string;

    @IsString()
    @MinLength(3)
    comment: string;
}

export class LogTimeDto {
    @IsInt()
    @Min(1)
    minutes: number;
}