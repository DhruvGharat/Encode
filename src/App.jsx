import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
    <Router>
      <div className="app">
        <Navbar />
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tests" element={<ClinicalTests />} />
            <Route path="/tests/mmse" element={<MMSETest />} />
            <Route path="/tests/moca" element={<MoCATest />} />
            <Route path="/speech-test" element={<SpeechTest />} />
            <Route path="/mri-upload" element={<MRIUpload />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/consult-doctor" element={<ConsultDoctor />} />
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
  );
}

export default App;

