import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  LayoutDashboard,
  ClipboardCheck,
  Mic,
  Upload,
  FileText,
  UserRound,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Tests', path: '/tests', icon: <ClipboardCheck size={20} /> },
    { name: 'Speech Test', path: '/speech-test', icon: <Mic size={20} /> },
    { name: 'MRI Upload', path: '/mri-upload', icon: <Upload size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Specialists', path: '/consult-doctor', icon: <UserRound size={20} /> },
  ];

  return (
    <aside className="sidebar-enhanced">
      <div className="sidebar-brand">
        <div className="brand-icon-sq">
          <Activity size={24} strokeWidth={3} />
        </div>
        <div className="brand-text">
          <strong>CogniFusion</strong>
          <span>Clinical Hub</span>
        </div>
      </div>

      <nav className="nav-stack">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <div className="nav-icon-wrap">{item.icon}</div>
              <span className="nav-name">{item.name}</span>
              {isActive && <ChevronRight size={14} className="active-arrow" />}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-foot">
        <Link to="/settings" className="nav-link-mini"><Settings size={18} /> Settings</Link>
        <Link to="/login" className="nav-link-mini logout-text"><LogOut size={18} /> Logout</Link>

        <div className="user-profile-mini">
          <div className="u-avatar">DG</div>
          <div className="u-info">
            <strong>Dhruv Gharat</strong>
            <span>Patient Account</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sidebar-enhanced {
          width: 280px;
          background: white;
          border-right: 1px solid var(--surface-alt);
          height: 100vh;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .sidebar-brand {
          padding: 32px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-icon-sq {
          width: 40px;
          height: 40px;
          background: var(--grad-primary);
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-text { display: flex; flex-direction: column; }
        .brand-text strong { font-size: 1.1rem; color: var(--text-main); line-height: 1.2; }
        .brand-text span { font-size: 0.75rem; color: var(--primary); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }

        .nav-stack { flex: 1; padding: 0 16px; display: flex; flex-direction: column; gap: 4px; }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          text-decoration: none;
          color: var(--text-sub);
          font-weight: 600;
          border-radius: 12px;
          transition: var(--transition);
        }
        .nav-link:hover { background: var(--background); color: var(--primary); }
        .nav-link.active { background: var(--surface-alt); color: var(--primary); }
        .nav-icon-wrap { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; }
        .active-arrow { margin-left: auto; color: var(--primary); }

        .sidebar-foot { padding: 24px 16px; border-top: 1px solid var(--surface-alt); }
        .nav-link-mini { display: flex; align-items: center; gap: 8px; padding: 10px 16px; text-decoration: none; color: var(--text-sub); font-size: 0.9rem; font-weight: 600; }
        .logout-text:hover { color: var(--danger); }

        .user-profile-mini {
          margin-top: 24px;
          padding: 16px;
          background: var(--background);
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .u-avatar { width: 40px; height: 40px; border-radius: 10px; background: #e2e8f0; color: var(--text-main); font-weight: 800; display: flex; align-items: center; justify-content: center; }
        .u-info strong { font-size: 0.85rem; display: block; }
        .u-info span { font-size: 0.75rem; color: var(--text-muted); }

        @media (max-width: 992px) {
          .sidebar-enhanced { display: none; }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
