import { useState } from 'react';
import { TICKET_TRANSITIONS } from '../types/ticket.types';
import type { Ticket } from '../types/ticket.types';
import Modal from '../../../shared/components/ui/Modal';
import Button from '../../../shared/components/ui/Button';

interface TransitionStatusModalProps {
    ticket: Ticket;
    onConfirm: (action: string, comment: string) => Promise<void>;
    onClose: () => void;
}

const TransitionStatusModal = ({ ticket, onConfirm, onClose }: TransitionStatusModalProps) => {
    const transitions = TICKET_TRANSITIONS[ticket.status] || [];
    const [selectedAction, setSelectedAction] = useState(transitions[0]?.action ?? '');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!selectedAction) {
            setError('Please select a transition.');
            return;
        }
        if (!comment.trim()) {
            setError('A comment is required.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await onConfirm(selectedAction, comment);
            onClose();
        } catch {
            setError('Transition failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen onClose={onClose}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>Change Status</span>
                <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, color: 'var(--text-tertiary)', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>
                        New Status
                    </label>
                    <select
                        value={selectedAction}
                        onChange={(e) => setSelectedAction(e.target.value)}
                        style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 4, background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13 }}
                    >
                        {transitions.map(({ action, label }) => (
                            <option key={action} value={action}>{label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>
                        Comment <span style={{ color: 'var(--danger)' }}>*</span>
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Explain the reason for this transition..."
                        rows={3}
                        style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 4, background: 'var(--bg-primary)', color: 'var(--text-primary)', resize: 'none', fontFamily: 'inherit', fontSize: 13 }}
                    />
                </div>

                {error && <div style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</div>}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleConfirm} disabled={loading}>
                        {loading ? 'Saving...' : 'Confirm'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default TransitionStatusModal;