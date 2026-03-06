import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ClinicalTests from './pages/ClinicalTests';
import MMSETest from './pages/MMSETest';
import MoCATest from './pages/MoCATest';
import SpeechTest from './pages/SpeechTest';
import MRIUpload from './pages/MRIUpload';
import Reports from './pages/Reports';
import ConsultDoctor from './pages/ConsultDoctor';
import './styles/global.css';

// Layout wrapper to conditionally show Sidebar
const Layout = ({ children }) => {
  const location = useLocation();
  const noSidebarPaths = ['/', '/login', '/signup'];
  const showSidebar = !noSidebarPaths.includes(location.pathname);

  return (
    <div className="layout-content">
      {showSidebar && <Sidebar />}
      <div className={`page-content ${showSidebar ? 'with-sidebar' : 'full-width'}`}>
        {children}
      </div>
      <style jsx>{`
        .layout-content {
          display: flex;
          flex: 1;
        }
        .page-content {
          flex: 1;
          background: var(--background);
        }
        .page-content.with-sidebar {
          padding: 0;
        }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/tests" element={<ProtectedRoute><ClinicalTests /></ProtectedRoute>} />
              <Route path="/tests/mmse" element={<ProtectedRoute><MMSETest /></ProtectedRoute>} />
              <Route path="/tests/moca" element={<ProtectedRoute><MoCATest /></ProtectedRoute>} />
              <Route path="/speech-test" element={<ProtectedRoute><SpeechTest /></ProtectedRoute>} />
              <Route path="/mri-upload" element={<ProtectedRoute><MRIUpload /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/consult-doctor" element={<ProtectedRoute><ConsultDoctor /></ProtectedRoute>} />
            </Routes>
          </Layout>
        </div>
        <style jsx>{`
          .app {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
        `}</style>
      </Router>
    </AuthProvider>
  );
}

export default App;
