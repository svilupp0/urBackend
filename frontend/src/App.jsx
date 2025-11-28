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
import CreateCollection from './pages/CreateCollection';

// 1. Import Database Page
import Database from './pages/Database';

// 2. Import Storage Page
import Storage from './pages/Storage';

// 3. Import Docs Page
import Docs from './pages/Docs';

import Auth from './pages/Auth';

import Settings from './pages/Settings';

import ProjectSettings from './pages/ProjectSettings';



function App() {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            border: '1px solid #444'
          }
        }}
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* --- Protected Routes --- */}
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

        {/* 2. Database Route */}
        <Route path="/project/:projectId/database" element={
          <ProtectedRoute>
            <MainLayout>
              <Database />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* 2. Register Storage Route */}
        <Route path="/project/:projectId/storage" element={<ProtectedRoute><MainLayout><Storage /></MainLayout></ProtectedRoute>} />

        {/* 3. Register Docs Route */}
        <Route path="/docs" element={
          <ProtectedRoute>
            <MainLayout>
              <Docs />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* 2. Register Auth Route */}
        <Route path="/project/:projectId/auth" element={<ProtectedRoute><MainLayout><Auth /></MainLayout></ProtectedRoute>} />

        {/* 2. Register Settings Route */}
        <Route path="/settings" element={<ProtectedRoute><MainLayout><Settings /></MainLayout></ProtectedRoute>} />

        {/* Project Specific Settings (New) */}
        <Route path="/project/:projectId/settings" element={<ProtectedRoute><MainLayout><ProjectSettings /></MainLayout></ProtectedRoute>} />


        <Route path="/project/:projectId/create-collection" element={
          <ProtectedRoute>
            <MainLayout>
              <CreateCollection />
            </MainLayout>
          </ProtectedRoute>
        } />

      </Routes>
    </div>
  );
}

export default App;