const Spinner = ({ size = 24 }: { size?: number }) => {
    return (
        <div
            style={{
                width: size,
                height: size,
                border: `2px solid var(--border)`,
                borderTop: `2px solid var(--accent)`,
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
            }}
        />
    );
};

// Inject keyframes once
const style = document.createElement('style');
style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);

export default Spinner;