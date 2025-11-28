import { Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 1. Import Auth Hook
import {
    LayoutDashboard,
    Database,
    Shield,
    HardDrive,
    Settings,
    ArrowLeft,
    FileText,
    UserCog,
    LogOut // 2. Import Logout Icon
} from 'lucide-react';

function Sidebar({ logo }) {
    const location = useLocation();
    const { projectId } = useParams();
    const { logout } = useAuth(); // 3. Get logout function

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                {projectId ? (
                    <Link to="/dashboard" className="nav-item" style={{ padding: 0, color: 'var(--color-text-main)' }}>
                        <ArrowLeft size={20} />
                        <span style={{ marginLeft: '10px', fontWeight: 600 }}>Back to Projects</span>
                    </Link>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Logo" style={{ height: '24px' }} />
                        <span className="sidebar-logo-text">urBackend</span>
                    </div>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="sidebar-nav">
                {projectId ? (
                    <>
                        <div className="nav-section-label">Project Modules</div>

                        <Link to={`/project/${projectId}`} className={`nav-item ${isActive(`/project/${projectId}`) ? 'active' : ''}`}>
                            <LayoutDashboard size={18} />
                            <span>Overview</span>
                        </Link>

                        <Link to={`/project/${projectId}/database`} className={`nav-item ${isActive(`/project/${projectId}/database`) ? 'active' : ''}`}>
                            <Database size={18} />
                            <span>Database</span>
                        </Link>

                        <Link to={`/project/${projectId}/auth`} className={`nav-item ${isActive(`/project/${projectId}/auth`) ? 'active' : ''}`}>
                            <Shield size={18} />
                            <span>Authentication</span>
                        </Link>

                        <Link to={`/project/${projectId}/storage`} className={`nav-item ${isActive(`/project/${projectId}/storage`) ? 'active' : ''}`}>
                            <HardDrive size={18} />
                            <span>Storage</span>
                        </Link>

                        <Link to={`/project/${projectId}/settings`} className={`nav-item ${isActive(`/project/${projectId}/settings`) ? 'active' : ''}`}>
                            <Settings size={18} />
                            <span>Settings</span>
                        </Link>
                    </>
                ) : (
                    <>
                        <div className="nav-section-label">General</div>
                        <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
                            <LayoutDashboard size={18} />
                            <span>All Projects</span>
                        </Link>
                        <Link to="/docs" className={`nav-item ${isActive('/docs') ? 'active' : ''}`}>
                            <FileText size={18} />
                            <span>Documentation</span>
                        </Link>

                        <Link to="/settings" className={`nav-item ${isActive('/settings') ? 'active' : ''}`}>
                            <UserCog size={18} />
                            <span>Account Settings</span>
                        </Link>
                    </>
                )}
            </nav>

            {/* 4. Logout Footer (Fixed at bottom) */}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)' }}>
                <button
                    onClick={logout}
                    className="nav-item"
                    style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-danger)', // Red color for attention
                        justifyContent: 'flex-start'
                    }}
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;