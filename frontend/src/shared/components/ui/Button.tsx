import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md';
    children: ReactNode;
}

const styles = {
    base: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        border: '1px solid transparent',
        borderRadius: '4px',
        fontWeight: 500,
        transition: 'all 0.15s ease',
        cursor: 'pointer',
    } as React.CSSProperties,
    variants: {
        primary: {
            background: 'var(--accent)',
            color: 'var(--accent-text)',
            borderColor: 'var(--accent)',
        },
        secondary: {
            background: 'var(--bg-primary)',
            color: 'var(--text-secondary)',
            borderColor: 'var(--border)',
        },
        danger: {
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            borderColor: 'var(--danger)',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--text-secondary)',
            borderColor: 'transparent',
        },
    },
    sizes: {
        sm: { padding: '4px 10px', fontSize: '12px' },
        md: { padding: '6px 14px', fontSize: '14px' },
    },
};

const Button = ({
    variant = 'secondary',
    size = 'md',
    children,
    style,
    ...props
}: ButtonProps) => {
    return (
        <button
            style={{
                ...styles.base,
                ...styles.variants[variant],
                ...styles.sizes[size],
                ...style,
            }}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;