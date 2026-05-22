import AppLayout from '../shared/components/layout/AppLayout';

const BacklogPage = () => {
    return (
        <AppLayout>
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
            }}>
                <h1 style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: 0,
                }}>
                    Backlog
                </h1>
                <p style={{
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    marginTop: 8,
                }}>
                    Ticket list view (coming next session)
                </p>
            </div>
        </AppLayout>
    );
};

export default BacklogPage;
