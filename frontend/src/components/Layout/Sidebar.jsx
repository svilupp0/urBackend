import { LayoutDashboard, FileText, Settings, Database } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const styles = {
    sidebar: {
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--color-bg-main)',
        borderRight: '1px solid var(--color-border)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        padding: '1.5rem 1rem', // Thoda padding badhaya
        display: 'flex',
        flexDirection: 'column'
    },
    logoContainer: {
        marginBottom: '2.5rem',
        paddingLeft: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    logoText: {
        fontWeight: '800',
        fontSize: '1.4rem',
        color: 'var(--color-text-main)',
        letterSpacing: '-0.5px'
    },
    logoAccent: {
        color: 'var(--color-primary)'
    },
    menuList: {
        listStyle: 'none',
        padding: 0,
        margin: 0
    },
    logo: {
        height: '40px', // Adjust height as needed
        width: 'auto'
    },

};

// Menu Items ka data
const menuItems = [
    { path: '/dashboard', label: 'Projects', icon: LayoutDashboard },
    { path: '/collections', label: 'Collections', icon: Database }, // Future use
    { path: '/docs', label: 'Docs', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
];

function SidebarItem({ item, isActive }) {
    const Icon = item.icon;

    // Dynamic Styles for active state
    const itemStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--border-radius)',
        cursor: 'pointer',
        textDecoration: 'none',
        marginBottom: '0.5rem',
        transition: 'all 0.2s ease',
        // Active vs Inactive colors
        backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
        color: isActive ? '#1C1C1C' : 'var(--color-text-muted)',
        fontWeight: isActive ? '600' : '500'
    };

    return (
        <li>
            <Link to={item.path} style={itemStyle} className="sidebar-item-hover">
                <Icon size={20} style={{ marginRight: '12px' }} />
                <span>{item.label}</span>
            </Link>
        </li>
    );
}

function Sidebar({ logo }) {
    const location = useLocation(); // Pata karne ke liye ki abhi kis page par hain

    return (
        <aside style={styles.sidebar}>
            {/* Better Logo */}
            <div style={styles.logoContainer}>
                <img src={logo} alt="urBackend Logo" style={styles.logo} />
                <div style={styles.logoText}>
                    ur<span style={styles.logoAccent}>Backend</span>
                </div>
            </div>

            <ul style={styles.menuList}>
                {menuItems.map((item) => (
                    <SidebarItem
                        key={item.path}
                        item={item}
                        isActive={location.pathname === item.path} // Check if active
                    />
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;