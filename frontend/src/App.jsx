import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MainLayout from './components/Layout/MainLayout';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';

// 1. Import CreateCollection
import CreateCollection from './pages/CreateCollection';

function App() {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/create-project" element={
          <ProtectedRoute>
            <MainLayout>
              <CreateProject />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/project/:projectId" element={
          <ProtectedRoute>
            <MainLayout>
              <ProjectDetails />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* 2. Add Create Collection Route */}
        <Route path="/project/:projectId/create-collection" element={
          <ProtectedRoute>
            <MainLayout>
              <CreateCollection />
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