import { useState } from 'react';
import { useTheme } from '../../../app/providers/ThemeProvider';
import Button from '../ui/Button';

interface TopbarProps {
    onSearch?: (query: string) => void;
    onCreateTicket?: () => void;
}

const Topbar = ({ onSearch, onCreateTicket }: TopbarProps) => {
    const { theme, toggleTheme } = useTheme();
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
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '4px 10px',
                flex: 1,
                maxWidth: 280,
            }}>
                <span style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>🔍</span>
                <input
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search tickets..."
                    style={{
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        fontSize: 13,
                        color: 'var(--text-primary)',
                        width: '100%',
                    }}
                />
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: 4,
                        padding: '4px 8px',
                        color: 'var(--text-secondary)',
                        fontSize: 16,
                        cursor: 'pointer',
                    }}
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>

                <Button variant="primary" onClick={onCreateTicket}>
                    + Create
                </Button>
            </div>
        </div>
    );
};

export default Topbar;