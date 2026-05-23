import { useEffect, useState } from 'react';
import AppLayout from '../shared/components/layout/AppLayout';
import { ticketsService } from '../features/tickets/services/tickets.service';
import type { Ticket } from '../features/tickets/types/ticket.types';

const BacklogPage = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch tickets on component mount
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const data = await ticketsService.getAll();
                setTickets(data);
            } catch (err) {
                setError('Failed to load tickets. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    return (
        <AppLayout>
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
            }}>
                <h1 style={{
                    fontSize: 24,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: '0 0 16px 0',
                }}>
                    Backlog
                </h1>

                {loading && <p>Loading tickets...</p>}

                {error && <p style={{ color: 'red' }}>{error}</p>}

                {!loading && !error && tickets.length === 0 && (
                    <p style={{ color: 'var(--text-secondary)' }}>No tickets found in the backlog.</p>
                )}

                {!loading && !error && tickets.length > 0 && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '12px 8px' }}>Title</th>
                                <th style={{ padding: '12px 8px' }}>Type</th>
                                <th style={{ padding: '12px 8px' }}>Priority</th>
                                <th style={{ padding: '12px 8px' }}>Status</th>
                                <th style={{ padding: '12px 8px' }}>Assignee</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '12px 8px', fontWeight: 500 }}>{ticket.title}</td>
                                    <td style={{ padding: '12px 8px' }}>{ticket.type}</td>
                                    <td style={{ padding: '12px 8px' }}>{ticket.priority}</td>
                                    <td style={{ padding: '12px 8px' }}>{ticket.status}</td>
                                    <td style={{ padding: '12px 8px' }}>
                                        {ticket.assignee ? ticket.assignee.username : 'Unassigned'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AppLayout>
    );
};

export default BacklogPage;
