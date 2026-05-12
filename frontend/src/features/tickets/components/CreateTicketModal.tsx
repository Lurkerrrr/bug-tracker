import { useState } from 'react';
import { ticketsService } from '../services/tickets.service';
import { TicketType, TicketPriority } from '../types/ticket.types';
import type { Ticket, CreateTicketDto } from '../types/ticket.types';
import Modal from '../../../shared/components/ui/Modal';
import Input from '../../../shared/components/ui/Input';
import Button from '../../../shared/components/ui/Button';

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (ticket: Ticket) => void;
}

const CreateTicketModal = ({ isOpen, onClose, onCreated }: CreateTicketModalProps) => {
    const [form, setForm] = useState<CreateTicketDto>({
        title: '',
        description: '',
        type: TicketType.BUG,
        priority: TicketPriority.MEDIUM,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const ticket = await ticketsService.create(form);
            onCreated(ticket);
            onClose();
            setForm({ title: '', description: '', type: TicketType.BUG, priority: TicketPriority.MEDIUM });
        } catch {
            setError('Failed to create ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const labelStyle: React.CSSProperties = {
        fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5, display: 'block',
    };

    const selectStyle: React.CSSProperties = {
        width: '100%', height: 36, padding: '0 10px',
        border: '1px solid var(--border)', borderRadius: 4,
        background: 'var(--bg-primary)', color: 'var(--text-primary)',
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-primary)' }}>Create issue</h2>
                <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, color: 'var(--text-tertiary)', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit}>
                <div style={{ padding: '16px 20px', overflowY: 'auto', maxHeight: '60vh', display: 'flex', flexDirection: 'column', gap: 14 }}>

                    {/* Issue type */}
                    <div>
                        <label style={labelStyle}>Issue type <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <select style={selectStyle} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TicketType })}>
                            <option value={TicketType.BUG}>🐛 Bug</option>
                            <option value={TicketType.TASK}>✅ Task</option>
                            <option value={TicketType.EPIC}>⚡ Epic</option>
                        </select>
                    </div>

                    {/* Summary */}
                    <Input
                        label="Summary"
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Short description of the issue"
                        minLength={3}
                    />

                    {/* Description */}
                    <div>
                        <label style={labelStyle}>Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Provide more details about the issue..."
                            rows={4}
                            style={{
                                width: '100%', padding: '8px 10px',
                                border: '1px solid var(--border)', borderRadius: 4,
                                background: 'var(--bg-primary)', color: 'var(--text-primary)',
                                resize: 'vertical', fontFamily: 'inherit', fontSize: 13,
                            }}
                        />
                    </div>

                    {/* Priority + Type row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <label style={labelStyle}>Priority</label>
                            <select style={selectStyle} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TicketPriority })}>
                                <option value={TicketPriority.LOW}>🟢 Low</option>
                                <option value={TicketPriority.MEDIUM}>🟡 Medium</option>
                                <option value={TicketPriority.HIGH}>🔴 High</option>
                                <option value={TicketPriority.CRITICAL}>🚨 Critical</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div style={{ fontSize: 13, color: 'var(--danger)', background: 'var(--danger-bg)', padding: '8px 12px', borderRadius: 4 }}>
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                    gap: 8, padding: '12px 20px', borderTop: '1px solid var(--border)',
                    background: 'var(--bg-secondary)',
                }}>
                    <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateTicketModal;