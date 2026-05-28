import { useEffect, useState } from 'react';
import AppLayout from '../shared/components/layout/AppLayout';
import { ticketsService } from '../features/tickets/services/tickets.service';
import {
    type Ticket,
    TicketStatus,
    TicketPriority,
    TicketType,
} from '../features/tickets/types/ticket.types';

const DONE_STATUSES = new Set<TicketStatus>([
    TicketStatus.DONE,
    TicketStatus.CLOSED,
    TicketStatus.CLOSED_OUT,
]);

interface Stats {
    total: number;
    open: number;
    inProgress: number;
    blocked: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byType: Record<string, number>;
}

function computeStats(tickets: Ticket[]): Stats {
    const byStatus: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byType: Record<string, number> = {};

    // Initialize all known values to 0 so empty categories still show
    Object.values(TicketStatus).forEach((s) => { byStatus[s] = 0; });
    Object.values(TicketPriority).forEach((p) => { byPriority[p] = 0; });
    Object.values(TicketType).forEach((t) => { byType[t] = 0; });

    let open = 0;
    let inProgress = 0;
    let blocked = 0;

    for (const t of tickets) {
        byStatus[t.status] = (byStatus[t.status] || 0) + 1;
        byPriority[t.priority] = (byPriority[t.priority] || 0) + 1;
        byType[t.type] = (byType[t.type] || 0) + 1;

        if (!DONE_STATUSES.has(t.status)) open += 1;
        if (t.status === TicketStatus.IN_PROGRESS) inProgress += 1;
        if (t.status === TicketStatus.BLOCKED_ON_HOLD) blocked += 1;
    }

    return {
        total: tickets.length,
        open,
        inProgress,
        blocked,
        byStatus,
        byPriority,
        byType,
    };
}

const ReportsPage = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tickets = await ticketsService.getAll();
                setStats(computeStats(tickets));
            } catch (err) {
                setError('Failed to load report data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <AppLayout>
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                overflowY: 'auto',
            }}>
                <h1 style={{
                    fontSize: 24,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: '0 0 16px 0',
                }}>
                    Reports
                </h1>

                {loading && <p style={{ color: 'var(--text-secondary)' }}>Loading report data...</p>}

                {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

                {!loading && !error && stats && stats.total === 0 && (
                    <p style={{ color: 'var(--text-secondary)' }}>No tickets yet — nothing to report.</p>
                )}

                {!loading && !error && stats && stats.total > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Stat cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                            gap: 16,
                        }}>
                            <StatCard label="Total tickets" value={stats.total} />
                            <StatCard label="Open" value={stats.open} accent="var(--accent)" />
                            <StatCard label="In Progress" value={stats.inProgress} accent="var(--warning)" />
                            <StatCard label="Blocked / On Hold" value={stats.blocked} accent="var(--danger)" />
                        </div>

                        {/* Breakdowns */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: 24,
                        }}>
                            <BreakdownSection title="By Status" data={stats.byStatus} total={stats.total} />
                            <BreakdownSection title="By Priority" data={stats.byPriority} total={stats.total} />
                            <BreakdownSection title="By Type" data={stats.byType} total={stats.total} />
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

const StatCard = ({ label, value, accent }: { label: string; value: number; accent?: string }) => (
    <div style={{
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 16,
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: accent || 'var(--text-primary)' }}>
            {value}
        </span>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
    </div>
);

const BreakdownSection = ({ title, data, total }: { title: string; data: Record<string, number>; total: number }) => (
    <div style={{
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 16,
        background: 'var(--bg-primary)',
    }}>
        <h2 style={{
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: '0 0 12px 0',
        }}>
            {title}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(data).map(([label, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                    <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                                {count} ({pct}%)
                            </span>
                        </div>
                        {/* Simple proportion bar */}
                        <div style={{
                            height: 6,
                            borderRadius: 3,
                            background: 'var(--bg-tertiary)',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                width: `${pct}%`,
                                height: '100%',
                                background: 'var(--accent)',
                            }} />
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

export default ReportsPage;
