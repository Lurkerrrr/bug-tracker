import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import Router from './Router';

const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router />
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;