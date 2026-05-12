import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { TicketStatus } from '../enums/ticket-status.enum';

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

@Entity('tickets')
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: TicketType,
        default: TicketType.BUG,
    })
    type: TicketType;

    @Column({
        type: 'enum',
        enum: TicketPriority,
        default: TicketPriority.MEDIUM,
    })
    priority: TicketPriority;

    @Column({
        type: 'varchar',
        default: TicketStatus.TO_DO,
    })
    status: TicketStatus;

    @Column({ type: 'text', nullable: true })
    statusComment: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'reporterId' })
    reporter: User;

    @Column({ nullable: true })
    reporterId: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'assigneeId' })
    assignee: User;

    @Column({ nullable: true })
    assigneeId: string;

    @Column({ type: 'int', default: 0 })
    timeLogged: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}