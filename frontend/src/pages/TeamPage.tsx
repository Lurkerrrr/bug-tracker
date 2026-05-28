import { useEffect, useState } from 'react';
import AppLayout from '../shared/components/layout/AppLayout';
import { usersService } from '../features/users/services/users.service';
import { ticketsService } from '../features/tickets/services/tickets.service';
import type { User } from '../features/users/types/user.types';
import { type Ticket, TicketStatus } from '../features/tickets/types/ticket.types';

// Statuses considered "done" (not active work)
const DONE_STATUSES = new Set<TicketStatus>([
    TicketStatus.DONE,
    TicketStatus.CLOSED,
    TicketStatus.CLOSED_OUT,
]);

interface MemberWorkload {
    user: User;
    total: number;
    active: number;
    done: number;
}

const roleColors: Record<string, { bg: string; text: string }> = {
    admin: { bg: 'var(--danger-bg)', text: 'var(--danger)' },
    developer: { bg: 'var(--accent-bg)', text: 'var(--accent)' },
    tester: { bg: 'var(--success-bg)', text: 'var(--success)' },
};

const TeamPage = () => {
    const [members, setMembers] = useState<MemberWorkload[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [users, tickets] = await Promise.all([
                    usersService.getTeam(),
                    ticketsService.getAll(),
                ]);

                // Build per-user workload from assigned tickets
                const workloads: MemberWorkload[] = users.map((user) => {
                    const assigned = tickets.filter(
                        (t: Ticket) => t.assignee?.id === user.id
                    );
                    const done = assigned.filter((t) => DONE_STATUSES.has(t.status)).length;
                    return {
                        user,
                        total: assigned.length,
                        active: assigned.length - done,
                        done,
                    };
                });

                setMembers(workloads);
            } catch (err) {
                setError('Failed to load team members. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const initials = (username: string) => username.slice(0, 2).toUpperCase();

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
                    Team
                </h1>

                {loading && <p style={{ color: 'var(--text-secondary)' }}>Loading team members...</p>}

                {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

                {!loading && !error && members.length === 0 && (
                    <p style={{ color: 'var(--text-secondary)' }}>No team members found.</p>
                )}

                {!loading && !error && members.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 16,
                    }}>
                        {members.map(({ user, total, active, done }) => {
                            const rc = roleColors[user.role] || { bg: 'var(--bg-tertiary)', text: 'var(--text-secondary)' };
                            return (
                                <div
                                    key={user.id}
                                    style={{
                                        border: '1px solid var(--border)',
                                        borderRadius: 8,
                                        padding: 16,
                                        background: 'var(--bg-primary)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 12,
                                    }}
                                >
                                    {/* Header: avatar + name + role */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: 'var(--accent)',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 14,
                                            fontWeight: 600,
                                            flexShrink: 0,
                                        }}>
                                            {initials(user.username)}
                                        </div>
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <div style={{
                                                fontSize: 15,
                                                fontWeight: 600,
                                                color: 'var(--text-primary)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {user.username}
                                            </div>
                                            <div style={{
                                                fontSize: 12,
                                                color: 'var(--text-secondary)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {user.email}
                                            </div>
                                        </div>
                                        <span style={{
                                            fontSize: 11,
                                            fontWeight: 600,
                                            textTransform: 'capitalize',
                                            padding: '2px 10px',
                                            borderRadius: 12,
                                            background: rc.bg,
                                            color: rc.text,
                                            flexShrink: 0,
                                        }}>
                                            {user.role}
                                        </span>
                                    </div>

                                    {/* Workload counts */}
                                    <div style={{
                                        display: 'flex',
                                        gap: 16,
                                        borderTop: '1px solid var(--border)',
                                        paddingTop: 12,
                                    }}>
                                        <WorkloadStat label="Total" value={total} />
                                        <WorkloadStat label="Active" value={active} />
                                        <WorkloadStat label="Done" value={done} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

const WorkloadStat = ({ label, value }: { label: string; value: number }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{label}</span>
    </div>
);

export default TeamPage;
