import AppLayout from '../shared/components/layout/AppLayout';

const ReportsPage = () => {
    return (
        <AppLayout>
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
            }}>
                <h1 style={{
                    fontSize: 24,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: '0 0 16px 0',
                }}>
                    Reports
                </h1>
            </div>
        </AppLayout>
    );
};

export default ReportsPage;
