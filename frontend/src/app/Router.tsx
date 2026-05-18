import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../shared/constants/routes.constants';
import { useAuth } from './providers/AuthProvider';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import BoardPage from '../pages/BoardPage';
import TicketPage from '../pages/TicketPage';
import ComingSoonPage from '../pages/ComingSoonPage';

// Protects routes that require authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
};

const Router = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                <Route
                    path={ROUTES.BOARD}
                    element={
                        <ProtectedRoute>
                            <BoardPage />
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
                <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
            </Routes>
        </HashRouter>
    );
};

export default Router;