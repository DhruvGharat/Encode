import React from 'react';
import {
  TrendingUp,
  Clock,
  Brain,
  Mic,
  Upload,
  FileText,
  ArrowRight,
  Activity,
  Calendar,
  AlertCircle,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

const Dashboard = () => {
  const assessmentCards = [
    { title: 'Clinical MMSE', desc: 'Global screening tool for orientation.', icon: <Brain size={24} />, color: 'blue', path: '/tests/mmse' },
    { title: 'Clinical MoCA', desc: 'Detailed screening for impairment.', icon: <Activity size={24} />, color: 'purple', path: '/tests/moca' },
    { title: 'Speech Test', desc: 'Analyzing vocal biomarkers.', icon: <Mic size={24} />, color: 'orange', path: '/speech-test' },
    { title: 'MRI Analysis', desc: 'Structural brain health scan.', icon: <Upload size={24} />, color: 'green', path: '/mri-upload' }
  ];

  const recentActivity = [
    { id: 1, type: 'MMSE Assessment', date: 'Today, 10:30 AM', score: '28/30', status: 'Optimal' },
    { id: 2, type: 'Speech Analysis', date: 'Mar 04, 2026', score: '94%', status: 'Stable' },
    { id: 3, type: 'MoCA Assessment', date: 'Feb 28, 2026', score: '26/30', status: 'Good' },
  ];

  return (
    <div className="dashboard-v2 animate-fade-up">
      <div className="container dashboard-grid">
        {/* Main Content Area */}
        <div className="main-panel">

          {/* Welcome Card */}
          <section className="welcome-banner">
            <div className="welcome-text">
              <span className="date-tag">Friday, March 06, 2026</span>
              <h1>Welcome back, <span className="text-primary">Dhruv</span></h1>
              <p>Your cognitive profile is stable. We've updated your analysis based on your recent MMSE.</p>
              <div className="welcome-stats">
                <div className="mini-stat">
                  <TrendingUp size={16} className="text-secondary" />
                  <span><strong>+2%</strong> Stability</span>
                </div>
                <div className="mini-stat">
                  <Clock size={16} className="text-primary" />
                  <span>Next test in 4 days</span>
                </div>
              </div>
            </div>
            <div className="welcome-illustration">
              <div className="pulse-aura"></div>
              <Brain size={100} className="text-primary opacity-20" />
            </div>
          </section>

          {/* Assessment Grid */}
          <section className="assessments-section">
            <div className="section-header-compact">
              <h2>Diagnostic Suite</h2>
              <button className="btn-link">All Assessments <ChevronRight size={16} /></button>
            </div>
            <div className="assessment-grid-modern">
              {assessmentCards.map((card, i) => (
                <div key={i} className="card-modern assessment-card" onClick={() => window.location.href = card.path}>
                  <div className={`icon-square bg-${card.color}`}>
                    {card.icon}
                  </div>
                  <div className="card-info">
                    <h3>{card.title}</h3>
                    <p>{card.desc}</p>
                  </div>
                  <button className="icon-btn-round"><ArrowRight size={18} /></button>
                </div>
              ))}
            </div>
          </section>

          {/* Health Trends */}
          <section className="trends-section">
            <div className="card-modern trends-card">
              <div className="card-header-with-icon">
                <TrendingUp size={24} className="text-primary" />
                <h3>Cognitive Stability Trend</h3>
              </div>
              <div className="mock-graph">
                {/* Visual representation of a graph */}
                <div className="graph-bars">
                  {[40, 60, 55, 75, 80, 78, 85].map((h, i) => (
                    <div key={i} className="bar-col">
                      <div className="bar-fill" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}></div>
                      <span className="bar-label">M{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Panel */}
        <aside className="side-panel">
          {/* Risk Level Card */}
          <div className="card-modern risk-summary-card">
            <h3>Risk Assessment</h3>
            <div className="risk-gauge">
              <div className="gauge-fill"></div>
              <div className="gauge-label">
                <span className="risk-title">Low Risk</span>
                <span className="risk-percent">12%</span>
              </div>
            </div>
            <div className="alert-badge success">
              <CheckCircle2 size={16} />
              <span>Optimal cognitive baseline</span>
            </div>
            <p className="description-text">Your neural response latency is within the 90th percentile for your age group.</p>
          </div>

          {/* Recent Activity */}
          <div className="card-modern shadow-soft-sm">
            <div className="header-flex">
              <h3>Recent Results</h3>
              <FileText size={18} className="text-muted" />
            </div>
            <div className="activity-list">
              {recentActivity.map((act) => (
                <div key={act.id} className="activity-item">
                  <div className="act-info">
                    <strong>{act.type}</strong>
                    <span>{act.date}</span>
                  </div>
                  <div className="act-score">
                    <span className="score-v">{act.score}</span>
                    <span className="status-v">{act.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-full-outline mt-4">View All Reports</button>
          </div>

          {/* Recommendation */}
          <div className="recommendation-card">
            <AlertCircle size={24} className="text-white" />
            <div className="rec-text">
              <h4>Pro Tip</h4>
              <p>Daily linguistic exercises can improve MMSE recall by 5.4%.</p>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .dashboard-v2 { padding: 40px 0; }
        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 32px;
        }

        /* Welcome Banner */
        .welcome-banner {
          background: linear-gradient(135deg, #E8F2FF 0%, #FFFFFF 100%);
          border: 1px solid var(--surface-alt);
          border-radius: var(--radius-lg);
          padding: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          position: relative;
          overflow: hidden;
        }
        .date-tag { color: var(--primary); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 12px; display: block; }
        .welcome-text h1 { font-size: 2.5rem; margin-bottom: 12px; }
        .welcome-text p { color: var(--text-sub); max-width: 480px; margin-bottom: 24px; }
        .welcome-stats { display: flex; gap: 24px; }
        .mini-stat { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: var(--text-main); }
        .pulse-aura {
          position: absolute; right: -50px; width: 300px; height: 300px;
          background: var(--primary); filter: blur(100px); opacity: 0.1;
        }

        /* Assessment Card Grid */
        .section-header-compact { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .btn-link { background: none; border: none; color: var(--primary); font-weight: 700; display: flex; align-items: center; gap: 4px; }
        
        .assessment-grid-modern {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 40px;
        }
        .assessment-card {
          display: flex;
          align-items: center;
          gap: 20px;
          cursor: pointer;
          position: relative;
        }
        .icon-square {
          width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0;
        }
        .bg-blue { background: var(--grad-primary); }
        .bg-purple { background: var(--grad-accent); }
        .bg-orange { background: linear-gradient(135deg, #F59E0B, #EF4444); }
        .bg-green { background: linear-gradient(135deg, #10B981, #059669); }
        
        .card-info h3 { font-size: 1.1rem; margin-bottom: 4px; }
        .card-info p { font-size: 0.85rem; color: var(--text-sub); }
        .icon-btn-round { 
          position: absolute; right: 20px; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--surface-alt); background: white; 
          color: var(--primary); display: flex; align-items: center; justify-content: center; opacity: 0; transform: translateX(10px); transition: var(--transition);
        }
        .assessment-card:hover .icon-btn-round { opacity: 1; transform: translateX(0); }

        /* Trends Card */
        .mock-graph { height: 180px; margin-top: 30px; display: flex; align-items: flex-end; }
        .graph-bars { width: 100%; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 10px; }
        .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .bar-fill { width: 60%; background: var(--grad-primary); border-radius: 8px 8px 0 0; animation: growBar 1s ease-out forwards; }
        .bar-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
        @keyframes growBar { from { height: 0; } }

        /* Side Panel */
        .side-panel { display: flex; flex-direction: column; gap: 24px; }
        .risk-summary-card { text-align: center; }
        .risk-gauge { height: 120px; margin: 24px 0; position: relative; display: flex; align-items: center; justify-content: center; }
        .gauge-fill { width: 140px; height: 140px; border-radius: 50%; border: 12px solid var(--surface-alt); border-top-color: var(--secondary); transform: rotate(-45deg); }
        .gauge-label { position: absolute; display: flex; flex-direction: column; }
        .risk-title { font-size: 0.85rem; color: var(--text-sub); font-weight: 600; }
        .risk-percent { font-size: 2rem; font-weight: 800; color: var(--secondary); }
        
        .alert-badge { display: flex; align-items: center; gap: 8px; padding: 10px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; justify-content: center; }
        .alert-badge.success { background: var(--surface-green); color: var(--secondary); }
        .description-text { font-size: 0.85rem; color: var(--text-sub); margin-top: 16px; text-align: left; }

        .activity-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--surface-alt); }
        .activity-item:last-child { border-bottom: none; }
        .act-info { display: flex; flex-direction: column; }
        .act-info strong { font-size: 0.95rem; }
        .act-info span { font-size: 0.8rem; color: var(--text-muted); }
        .act-score { text-align: right; display: flex; flex-direction: column; }
        .score-v { font-weight: 700; color: var(--primary); }
        .status-v { font-size: 0.75rem; color: var(--secondary); font-weight: 700; text-transform: uppercase; }

        .recommendation-card { background: var(--grad-accent); padding: 24px; border-radius: var(--radius-lg); color: white; display: flex; gap: 16px; }
        .rec-text h4 { margin-bottom: 4px; }
        .rec-text p { font-size: 0.9rem; opacity: 0.9; }

        .btn-full-outline { width: 100%; padding: 12px; border: 1px solid var(--surface-alt); background: white; border-radius: 12px; font-weight: 700; color: var(--text-main); }

        @media (max-width: 992px) {
          .dashboard-grid { grid-template-columns: 1fr; }
          .welcome-banner { flex-direction: column; text-align: center; }
          .welcome-illustration { display: none; }
          .assessment-grid-modern { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
