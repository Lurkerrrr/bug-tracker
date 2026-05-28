import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constants';
import { useAuth } from '../../../app/providers/AuthProvider';

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
}

const iconProps = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
};

const NAV_ITEMS: NavItem[] = [
    {
        label: 'Board',
        path: ROUTES.BOARD,
        icon: (
            <svg {...iconProps}>
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
        ),
    },
    {
        label: 'Backlog',
        path: ROUTES.BACKLOG,
        icon: (
            <svg {...iconProps}>
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
                <path d="M14 4h7" />
                <path d="M14 9h7" />
                <path d="M14 15h7" />
                <path d="M14 20h7" />
            </svg>
        ),
    },
    {
        label: 'Reports',
        path: ROUTES.REPORTS,
        icon: (
            <svg {...iconProps}>
                <path d="M12 16v5" />
                <path d="M16 14.639V21" />
                <path d="M20 10.656V21" />
                <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
                <path d="M4 18.463V21" />
                <path d="M8 14.656V21" />
            </svg>
        ),
    },
    {
        label: 'Team',
        path: ROUTES.TEAM,
        icon: (
            <svg {...iconProps}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <circle cx="9" cy="7" r="4" />
            </svg>
        ),
    },
    {
        label: 'Settings',
        path: ROUTES.SETTINGS,
        icon: (
            <svg {...iconProps}>
                <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        ),
    },
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
                    color: 'white', flexShrink: 0,
                }}>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M12 20v-9" />
                        <path d="M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z" />
                        <path d="M14.12 3.88 16 2" />
                        <path d="M21 21a4 4 0 0 0-3.81-4" />
                        <path d="M21 5a4 4 0 0 1-3.55 3.97" />
                        <path d="M22 13h-4" />
                        <path d="M3 21a4 4 0 0 1 3.81-4" />
                        <path d="M3 5a4 4 0 0 0 3.55 3.97" />
                        <path d="M6 13H2" />
                        <path d="m8 2 1.88 1.88" />
                        <path d="M9 7.13V6a3 3 0 1 1 6 0v1.13" />
                    </svg>
                </div>
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
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ color: 'var(--warning)', flexShrink: 0 }}
                            aria-hidden="true"
                        >
                            <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
                        </svg>
                        Project Alpha
                    </div>
                </div>
            )}

            {/* Nav */}
            <nav style={{ flex: 1, padding: '8px 0', overflow: 'hidden' }}>
                {NAV_ITEMS.map((item) => {
                    const isActive = item.path === ROUTES.COMING_SOON
                        ? location.pathname === ROUTES.COMING_SOON &&
                        (location.state as { from?: string })?.from === '/' + item.label.toLowerCase()
                        : location.pathname === item.path;
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
                            <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                {item.icon}
                            </span>
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
