import React, { useEffect, useState } from 'react';
import { FileText, Download, Search, CheckCircle2, ArrowUpRight, ClipboardList, ShieldCheck, Activity, Brain, Mic, Calendar } from 'lucide-react';
import { reportService } from '../services/api';

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    reportService.getSummary()
      .then((res) => setSummary(res.data.data))
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, []);

  const scores = summary ? [
    { label: 'MMSE Score',       value: summary.scores.MMSE?.score ?? '--',  total: summary.scores.MMSE?.max_score ?? 30, level: summary.scores.MMSE?.risk_level ?? 'N/A', color: 'blue',   icon: <Brain size={20} /> },
    { label: 'MoCA Score',       value: summary.scores.MoCA?.score ?? '--',  total: summary.scores.MoCA?.max_score ?? 30, level: summary.scores.MoCA?.risk_level ?? 'N/A', color: 'purple', icon: <Activity size={20} /> },
    { label: 'Speech Stability', value: summary.scores.speech?.stability_pct ? `${summary.scores.speech.stability_pct}%` : '--', total: '100', level: summary.scores.speech?.risk_level ?? 'N/A', color: 'green', icon: <Mic size={20} /> },
    { label: 'Neural Latency',   value: summary.scores.speech?.neural_latency ?? '--', total: 'ms',  level: summary.scores.speech?.risk_level ?? 'N/A', color: 'orange', icon: <Activity size={20} /> },
  ] : [];

  const allReports = summary?.reports || [];
  const filteredReports = allReports.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    (r.report_type || '').toLowerCase().includes(search.toLowerCase())
  );

  const user = summary ? null : null; // patient info comes from auth context if needed

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16, color: 'var(--primary)', fontWeight: 600 }}>
      <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      Loading your clinical reports...
    </div>
  );

  return (
    <div className="reports-modern animate-fade-up">
      <div className="container">
        {/* Clinical Summary Cards */}
        {scores.length > 0 && (
          <section className="clinical-scores-grid mt-4">
            {scores.map((stat, i) => (
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
                    <div className="p-fill" style={{ width: `${Math.min(100, (parseFloat(stat.value) / parseFloat(stat.total)) * 100) || 0}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Overall Risk */}
        {summary?.overall_risk && (
          <div className="card-modern risk-indicator-full mt-4">
            <div className="risk-content-v2">
              <div className="risk-meta-text">
                <Activity size={32} className="text-secondary mb-2" />
                <h2>Longitudinal Risk Profile: <span className="text-secondary">{summary.overall_risk}</span></h2>
                <p>Based on multimodal AI analysis across all your cognitive assessments.</p>
              </div>
              <div className="risk-visual-v2">
                <div className="risk-spectrum">
                  <div className="spectrum-marker" style={{ left: summary.overall_risk === 'Low' ? '15%' : summary.overall_risk === 'Moderate' ? '50%' : '82%' }}></div>
                  <div className="spectrum-gradient"></div>
                  <div className="spectrum-labels">
                    <span>Low Risk</span><span>Elevated</span><span>High Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report History */}
        <section className="assessment-history card-modern mt-4">
          <div className="history-header">
            <h3><ClipboardList size={22} /> Assessment History</h3>
            <div className="filter-wrap">
              <Search size={18} className="text-muted" />
              <input type="text" placeholder="Filter clinical records..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <FileText size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p>{allReports.length === 0 ? 'No reports yet. Complete an assessment to generate your first report.' : 'No reports match your search.'}</p>
            </div>
          ) : (
            <div className="record-list-v2">
              {filteredReports.map((rec, i) => (
                <div key={i} className="record-row-v2">
                  <div className="rec-info-v2">
                    <div className="rec-icon-v2"><FileText size={20} /></div>
                    <div>
                      <h4>{rec.title}</h4>
                      <span className="rec-meta-v2">{rec.report_type} • {rec.report_id} • {new Date(rec.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="rec-action-v2">
                    <button className="btn-icon-soft"><Download size={18} /></button>
                    <button className="btn-icon-soft"><ArrowUpRight size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        .reports-modern { padding: 40px 0; }
        .clinical-scores-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .score-card-v2 { background: white; padding: 24px; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); border-bottom: 4px solid var(--border-color); }
        .score-card-v2.accent-blue { border-color: var(--primary); } .score-card-v2.accent-purple { border-color: var(--accent); } .score-card-v2.accent-green { border-color: var(--secondary); } .score-card-v2.accent-orange { border-color: var(--warning); }
        .stat-header-v2 { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .stat-icon-v2 { width: 40px; height: 40px; background: #f8fafc; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .level-pill { font-size: 0.75rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; }
        .pill-blue { background: #e0f2fe; color: var(--primary); } .pill-purple { background: #f5f3ff; color: var(--accent); } .pill-green { background: #dcfce7; color: var(--secondary); } .pill-orange { background: #fff7ed; color: var(--warning); }
        .stat-value-v2 { display: flex; align-items: baseline; gap: 2px; }
        .v-main { font-size: 2rem; font-weight: 800; color: var(--text-main); }
        .v-sub { font-size: 0.95rem; color: var(--text-muted); font-weight: 600; }
        .stat-label-v2 { color: var(--text-sub); font-size: 0.9rem; font-weight: 600; }
        .progress-mini-v2 { height: 4px; background: #f1f5f9; border-radius: 2px; margin-top: 16px; overflow: hidden; }
        .p-fill { height: 100%; background: var(--primary); border-radius: 2px; }
        .accent-purple .p-fill { background: var(--accent); } .accent-green .p-fill { background: var(--secondary); } .accent-orange .p-fill { background: var(--warning); }
        .risk-indicator-full { background: linear-gradient(to right, #ffffff, #f0fdf4); }
        .risk-content-v2 { display: flex; justify-content: space-between; align-items: center; gap: 40px; }
        .risk-meta-text { flex: 1; } .risk-visual-v2 { flex: 1.5; }
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
        .btn-icon-soft { width: 40px; height: 40px; border-radius: 10px; border: none; background: #f8fafc; color: var(--text-sub); display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .btn-icon-soft:hover { background: var(--surface-alt); color: var(--primary); }
        @media (max-width: 992px) { .clinical-scores-grid { grid-template-columns: 1fr 1fr; } .risk-content-v2 { flex-direction: column; } }
      `}</style>
    </div>
  );
};

export default Reports;
