import { useTheme } from '../../../app/providers/ThemeProvider';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            role="switch"
            aria-checked={isDark}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            style={{
                position: 'relative',
                width: 52,
                height: 26,
                borderRadius: 13,
                border: '1px solid var(--border)',
                background: 'var(--bg-tertiary)',
                cursor: 'pointer',
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'background-color 0.2s ease, border-color 0.2s ease',
                flexShrink: 0,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hover)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
            }}
        >
            {/* Moon icon (left) */}
            <span
                style={{
                    position: 'absolute',
                    left: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDark ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                    transition: 'color 0.2s ease',
                    pointerEvents: 'none',
                }}
                aria-hidden="true"
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            </span>

            {/* Sun icon (right) */}
            <span
                style={{
                    position: 'absolute',
                    right: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDark ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                    transition: 'color 0.2s ease',
                    pointerEvents: 'none',
                }}
                aria-hidden="true"
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
            </span>

            {/* Sliding knob */}
            <span
                style={{
                    position: 'absolute',
                    top: 2,
                    left: isDark ? 2 : 28,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'var(--bg-primary)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'left 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    pointerEvents: 'none',
                }}
                aria-hidden="true"
            />
        </button>
    );
};

export default ThemeToggle;