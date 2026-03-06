import React, { useState } from 'react';
import {
  FileText,
  Download,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ClipboardList,
  ShieldCheck,
  Activity,
  Brain,
  Mic,
  Calendar
} from 'lucide-react';

const Reports = () => {
  const scoreStats = [
    { label: 'MMSE Score', value: '28', total: '30', level: 'Normal', color: 'blue', icon: <Brain size={20} /> },
    { label: 'MoCA Score', value: '26', total: '30', level: 'Normal', color: 'purple', icon: <Activity size={20} /> },
    { label: 'Speech Stability', value: '94%', total: '100', level: 'Low Risk', color: 'green', icon: <Mic size={20} /> },
    { label: 'Neural Latency', value: '112', total: 'ms', level: 'Standard', color: 'orange', icon: <Activity size={20} /> },
  ];

  return (
    <div className="reports-modern animate-fade-up">
      <div className="container">
        {/* Medical Header */}
        <header className="report-header-v2 card-modern">
          <div className="profile-header-main">
            <div className="patient-avatar-large">DG</div>
            <div className="patient-meta-v2">
              <span className="clinical-badge">Patient ID: CF-2026-9901</span>
              <h1>Dhruv Gharat</h1>
              <div className="meta-grid-mini">
                <div className="m-item"><Calendar size={14} /> 24 Years • Male</div>
                <div className="m-item"><ShieldCheck size={14} /> HIPAA Protected Data</div>
              </div>
            </div>
          </div>
          <div className="header-actions-v2">
            <button className="btn-outline-sm"><Download size={16} /> Export clinical PDF</button>
            <button className="btn-primary-sm">Share with Doctor</button>
          </div>
        </header>

        {/* Clinical Summary Cards */}
        <section className="clinical-scores-grid mt-4">
          {scoreStats.map((stat, i) => (
            <div key={i} className={`score-card-v2 accent-${stat.color}`}>
              <div className="stat-header-v2">
                <div className="stat-icon-v2">{stat.icon}</div>
                <span className={`level-pill pill-${stat.color}`}>{stat.level}</span>
              </div>
              <div className="stat-body-v2">
                <div className="stat-value-v2">
                  <span className="v-main">{stat.value}</span>
                  <span className="v-sub">/{stat.total}</span>
                </div>
                <p className="stat-label-v2">{stat.label}</p>
              </div>
              <div className="stat-footer-v2">
                <div className="progress-mini-v2">
                  <div className="p-fill" style={{ width: `${(parseFloat(stat.value) / parseFloat(stat.total)) * 100}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Global Risk Indicator */}
        <div className="card-modern risk-indicator-full mt-4">
          <div className="risk-content-v2">
            <div className="risk-meta-text">
              <Activity size={32} className="text-secondary mb-2" />
              <h2>Longitudinal Risk Profile: <span className="text-secondary">Low</span></h2>
              <p>Based on our multimodal AI analysis, your cognitive baseline remains stable compared to baseline Mar 2025.</p>
            </div>
            <div className="risk-visual-v2">
              <div className="risk-spectrum">
                <div className="spectrum-marker" style={{ left: '15%' }}></div>
                <div className="spectrum-gradient"></div>
                <div className="spectrum-labels">
                  <span>Low Risk</span>
                  <span>Elevated</span>
                  <span>High Risk</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Assessment List */}
        <section className="assessment-history card-modern mt-4">
          <div className="history-header">
            <h3><ClipboardList size={22} /> Assessment History</h3>
            <div className="filter-wrap">
              <Search size={18} className="text-muted" />
              <input type="text" placeholder="Filter clinical records..." />
            </div>
          </div>

          <div className="record-list-v2">
            {[
              { title: 'MMSE Assessment Summary', type: 'Clinical Test', date: 'Mar 06, 2026', id: 'REP-7721' },
              { title: 'Hippocampal Volumetric Report', type: 'MRI Insight', date: 'Jan 12, 2026', id: 'REP-7401' },
              { title: 'Vocal Biomarker Signature', type: 'Speech Analysis', date: 'Dec 15, 2025', id: 'REP-7110' },
            ].map((rec, i) => (
              <div key={i} className="record-row-v2">
                <div className="rec-info-v2">
                  <div className="rec-icon-v2"><FileText size={20} /></div>
                  <div>
                    <h4>{rec.title}</h4>
                    <span className="rec-meta-v2">{rec.type} • {rec.id} • {rec.date}</span>
                  </div>
                </div>
                <div className="rec-action-v2">
                  <button className="btn-icon-soft"><Download size={18} /></button>
                  <button className="btn-icon-soft"><ArrowUpRight size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        .reports-modern { padding: 40px 0; }
        
        .report-header-v2 { display: flex; justify-content: space-between; align-items: center; padding: 32px 40px; }
        .profile-header-main { display: flex; align-items: center; gap: 24px; }
        .patient-avatar-large { width: 72px; height: 72px; background: var(--grad-primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; }
        .patient-meta-v2 h1 { font-size: 2rem; margin: 4px 0; }
        .clinical-badge { background: var(--surface-alt); color: var(--primary); font-weight: 700; font-size: 0.75rem; padding: 4px 10px; border-radius: 4px; }
        .meta-grid-mini { display: flex; gap: 20px; color: var(--text-sub); font-size: 0.9rem; margin-top: 8px; }
        .m-item { display: flex; align-items: center; gap: 6px; }

        .header-actions-v2 { display: flex; gap: 12px; }
        .btn-outline-sm { border: 1px solid var(--surface-alt); background: white; padding: 10px 16px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; }
        .btn-primary-sm { background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; }

        .clinical-scores-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .score-card-v2 { background: white; padding: 24px; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); border-bottom: 4px solid var(--border-color); }
        .score-card-v2.accent-blue { border-color: var(--primary); }
        .score-card-v2.accent-purple { border-color: var(--accent); }
        .score-card-v2.accent-green { border-color: var(--secondary); }
        .score-card-v2.accent-orange { border-color: var(--warning); }

        .stat-header-v2 { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .stat-icon-v2 { width: 40px; height: 40px; background: #f8fafc; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--text-main); }
        .level-pill { font-size: 0.75rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; }
        .pill-blue { background: #e0f2fe; color: var(--primary); }
        .pill-purple { background: #f5f3ff; color: var(--accent); }
        .pill-green { background: #dcfce7; color: var(--secondary); }
        .pill-orange { background: #fff7ed; color: var(--warning); }

        .stat-value-v2 { display: flex; align-items: baseline; gap: 2px; }
        .v-main { font-size: 2rem; font-weight: 800; color: var(--text-main); }
        .v-sub { font-size: 0.95rem; color: var(--text-muted); font-weight: 600; }
        .stat-label-v2 { color: var(--text-sub); font-size: 0.9rem; font-weight: 600; }

        .progress-mini-v2 { height: 4px; background: #f1f5f9; border-radius: 2px; margin-top: 16px; overflow: hidden; }
        .p-fill { height: 100%; background: var(--primary); border-radius: 2px; }
        .accent-purple .p-fill { background: var(--accent); }
        .accent-green .p-fill { background: var(--secondary); }
        .accent-orange .p-fill { background: var(--warning); }

        .risk-indicator-full { background: linear-gradient(to right, #ffffff, #f0fdf4); }
        .risk-content-v2 { display: flex; justify-content: space-between; align-items: center; gap: 40px; }
        .risk-meta-text { flex: 1; }
        .risk-visual-v2 { flex: 1.5; }

        .risk-spectrum { position: relative; height: 60px; display: flex; flex-direction: column; justify-content: center; }
        .spectrum-gradient { height: 12px; background: linear-gradient(to right, var(--secondary), var(--warning), var(--danger)); border-radius: 6px; }
        .spectrum-marker { position: absolute; top: 0; width: 4px; height: 36px; background: var(--text-main); border-radius: 2px; box-shadow: 0 0 10px rgba(0,0,0,0.2); transition: left 1s ease-in-out; }
        .spectrum-labels { display: flex; justify-content: space-between; margin-top: 12px; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }

        .history-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--surface-alt); padding-bottom: 24px; margin-bottom: 24px; }
        .filter-wrap { display: flex; align-items: center; gap: 12px; background: var(--background); padding: 10px 16px; border-radius: 12px; width: 300px; }
        .filter-wrap input { border: none; background: none; font-size: 0.9rem; width: 100%; outline: none; }

        .record-row-v2 { display: flex; justify-content: space-between; align-items: center; padding: 20px; border: 1px solid var(--surface-alt); border-radius: 16px; margin-bottom: 12px; transition: var(--transition); }
        .record-row-v2:hover { background: #f8fbff; border-color: var(--primary); }
        .rec-info-v2 { display: flex; align-items: center; gap: 20px; }
        .rec-icon-v2 { width: 48px; height: 48px; background: #f3f4f6; color: var(--text-sub); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .rec-meta-v2 { font-size: 0.85rem; color: var(--text-muted); display: block; margin-top: 4px; }
        .rec-action-v2 { display: flex; gap: 8px; }
        .btn-icon-soft { width: 40px; height: 40px; border-radius: 10px; border: none; background: #f8fafc; color: var(--text-sub); display: flex; align-items: center; justify-content: center; }
        .btn-icon-soft:hover { background: var(--surface-alt); color: var(--primary); }

        @media (max-width: 992px) {
          .clinical-scores-grid { grid-template-columns: 1fr 1fr; }
          .risk-content-v2 { flex-direction: column; }
          .report-header-v2 { flex-direction: column; gap: 24px; align-items: center; text-align: center; }
          .profile-header-main { flex-direction: column; }
          .meta-grid-mini { justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default Reports;
