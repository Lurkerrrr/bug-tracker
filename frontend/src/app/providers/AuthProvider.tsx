import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../../features/auth/types/auth.types';
import { authService } from '../../features/auth/services/auth.service';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Restore session from localStorage on app load
    useEffect(() => {
        const savedUser = authService.getCurrentUser();
        if (savedUser && authService.isAuthenticated()) {
            setUser(savedUser);
        }
    }, []);

    const login = (user: User, token: string) => {
        authService.saveSession({ access_token: token, user });
        setUser(user);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for consuming auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};