import { User } from 'lucide-react';

const styles = {
    header: {
        height: 'var(--header-height)',
        backgroundColor: 'var(--color-bg-main)', // Same as sidebar for seamless look
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // Changed to space-between for logo and user
        padding: '0 2rem',
        position: 'fixed',
        top: 0,
        right: 0,
        left: 'var(--sidebar-width)',
        zIndex: 10,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' // Subtle shadow
    },
    logo: {
        height: '40px', // Adjust height as needed
        width: 'auto'
    },
    avatarButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '6px 12px',
        borderRadius: 'var(--border-radius)',
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        cursor: 'pointer',
        color: 'var(--color-text-main)'
    },
    avatarCircle: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1C1C1C',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    },
    userName: {
        fontWeight: 500,
        fontSize: '0.9rem'
    }
};

// Logo image is now passed as a prop
function Header({ logo, fullWidth = false }) {
    const headerStyle = {
        ...styles.header,
        left: fullWidth ? 0 : styles.header.left
    };

    return (
        <header style={headerStyle}>
            {/* Logo added here */}
            <img src={logo} alt="urBackend Logo" style={styles.logo} />

            {/* Avatar Button (Future mein dropdown banega) */}
            <div style={styles.avatarButton}>
                <div style={styles.avatarCircle}>DA</div> {/* DA = Developer Account initials */}
                <span style={styles.userName}>Dev Account</span>
            </div>
        </header>
    );
}

export default Header;