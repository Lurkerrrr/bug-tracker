interface BadgeProps {
    label: string;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent';
}

const variantStyles: Record<string, React.CSSProperties> = {
    default: { background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' },
    success: { background: 'var(--success-bg)', color: 'var(--success)' },
    warning: { background: 'var(--warning-bg)', color: 'var(--warning)' },
    danger: { background: 'var(--danger-bg)', color: 'var(--danger)' },
    info: { background: 'var(--accent-bg)', color: 'var(--accent)' },
    accent: { background: 'var(--accent)', color: 'var(--accent-text)' },
};

const Badge = ({ label, variant = 'default' }: BadgeProps) => {
    return (
        <span
            style={{
                ...variantStyles[variant],
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
            }}
        >
            {label}
        </span>
    );
};

export default Badge;