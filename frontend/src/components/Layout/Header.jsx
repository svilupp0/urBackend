import { useAuth } from '../../context/AuthContext';
import { Menu } from 'lucide-react'; // Import Menu Icon

function Header({ onToggleSidebar }) { // Prop receive kiya
    const { user } = useAuth();
    const initial = user?.email ? user.email[0].toUpperCase() : 'D';

    return (
        <header style={{
            height: 'var(--header-height)',
            backgroundColor: 'var(--color-bg-main)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', // Changed to space-between
            padding: '0 1rem', // Reduced padding for mobile
            position: 'fixed',
            top: 0,
            right: 0,
            // Mobile fix: left should be 0, margin-left will handle desktop
            left: 0,
            zIndex: 40,
            // Desktop: Push header to right of sidebar
            // We use a media query logic via inline style or keep consistent
            // Better approach: Let CSS handle margins via .main-content structure
            width: '100%',
            paddingLeft: 'calc(var(--sidebar-width) + 1rem)' // Desktop padding
        }} className="responsive-header">

            {/* CSS override for mobile padding in style tag below */}
            <style>{`
                @media (max-width: 768px) {
                    .responsive-header {
                        padding-left: 1rem !important; /* Reset padding on mobile */
                    }
                    .mobile-toggle {
                        display: block !important;
                    }
                }
                .mobile-toggle {
                    display: none;
                }
            `}</style>

            {/* Mobile Menu Button */}
            <button
                onClick={onToggleSidebar}
                className="btn btn-ghost mobile-toggle"
                style={{ padding: '8px', color: 'var(--color-text-main)' }}
            >
                <Menu size={24} />
            </button>

            {/* Spacer to push User Profile to right */}
            <div style={{ flex: 1 }}></div>

            {/* User Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {user?.email || 'Dev'}
                </span>
                <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
                    color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '0.9rem'
                }}>
                    {initial}
                </div>
            </div>
        </header>
    );
}

export default Header;