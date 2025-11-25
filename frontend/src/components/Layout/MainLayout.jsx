import Sidebar from './Sidebar';
import Header from './Header';

const styles = {
    wrapper: {
        display: 'flex',
        minHeight: '100vh'
    },
    contentArea: {
        flex: 1, // Bachi hui saari jagah lelo
        marginLeft: 'var(--sidebar-width)', // Sidebar ke liye jagah chhodo
        marginTop: 'var(--header-height)', // Header ke liye jagah chhodo
        padding: '2rem',
        backgroundColor: 'var(--color-bg-inset)',
        minHeight: 'calc(100vh - var(--header-height))',
        boxSizing: 'border-box'
    }
};

import logoImage from '../../assets/logo_u.png';


// 'children' prop ka matlab hai jo bhi component iske andar pass kiya jayega
function MainLayout({ children }) {
    return (
        <div style={styles.wrapper}>
            <Sidebar logo={logoImage} />
            <Header logo={logoImage} />
            <main style={styles.contentArea}>
                {children} {/* Yahan par Dashboard/Projects page load hoga */}
            </main>
        </div>
    );
}

export default MainLayout;