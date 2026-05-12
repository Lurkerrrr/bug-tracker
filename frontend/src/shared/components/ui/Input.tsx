import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = ({ label, error, style, ...props }: InputProps) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {label && (
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {label}
                    {props.required && <span style={{ color: 'var(--danger)', marginLeft: '2px' }}>*</span>}
                </label>
            )}
            <input
                style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 10px',
                    background: 'var(--bg-primary)',
                    border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
                    borderRadius: '4px',
                    color: 'var(--text-primary)',
                    ...style,
                }}
                {...props}
            />
            {error && (
                <span style={{ fontSize: '12px', color: 'var(--danger)' }}>{error}</span>
            )}
        </div>
    );
};

export default Input;