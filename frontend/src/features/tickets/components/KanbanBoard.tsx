import { useState, useCallback } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { TicketStatus, TICKET_TRANSITIONS } from '../types/ticket.types';
import type { Ticket } from '../types/ticket.types';
import { ticketsService } from '../services/tickets.service';
import KanbanColumn, { BOARD_COLUMNS } from './KanbanColumn';

interface KanbanBoardProps {
    tickets: Ticket[];
    onTicketsChange: (tickets: Ticket[]) => void;
    onTicketClick: (ticket: Ticket) => void;
}

const KanbanBoard = ({ tickets, onTicketsChange, onTicketClick }: KanbanBoardProps) => {
    const [transitioning, setTransitioning] = useState(false);

    // Use pointer sensor with minimum drag distance to prevent accidental drags on click
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const getTicketsForColumn = (status: TicketStatus) =>
        tickets.filter((t) => t.status === status);

    const handleDragEnd = useCallback(async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || transitioning) return;

        const ticketId = active.id as string;
        const newStatus = over.id as TicketStatus;
        const ticket = tickets.find((t) => t.id === ticketId);

        if (!ticket || ticket.status === newStatus) return;

        // Find a valid transition action for this status change
        const transitions = TICKET_TRANSITIONS[ticket.status];
        const validTransition = transitions.find((t) => {
            const testTransitions: Record<string, TicketStatus> = {
                startProgress: TicketStatus.IN_PROGRESS,
                sendToCodeReview: TicketStatus.CODE_REVIEW,
                approveCodeReview: TicketStatus.READY_FOR_QA,
                startTesting: TicketStatus.IN_TEST,
                passTesting: TicketStatus.DONE,
                block: TicketStatus.BLOCKED_ON_HOLD,
                unblock: TicketStatus.IN_PROGRESS,
                moveToBacklog: TicketStatus.TO_DO,
                reopen: TicketStatus.REOPENED,
                reject: TicketStatus.REJECTED,
                acceptBusiness: TicketStatus.CLOSED,
                archive: TicketStatus.CLOSED_OUT,
                failTesting: TicketStatus.REOPENED,
            };
            return testTransitions[t.action] === newStatus;
        });

        if (!validTransition) return;

        setTransitioning(true);
        try {
            const updated = await ticketsService.transition(ticketId, {
                action: validTransition.action,
                comment: `Status changed via drag and drop`,
            });
            // Update local state immediately for smooth UI
            onTicketsChange(tickets.map((t) => (t.id === ticketId ? updated : t)));
        } catch {
            // Silently fail — ticket stays in original column
        } finally {
            setTransitioning(false);
        }
    }, [tickets, onTicketsChange, transitioning]);

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div style={{ display: 'flex', gap: 12, padding: 16, overflowX: 'auto', flex: 1 }}>
                {BOARD_COLUMNS.map((status) => (
                    <KanbanColumn
                        key={status}
                        status={status}
                        tickets={getTicketsForColumn(status)}
                        onTicketClick={onTicketClick}
                    />
                ))}
            </div>
        </DndContext>
    );
};

export default KanbanBoard;