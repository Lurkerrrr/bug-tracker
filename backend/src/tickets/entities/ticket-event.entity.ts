import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';
import { TicketStatus } from '../enums/ticket-status.enum';

export enum TicketEventType {
    CREATED = 'CREATED',
    TRANSITIONED = 'TRANSITIONED',
    UPDATED = 'UPDATED',
    ASSIGNED = 'ASSIGNED',
    TIME_LOGGED = 'TIME_LOGGED',
    DELETED = 'DELETED',
}

@Entity('ticket_events')
export class TicketEvent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Stored as plain string — no FK so events survive ticket deletion
    @Column({ type: 'uuid' })
    ticketId: string;

    // Denormalized — so we know the ticket title even after deletion
    @Column({ type: 'varchar' })
    ticketTitle: string;

    // Stored as plain string — no FK so events survive user deletion
    @Column({ type: 'uuid' })
    userId: string;

    // Denormalized — so we know who acted even after user deletion
    @Column({ type: 'varchar' })
    userUsername: string;

    @Column({
        type: 'enum',
        enum: TicketEventType,
    })
    eventType: TicketEventType;

    @Column({ type: 'varchar', nullable: true })
    fromStatus: TicketStatus | null;

    @Column({ type: 'varchar', nullable: true })
    toStatus: TicketStatus | null;

    @Column({ type: 'text', nullable: true })
    comment: string | null;

    @CreateDateColumn()
    createdAt: Date;
}