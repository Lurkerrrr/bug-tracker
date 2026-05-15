import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TicketPriority, TicketType } from '../types/ticket.types';
import type { Ticket } from '../types/ticket.types';
import Badge from '../../../shared/components/ui/Badge';
import { PRIORITY_VARIANT, TYPE_ICON } from '../constants/ticket.constants';

interface TicketCardProps {
    ticket: Ticket;
    onClick: (ticket: Ticket) => void;
}

const TicketCard = ({ ticket, onClick }: TicketCardProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: ticket.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        background: 'var(--bg-primary)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        padding: 10,
        cursor: 'grab',
        boxShadow: isDragging ? 'var(--shadow-md)' : 'var(--shadow-sm)',
    };

    const initials = ticket.assignee?.username?.slice(0, 2).toUpperCase() || '?';

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onClick(ticket)}
        >
            {/* Type */}
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>{TYPE_ICON[ticket.type]}</span>
                <span>{ticket.type}</span>
            </div>

            {/* Title */}
            <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.4 }}>
                {ticket.title}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Badge label={ticket.priority} variant={PRIORITY_VARIANT[ticket.priority]} />
                {ticket.assignee && (
                    <div style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: 'var(--accent)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 600, color: 'white',
                    }}>
                        {initials}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketCard;