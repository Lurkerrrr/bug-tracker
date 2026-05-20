import { useState } from 'react';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';

interface TopbarProps {
    onSearch?: (query: string) => void;
    onCreateTicket?: () => void;
}

const Topbar = ({ onSearch, onCreateTicket }: TopbarProps) => {
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        onSearch?.(e.target.value);
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 16px',
            height: 48,
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-primary)',
            flexShrink: 0,
        }}>
            {/* Search */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    padding: '6px 12px',
                    flex: 1,
                    maxWidth: 360,
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                }}
                onFocusCapture={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-bg)';
                }}
                onBlurCapture={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}
                    aria-hidden="true"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                    value={search}
                    onChange={handleSearch}
                    placeholder="Find a ticket..."
                    aria-label="Search tickets"
                    style={{
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        boxShadow: 'none',
                        fontSize: 13,
                        color: 'var(--text-primary)',
                        width: '100%',
                        padding: 0,
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = 'transparent';
                    }}
                />
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Theme toggle */}
                <ThemeToggle />

                <Button variant="primary" onClick={onCreateTicket}>
                    + Create
                </Button>
            </div>
        </div>
    );
};

export default Topbar;