import { useState, useEffect } from 'react';
import { ticketsService } from '../features/tickets/services/tickets.service';
import type { Ticket } from '../features/tickets/types/ticket.types';
import KanbanBoard from '../features/tickets/components/KanbanBoard';
import CreateTicketModal from '../features/tickets/components/CreateTicketModal';
import TicketDetail from '../features/tickets/components/TicketDetail';
import AppLayout from '../shared/components/layout/AppLayout';
import Topbar from '../shared/components/layout/Topbar';
import Spinner from '../shared/components/ui/Spinner';
import Modal from '../shared/components/ui/Modal';

const BoardPage = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        setLoading(true);
        try {
            const data = await ticketsService.getAll();
            setTickets(data);
        } catch {
            setError('Failed to load tickets. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const handleTicketCreated = (ticket: Ticket) => {
        setTickets((prev) => [...prev, ticket]);
    };

    const handleTicketUpdated = (updated: Ticket) => {
        setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        setSelectedTicket(updated);
    };

    const handleTicketDeleted = (id: string) => {
        setTickets((prev) => prev.filter((t) => t.id !== id));
        setSelectedTicket(null);
    };

    // Filter tickets by search query
    const filteredTickets = tickets.filter((t) =>
        !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppLayout>
            <Topbar
                onSearch={setSearchQuery}
                onCreateTicket={() => setShowCreateModal(true)}
            />

            {loading ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner size={32} />
                </div>
            ) : error ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 16, color: 'var(--danger)', marginBottom: 8 }}>{error}</div>
                        <button
                            onClick={loadTickets}
                            style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}
                        >
                            Try again
                        </button>
                    </div>
                </div>
            ) : (
                <KanbanBoard
                    tickets={filteredTickets}
                    onTicketsChange={setTickets}
                    onTicketClick={setSelectedTicket}
                />
            )}

            {/* Create ticket modal */}
            <CreateTicketModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreated={handleTicketCreated}
            />

            {/* Ticket detail modal */}
            <Modal
                isOpen={!!selectedTicket}
                onClose={() => setSelectedTicket(null)}
                width={900}
            >
                {selectedTicket && (
                    <TicketDetail
                        ticket={selectedTicket}
                        onClose={() => setSelectedTicket(null)}
                        onUpdated={handleTicketUpdated}
                        onDeleted={handleTicketDeleted}
                    />
                )}
            </Modal>
        </AppLayout>
    );
};

export default BoardPage;