import Sidebar from './Sidebar';
import Header from './Header'; // Purana Header use kar rahe hain top bar ke liye
import logoImage from '../../assets/logo_u.png';

function MainLayout({ children }) {
    return (
        <div className="app-shell">
            <Sidebar logo={logoImage} />

            {/* Main Content Area */}
            <div className="main-content">
                {/* Fixed Header at Top Right (User Profile etc.) */}
                <Header logo={logoImage} />

                {/* Dynamic Page Content */}
                <div className="content-wrapper">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default MainLayout;