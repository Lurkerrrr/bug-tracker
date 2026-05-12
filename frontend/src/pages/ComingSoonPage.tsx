import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../shared/constants/routes.constants';
import AppLayout from '../shared/components/layout/AppLayout';

const MESSAGES: Record<string, { emoji: string; title: string; subtitle: string }> = {
    '/backlog': {
        emoji: '📦',
        title: 'The backlog is... in the backlog',
        subtitle: 'Ironically, building this feature is itself a backlog item.',
    },
    '/reports': {
        emoji: '📊',
        title: 'No data to report',
        subtitle: 'We could show you charts, but they would all just be question marks.',
    },
    '/team': {
        emoji: '👻',
        title: 'The team page is haunted',
        subtitle: 'Our developers ran away when they saw the deadline. Coming soon™',
    },
    '/settings': {
        emoji: '⚙️',
        title: 'Nothing to configure here',
        subtitle: 'Except maybe your expectations. Lower them slightly.',
    },
};

const DEFAULT_MESSAGE = {
    emoji: '🚧',
    title: 'Under construction',
    subtitle: 'Our best developers are working on this. Both of them.',
};

const ComingSoonPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Find the previous path from state or use default message
    const fromPath = (location.state as { from?: string })?.from || '';
    const message = MESSAGES[fromPath] || DEFAULT_MESSAGE;

    return (
        <AppLayout>
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                padding: 40,
            }}>
                <div style={{ fontSize: 64 }}>{message.emoji}</div>
                <h1 style={{ fontSize: 24, fontWeight: 500, color: 'var(--text-primary)', textAlign: 'center' }}>
                    {message.title}
                </h1>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 400 }}>
                    {message.subtitle}
                </p>
                <div style={{
                    marginTop: 8,
                    padding: '6px 16px',
                    background: 'var(--accent-bg)',
                    color: 'var(--accent)',
                    borderRadius: 4,
                    fontSize: 13,
                    fontWeight: 500,
                }}>
                    🚀 Coming in v2.0 (probably)
                </div>
                <button
                    onClick={() => navigate(ROUTES.BOARD)}
                    style={{
                        marginTop: 8,
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent)',
                        fontSize: 14,
                        cursor: 'pointer',
                    }}
                >
                    ← Back to board
                </button>
            </div>
        </AppLayout>
    );
};

export default ComingSoonPage;