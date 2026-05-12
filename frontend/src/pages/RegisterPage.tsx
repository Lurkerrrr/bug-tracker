import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../features/auth/services/auth.service';
import { useAuth } from '../app/providers/AuthProvider';
import { ROUTES } from '../shared/constants/routes.constants';
import { UserRole } from '../features/auth/types/auth.types';
import Input from '../shared/components/ui/Input';
import Button from '../shared/components/ui/Button';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        role: UserRole.DEVELOPER,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await authService.register(form);
            login(data.user, data.access_token);
            navigate(ROUTES.BOARD);
        } catch {
            setError('Registration failed. Username or email may already exist.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
        }}>
            <div style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '2.5rem 2rem',
                width: '100%',
                maxWidth: 360,
                boxShadow: 'var(--shadow-md)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: 32, height: 32, background: 'var(--accent)',
                        borderRadius: 6, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 18,
                    }}>🐛</div>
                    <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>Bug Tracker</span>
                </div>

                <h1 style={{ fontSize: 22, fontWeight: 500, textAlign: 'center', marginBottom: 6, color: 'var(--text-primary)' }}>
                    Create your account
                </h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>
                    Join Bug Tracker today
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Input
                        label="Username"
                        required
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        placeholder="Enter username"
                        autoFocus
                    />
                    <Input
                        label="Email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="Enter email"
                    />
                    <Input
                        label="Password"
                        type="password"
                        required
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Min. 8 characters"
                        minLength={8}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Role</label>
                        <select
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                            style={{ height: 36, padding: '0 10px', borderRadius: 4 }}
                        >
                            <option value={UserRole.DEVELOPER}>Developer</option>
                            <option value={UserRole.TESTER}>Tester</option>
                            <option value={UserRole.ADMIN}>Admin</option>
                        </select>
                    </div>

                    {error && (
                        <div style={{ fontSize: 13, color: 'var(--danger)', background: 'var(--danger-bg)', padding: '8px 12px', borderRadius: 4 }}>
                            {error}
                        </div>
                    )}

                    <Button variant="primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                        {loading ? 'Creating account...' : 'Sign up'}
                    </Button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
                    Already have an account?{' '}
                    <Link to={ROUTES.LOGIN} style={{ color: 'var(--accent)' }}>Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;