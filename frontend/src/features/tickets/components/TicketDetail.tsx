import { useState } from 'react';
import type { Ticket } from '../types/ticket.types';
import { ticketsService } from '../services/tickets.service';
import Button from '../../../shared/components/ui/Button';
import Badge from '../../../shared/components/ui/Badge';
import { PRIORITY_VARIANT, TYPE_ICON } from '../constants/ticket.constants';
import TransitionStatusModal from './TransitionStatusModal';
import DeleteTicketModal from './DeleteTicketModal';

interface TicketDetailProps {
    ticket: Ticket;
    onClose: () => void;
    onUpdated: (ticket: Ticket) => void;
    onDeleted: (id: string) => void;
}

const TicketDetail = ({ ticket, onClose, onUpdated, onDeleted }: TicketDetailProps) => {
    const [logMinutes, setLogMinutes] = useState('');
    const [showLogTime, setShowLogTime] = useState(false);
    const [error, setError] = useState('');
    const [showTransitionModal, setShowTransitionModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleTransition = async (action: string, comment: string) => {
        const updated = await ticketsService.transition(ticket.id, { action, comment });
        onUpdated(updated);
    };

    const handleDelete = async (reason: string) => {
        await ticketsService.deleteTicket(ticket.id, { reason });
        onDeleted(ticket.id);
        onClose();
    };

    const handleLogTime = async () => {
        const minutes = parseInt(logMinutes);
        if (!minutes || minutes < 1) return;
        try {
            const updated = await ticketsService.logTime(ticket.id, { minutes });
            onUpdated(updated);
            setLogMinutes('');
            setShowLogTime(false);
        } catch {
            setError('Failed to log time.');
        }
    };

    const handleAssignToMe = async () => {
        try {
            const updated = await ticketsService.assignToMe(ticket.id);
            onUpdated(updated);
        } catch {
            setError('Failed to assign ticket.');
        }
    };

    const formatTime = (minutes: number) => {
        if (minutes < 60) return `${minutes}m`;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    };

    const fieldLabel: React.CSSProperties = {
        fontSize: 11, color: 'var(--text-tertiary)',
        fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.4px', marginBottom: 4,
    };

    const fieldValue: React.CSSProperties = {
        fontSize: 13, color: 'var(--text-primary)',
        display: 'flex', alignItems: 'center', gap: 5,
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px 0', fontSize: 12, color: 'var(--text-tertiary)' }}>
                    <span style={{ color: 'var(--accent)', cursor: 'pointer' }}>Bug Tracker</span>
                    <span>/</span>
                    <span>{ticket.id.slice(0, 8).toUpperCase()}</span>
                    <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: 18, color: 'var(--text-tertiary)', cursor: 'pointer' }}>✕</button>
                </div>

                {/* Main content */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                    {/* Left panel */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '12px 20px 0' }}>
                        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}>

                            {/* Title */}
                            <h1 style={{ fontSize: 20, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.4 }}>
                                {ticket.title}
                            </h1>

                            {/* Action bar */}
                            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                                {[
                                    { label: '📎 Attach', onClick: () => { } },
                                    { label: '🔗 Link issue', onClick: () => { } },
                                    { label: '👤 Assign to me', onClick: handleAssignToMe },
                                ].map(({ label, onClick }) => (
                                    <button key={label} onClick={onClick} style={{
                                        padding: '4px 10px', border: '1px solid var(--border)',
                                        borderRadius: 3, background: 'var(--bg-primary)',
                                        color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer',
                                    }}>
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Description */}
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                                    Description
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: 4, border: '1px solid var(--border)' }}>
                                    {ticket.description || <em>No description provided.</em>}
                                </div>
                            </div>

                            {/* Activity */}
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                                    Activity
                                </div>
                                {ticket.statusComment && (
                                    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 600, color: 'white', flexShrink: 0 }}>
                                            {ticket.reporter?.username?.slice(0, 2).toUpperCase() || 'U'}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4 }}>
                                                <strong style={{ color: 'var(--text-secondary)' }}>{ticket.reporter?.username}</strong> · last status change
                                            </div>
                                            <div style={{ fontSize: 12, color: 'var(--text-secondary)', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 4, padding: '6px 10px' }}>
                                                {ticket.statusComment}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {error && <div style={{ fontSize: 12, color: 'var(--danger)', padding: '8px 0' }}>{error}</div>}
                    </div>

                    {/* Right panel */}
                    <div style={{ width: 220, flexShrink: 0, borderLeft: '1px solid var(--border)', background: 'var(--bg-secondary)', overflowY: 'auto' }}>

                        {/* Status + transition button */}
                        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ ...fieldLabel, marginBottom: 8 }}>Status</div>
                            <Badge label={ticket.status} variant="info" />
                            <div style={{ marginTop: 8 }}>
                                <Button variant="secondary" size="sm" onClick={() => setShowTransitionModal(true)}>
                                    Change Status
                                </Button>
                            </div>
                        </div>

                        {/* Details */}
                        <div style={{ padding: '12px 14px' }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Details</div>

                            <div style={{ marginBottom: 12 }}>
                                <div style={fieldLabel}>Assignee</div>
                                <div style={fieldValue}>
                                    {ticket.assignee ? (
                                        <>
                                            <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 600, color: 'white' }}>
                                                {ticket.assignee.username.slice(0, 2).toUpperCase()}
                                            </div>
                                            {ticket.assignee.username}
                                        </>
                                    ) : (
                                        <span style={{ color: 'var(--text-tertiary)' }}>Unassigned</span>
                                    )}
                                </div>
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <div style={fieldLabel}>Reporter</div>
                                <div style={fieldValue}>
                                    {ticket.reporter ? (
                                        <>
                                            <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 600, color: 'white' }}>
                                                {ticket.reporter.username.slice(0, 2).toUpperCase()}
                                            </div>
                                            {ticket.reporter.username}
                                        </>
                                    ) : <span style={{ color: 'var(--text-tertiary)' }}>Unknown</span>}
                                </div>
                            </div>

                            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />

                            <div style={{ marginBottom: 12 }}>
                                <div style={fieldLabel}>Priority</div>
                                <div style={fieldValue}>
                                    <Badge label={ticket.priority} variant={PRIORITY_VARIANT[ticket.priority]} />
                                </div>
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <div style={fieldLabel}>Type</div>
                                <div style={fieldValue}>
                                    {TYPE_ICON[ticket.type]} {ticket.type}
                                </div>
                            </div>

                            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />

                            {/* Time logging */}
                            <div style={{ marginBottom: 12 }}>
                                <div style={fieldLabel}>Time logged</div>
                                <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 6 }}>
                                    {ticket.timeLogged > 0 ? formatTime(ticket.timeLogged) : 'No time logged'}
                                </div>
                                {!showLogTime ? (
                                    <button onClick={() => setShowLogTime(true)} style={{ fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                        + Log time
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <input
                                            type="number"
                                            min={1}
                                            value={logMinutes}
                                            onChange={(e) => setLogMinutes(e.target.value)}
                                            placeholder="Minutes"
                                            style={{ width: 80, height: 28, padding: '0 6px', fontSize: 12, border: '1px solid var(--border)', borderRadius: 3 }}
                                        />
                                        <Button size="sm" variant="primary" onClick={handleLogTime}>Save</Button>
                                    </div>
                                )}
                            </div>

                            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />

                            <div style={{ marginBottom: 8 }}>
                                <div style={fieldLabel}>Created</div>
                                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <div style={fieldLabel}>Updated</div>
                                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                                    {new Date(ticket.updatedAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />

                            {/* Delete button */}
                            <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                                Delete Ticket
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {showTransitionModal && (
                <TransitionStatusModal
                    ticket={ticket}
                    onConfirm={handleTransition}
                    onClose={() => setShowTransitionModal(false)}
                />
            )}

            {showDeleteModal && (
                <DeleteTicketModal
                    onConfirm={handleDelete}
                    onClose={() => setShowDeleteModal(false)}
                />
            )}
        </>
    );
};

export default TicketDetail;