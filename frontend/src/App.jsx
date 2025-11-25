import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MainLayout from './components/Layout/MainLayout';
// 1. Import Landing Page
import LandingPage from './pages/LandingPage';

import ProtectedRoute from './components/ProtectedRoute';



// Placeholder Dashboard Component (Yeh abhi yahi rehne dete hain)
function DashboardHome() {
  // ... (iska code same rahega jaisa pichle step mein tha)
  const pageHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  };
  return (
    <div>
      <div style={pageHeaderStyle}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Projects</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '5px' }}>
            Manage your backend projects and APIs.
          </p>
        </div>
        <button className="btn btn-primary">+ New Project</button>
      </div>
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>No projects found</h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          Get started by creating your first backend project.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* 2. Wrap the Dashboard route with ProtectedRoute */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardHome />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;