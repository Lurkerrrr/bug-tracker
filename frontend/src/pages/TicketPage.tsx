import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketsService } from '../features/tickets/services/tickets.service';
import type { Ticket } from '../features/tickets/types/ticket.types';
import TicketDetail from '../features/tickets/components/TicketDetail';
import AppLayout from '../shared/components/layout/AppLayout';
import Spinner from '../shared/components/ui/Spinner';
import { ROUTES } from '../shared/constants/routes.constants';

// Standalone page for direct ticket URL access
const TicketPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        ticketsService
            .getById(id)
            .then(setTicket)
            .catch(() => setError('Ticket not found.'))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <AppLayout>
            {loading ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner size={32} />
                </div>
            ) : error || !ticket ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 16, color: 'var(--danger)', marginBottom: 8 }}>{error || 'Ticket not found'}</div>
                        <button onClick={() => navigate(ROUTES.BOARD)} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>
                            Back to board
                        </button>
                    </div>
                </div>
            ) : (
                <TicketDetail
                    ticket={ticket}
                    onClose={() => navigate(ROUTES.BOARD)}
                    onUpdated={setTicket}
                />
            )}
        </AppLayout>
    );
};

export default TicketPage;