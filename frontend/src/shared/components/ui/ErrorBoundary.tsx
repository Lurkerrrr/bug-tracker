import { Component, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

// Class component required — React error boundaries cannot be functional components
class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: { componentStack: string }) {
        console.error('ErrorBoundary caught:', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    gap: 16,
                    background: 'var(--bg-secondary)',
                }}>
                    <div style={{ fontSize: 48 }}>💥</div>
                    <h1 style={{ fontSize: 20, fontWeight: 500, color: 'var(--text-primary)' }}>
                        Something went wrong
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 400, textAlign: 'center' }}>
                        {this.state.error?.message || 'An unexpected error occurred.'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '8px 20px',
                            background: 'var(--accent)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            fontSize: 14,
                            cursor: 'pointer',
                        }}
                    >
                        Reload page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;