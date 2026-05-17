import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TicketStatus } from '../types/ticket.types';
import type { Ticket } from '../types/ticket.types';
import TicketCard from './TicketCard';

interface KanbanColumnProps {
    status: TicketStatus;
    tickets: Ticket[];
    onTicketClick: (ticket: Ticket) => void;
}

// Only show these statuses on the board as columns
export const BOARD_COLUMNS: TicketStatus[] = [
    TicketStatus.TO_DO,
    TicketStatus.IN_PROGRESS,
    TicketStatus.CODE_REVIEW,
    TicketStatus.READY_FOR_QA,
    TicketStatus.IN_TEST,
    TicketStatus.DONE,
    TicketStatus.BLOCKED_ON_HOLD,
    TicketStatus.REOPENED,
];

const KanbanColumn = ({ status, tickets, onTicketClick }: KanbanColumnProps) => {
    const { setNodeRef, isOver } = useDroppable({ id: status });

    return (
        <div style={{ width: 200, flexShrink: 0 }}>
            {/* Column header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    {status}
                </span>
                <span style={{
                    fontSize: 11, background: 'var(--bg-tertiary)',
                    color: 'var(--text-tertiary)', borderRadius: 10,
                    padding: '1px 7px',
                }}>
                    {tickets.length}
                </span>
            </div>

            {/* Droppable column body */}
            <div
                ref={setNodeRef}
                style={{
                    background: isOver ? 'var(--accent-bg)' : 'var(--bg-secondary)',
                    borderRadius: 6,
                    padding: 8,
                    minHeight: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    border: `1px solid ${isOver ? 'var(--accent)' : 'var(--border)'}`,
                    transition: 'background 0.15s ease, border-color 0.15s ease',
                }}
            >
                <SortableContext items={tickets.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {tickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} onClick={onTicketClick} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};

export default KanbanColumn;