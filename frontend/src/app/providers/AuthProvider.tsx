import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import type { User } from '../../features/auth/types/auth.types';
import { authService } from '../../features/auth/services/auth.service';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authService.me()
            .then((user) => setUser(user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const handleUnauthorized = () => {
            setUser(null);
            setLoading(false);
        };
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, []);

    const login = useCallback((user: User) => setUser(user), []);

    const logout = useCallback(async () => {
        await authService.logout();
        setUser(null);
    }, []);

    const value = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        isLoading: loading,
        login,
        logout,
    }), [user, loading, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};