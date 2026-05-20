import { useAuth } from '../app/providers/AuthProvider';
import AppLayout from '../shared/components/layout/AppLayout';

const SettingsPage = () => {
    const { user } = useAuth();

    const initials = user?.username?.slice(0, 2).toUpperCase() || 'U';

    return (
        <AppLayout>
            <div style={{
                flex: 1,
                overflow: 'auto',
                padding: '32px 40px',
            }}>
                <div style={{ maxWidth: 720, margin: '0 auto' }}>
                    <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                        Settings
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>
                        Your account information and application details
                    </p>

                    {/* Account section */}
                    <section style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        padding: 24,
                        marginBottom: 16,
                    }}>
                        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
                            Account
                        </h2>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                            <div style={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                background: 'var(--accent)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 16,
                                fontWeight: 600,
                                color: 'white',
                                flexShrink: 0,
                            }}>
                                {initials}
                            </div>
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {user?.username}
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                                    {user?.role}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gap: 12 }}>
                            <SettingsRow label="Username" value={user?.username ?? '—'} />
                            <SettingsRow label="Email" value={user?.email ?? '—'} />
                            <SettingsRow label="Role" value={user?.role ?? '—'} capitalize />
                            <SettingsRow label="User ID" value={user?.id ?? '—'} monospace />
                        </div>
                    </section>

                    {/* About section */}
                    <section style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        padding: 24,
                    }}>
                        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
                            About
                        </h2>

                        <div style={{ display: 'grid', gap: 12 }}>
                            <SettingsRow label="Application" value="Bug Tracker" />
                            <SettingsRow label="Version" value="1.0.0" monospace />
                            <SettingsRow label="Stack" value="React · NestJS · PostgreSQL · Electron" />
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
};

interface SettingsRowProps {
    label: string;
    value: string;
    capitalize?: boolean;
    monospace?: boolean;
}

const SettingsRow = ({ label, value, capitalize, monospace }: SettingsRowProps) => (
    <div style={{
        display: 'grid',
        gridTemplateColumns: '180px 1fr',
        alignItems: 'center',
        gap: 16,
        paddingBottom: 12,
        borderBottom: '1px solid var(--border)',
    }}>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{label}</div>
        <div style={{
            fontSize: 13,
            color: 'var(--text-primary)',
            textTransform: capitalize ? 'capitalize' : 'none',
            fontFamily: monospace ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : 'inherit',
            wordBreak: 'break-all',
        }}>
            {value}
        </div>
    </div>
);

export default SettingsPage;