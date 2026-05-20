import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constants';
import { useAuth } from '../../../app/providers/AuthProvider';

interface NavItem {
    label: string;
    path: string;
    icon: string;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Board', path: ROUTES.BOARD, icon: '⊞' },
    { label: 'Backlog', path: ROUTES.COMING_SOON, icon: '≡' },
    { label: 'Reports', path: ROUTES.COMING_SOON, icon: '↗' },
    { label: 'Team', path: ROUTES.COMING_SOON, icon: '👥' },
    { label: 'Settings', path: ROUTES.COMING_SOON, icon: '⚙' },
];

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate(ROUTES.LOGIN);
    };

    const initials = user?.username?.slice(0, 2).toUpperCase() || 'U';

    return (
        <div
            style={{
                width: collapsed ? 48 : 220,
                minWidth: collapsed ? 48 : 220,
                background: 'var(--bg-secondary)',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.2s ease, min-width 0.2s ease',
                overflow: 'hidden',
                height: '100vh',
            }}
        >
            {/* Logo */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px',
                borderBottom: '1px solid var(--border)',
                minHeight: 48,
            }}>
                <div style={{
                    width: 28, height: 28,
                    background: 'var(--accent)',
                    borderRadius: 6,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: 14, flexShrink: 0,
                }}>🐛</div>
                {!collapsed && (
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                        Bug Tracker
                    </span>
                )}
            </div>

            {/* Project */}
            {!collapsed && (
                <div style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                        Current project
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        📁 Project Alpha
                    </div>
                </div>
            )}

            {/* Nav */}
            <nav style={{ flex: 1, padding: '8px 0', overflow: 'hidden' }}>
                {NAV_ITEMS.map((item) => {
                    const isActive = item.path === ROUTES.BOARD
                        ? location.pathname === ROUTES.BOARD
                        : location.pathname === ROUTES.COMING_SOON &&
                        (location.state as { from?: string })?.from === '/' + item.label.toLowerCase();
                    return (
                        <div
                            key={item.label}
                            onClick={() => {
                                if (item.path === ROUTES.COMING_SOON) {
                                    navigate(ROUTES.COMING_SOON, { state: { from: '/' + item.label.toLowerCase() } });
                                } else {
                                    navigate(item.path);
                                }
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '8px 12px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                                background: isActive ? 'var(--accent-bg)' : 'transparent',
                                borderRight: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                                fontWeight: isActive ? 500 : 400,
                                fontSize: 13,
                            }}
                        >
                            <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                            {!collapsed && <span>{item.label}</span>}
                        </div>
                    );
                })}
            </nav>

            {/* User */}
            <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        width: 28, height: 28,
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 600, color: 'white', flexShrink: 0,
                    }}>
                        {initials}
                    </div>
                    {!collapsed && (
                        <>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user?.username}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>
                                    {user?.role}
                                </div>
                            </div>
                            <span
                                onClick={handleLogout}
                                title="Logout"
                                style={{ cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: 16 }}
                            >
                                ⏻
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Collapse toggle at very bottom */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-expanded={!collapsed}
                style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    color: 'var(--text-tertiary)',
                    fontSize: 13,
                    borderTop: '1px solid var(--border)',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: 'none',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: 10,
                    transition: 'background-color 0.15s ease, color 0.15s ease',
                    width: '100%',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-tertiary)';
                }}
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        flexShrink: 0,
                        transform: collapsed ? 'scaleX(-1)' : 'none',
                        transition: 'transform 0.2s ease',
                    }}
                    aria-hidden="true"
                >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
                {!collapsed && <span>Toggle sidebar</span>}
            </button>
        </div>
    );
};

export default Sidebar;