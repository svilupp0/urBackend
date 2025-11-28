import { Link } from 'react-router-dom';


const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--color-bg-main)', // Dark theme background
        color: 'var(--color-text-main)',
        textAlign: 'center',
        padding: '2rem'
    },
    title: {
        fontSize: '3rem',
        marginBottom: '1rem',
        fontWeight: '800'
    },
    accent: {
        color: 'var(--color-primary)'
    },
    description: {
        fontSize: '1.2rem',
        color: 'var(--color-text-muted)',
        marginBottom: '2rem',
        maxWidth: '600px'
    },
    buttonGroup: {
        display: 'flex',
        gap: '1rem'
    },
    linkBtn: {
        textDecoration: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: 'var(--border-radius)',
        fontWeight: '600',
        transition: 'all 0.2s'
    },
    primaryBtn: {
        backgroundColor: 'var(--color-primary)',
        color: '#1C1C1C'
    },
    secondaryBtn: {
        backgroundColor: 'transparent',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text-main)'
    }
};

function LandingPage() {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>
                Welcome to ur<span style={styles.accent}>Backend</span>
            </h1>
            <p style={styles.description}>
                The fastest way to build and manage your backend.
                Instant APIs, Auth, and Storage for developers.
            </p>
            <div style={styles.buttonGroup}>
                <Link to="/signup" style={{ ...styles.linkBtn, ...styles.primaryBtn }}>
                    Get Started Free
                </Link>
                <Link to="/login" style={{ ...styles.linkBtn, ...styles.secondaryBtn }}>
                    Login
                </Link>
            </div>
        </div>
    );
}

export default LandingPage;