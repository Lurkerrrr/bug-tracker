import { useState } from 'react';
import Modal from '../../../shared/components/ui/Modal';
import Button from '../../../shared/components/ui/Button';

interface DeleteTicketModalProps {
    onConfirm: (reason: string) => Promise<void>;
    onClose: () => void;
}

const DeleteTicketModal = ({ onConfirm, onClose }: DeleteTicketModalProps) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!reason.trim() || reason.trim().length < 3) {
            setError('A reason of at least 3 characters is required.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await onConfirm(reason);
            onClose();
        } catch {
            setError('Delete failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen onClose={onClose}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>Delete Ticket</span>
                <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, color: 'var(--text-tertiary)', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    This action cannot be undone. Please provide a reason for deleting this ticket.
                </div>

                <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 4 }}>
                        Reason <span style={{ color: 'var(--danger)' }}>*</span>
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Why is this ticket being deleted?"
                        rows={3}
                        style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 4, background: 'var(--bg-primary)', color: 'var(--text-primary)', resize: 'none', fontFamily: 'inherit', fontSize: 13 }}
                    />
                </div>

                {error && <div style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</div>}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="danger" onClick={handleConfirm} disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteTicketModal;