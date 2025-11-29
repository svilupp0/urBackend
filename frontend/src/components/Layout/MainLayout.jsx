import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import logoImage from '../../assets/logo_u.png';

function MainLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="app-shell">
            {/* Mobile Overlay - Only visible when sidebar is open on mobile */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar - Pass state and close function */}
            <Sidebar
                logo={logoImage}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="main-content">
                {/* Header - Pass toggle function */}
                <Header
                    logo={logoImage}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                {/* Dynamic Page Content */}
                <div className="content-wrapper">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default MainLayout;