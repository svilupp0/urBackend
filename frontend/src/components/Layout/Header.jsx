import { useAuth } from '../../context/AuthContext';

function Header() { // Logo prop hata diya kyunki Sidebar mein already logo hai
    const { user } = useAuth();

    // Email ka pehla letter (Avatar ke liye)
    const initial = user?.email ? user.email[0].toUpperCase() : 'D';

    return (
        <header style={{
            height: 'var(--header-height)',
            backgroundColor: 'var(--color-bg-main)', // Transparent feel
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end', // Right align content
            padding: '0 2rem',
            position: 'fixed',
            top: 0,
            right: 0,
            left: 'var(--sidebar-width)',
            zIndex: 10
        }}>

            {/* User Profile (Minimal) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {user?.email || 'Developer Mode'}
                </span>

                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                    {initial}
                </div>
            </div>

        </header>
    );
}

export default Header;