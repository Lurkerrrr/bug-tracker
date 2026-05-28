import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../shared/constants/routes.constants';
import { useAuth } from './providers/AuthProvider';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import BoardPage from '../pages/BoardPage';
import BacklogPage from '../pages/BacklogPage';
import TeamPage from '../pages/TeamPage';
import TicketPage from '../pages/TicketPage';
import ComingSoonPage from '../pages/ComingSoonPage';
import SettingsPage from '../pages/SettingsPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) return null;
    return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) return null;
    return !isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.BOARD} replace />;
};

const Router = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path={ROUTES.LOGIN} element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path={ROUTES.REGISTER} element={<PublicRoute><RegisterPage /></PublicRoute>} />
                <Route
                    path={ROUTES.BOARD}
                    element={
                        <ProtectedRoute>
                            <BoardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.BACKLOG}
                    element={
                        <ProtectedRoute>
                            <BacklogPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.TEAM}
                    element={
                        <ProtectedRoute>
                            <TeamPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.TICKET}
                    element={
                        <ProtectedRoute>
                            <TicketPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.COMING_SOON}
                    element={
                        <ProtectedRoute>
                            <ComingSoonPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.SETTINGS}
                    element={
                        <ProtectedRoute>
                            <SettingsPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
            </Routes>
        </HashRouter>
    );
};



export default Router;
