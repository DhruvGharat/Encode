import React, { useState, useEffect } from 'react';
import {
  Mic,
  Square,
  Play,
  RefreshCcw,
  CheckCircle2,
  Volume2,
  Info,
  ShieldCheck,
  Activity,
  ArrowRight
} from 'lucide-react';

const SpeechTest = () => {
  const [status, setStatus] = useState('idle'); // idle, recording, preview, uploading, complete
  const [timer, setTimer] = useState(0);
  const [waves, setWaves] = useState(new Array(40).fill(10));

  useEffect(() => {
    let interval;
    if (status === 'recording') {
      interval = setInterval(() => {
        setTimer(p => p + 1);
        setWaves(new Array(40).fill(0).map(() => Math.random() * 40 + 5));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [status]);

  const startRecording = () => {
    setStatus('recording');
    setTimer(0);
  };

  const stopRecording = () => {
    setStatus('preview');
  };

  const uploadAudio = () => {
    setStatus('uploading');
    setTimeout(() => {
      setStatus('complete');
    }, 2000);
  };

  return (
    <div className="speech-container animate-fade-up">
      <div className="container">
        <header className="page-header-v2">
          <div className="header-icon-v2 bg-purple-soft">
            <Mic size={28} className="text-accent" />
          </div>
          <div className="header-text-v2">
            <h1>Vocal Biomarker Analysis</h1>
            <p>Our AI analyzes linguistic patterns, pitch stability, and speech pauses for cognitive detection.</p>
          </div>
        </header>

        <div className="speech-layout-v2">
          {/* Main Recording Workspace */}
          <div className="workspace-v2 card-modern">
            <div className="test-prompt-card">
              <div className="badge-clinical">Clinical Prompt</div>
              <h2>"The beautiful sun sets behind the distant mountains, painting the sky in deep shades of orange and purple."</h2>
              <p className="instruction">Please read the sentence above clearly at your natural pace.</p>
            </div>

            <div className="recorder-v2">
              {status === 'recording' && (
                <div className="waveform-viz">
                  {waves.map((h, i) => (
                    <div key={i} className="wave-bar" style={{ height: `${h}px` }}></div>
                  ))}
                </div>
              )}

              <div className="timer-v2">
                {Math.floor(timer / 600)}:{(Math.floor(timer / 10) % 60).toString().padStart(2, '0')}.{timer % 10}
              </div>

              <div className="controls-v2">
                {status === 'idle' && (
                  <button className="btn-rec-main" onClick={startRecording}>
                    <Mic size={32} />
                    <span>Start Recording</span>
                  </button>
                )}

                {status === 'recording' && (
                  <button className="btn-stop-main" onClick={stopRecording}>
                    <Square size={24} fill="currentColor" />
                    <span>Stop Analysis</span>
                  </button>
                )}

                {(status === 'preview' || status === 'uploading') && (
                  <div className="preview-actions">
                    <button className="btn-outline-lg"><Play size={20} fill="currentColor" /> Preview</button>
                    <button
                      className="btn-primary-lg"
                      onClick={uploadAudio}
                      disabled={status === 'uploading'}
                    >
                      {status === 'uploading' ? 'Analyzing...' : 'Submit for AI Review'} <ArrowRight size={20} />
                    </button>
                    <button className="btn-icon-v2" onClick={() => setStatus('idle')}><RefreshCcw size={20} /></button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="speech-sidebar-v2">
            <div className="card-modern metric-card-v2">
              <h3><Activity size={18} className="text-accent" /> Live Spectrum</h3>
              <div className="mock-spectrum">
                <div className="spec-line"></div>
                <div className="spec-peaks"></div>
              </div>
              <div className="biomarker-labels">
                <div className="bio-item"><span>Neural Latency</span> <strong>12ms</strong></div>
                <div className="bio-item"><span>Jitter (F0)</span> <strong>0.2%</strong></div>
              </div>
            </div>

            <div className="card-modern ambient-info">
              <div className="header-info"><ShieldCheck size={18} /> Noise Encryption</div>
              <p>Background noise is automatically filtered using neural noise suppression (RNNoise).</p>
            </div>

            <div className="guidelines-v2">
              <h4>Guidelines</h4>
              <div className="guide-item-v2">
                <Volume2 size={16} />
                <span>Ensure a quiet environment</span>
              </div>
              <div className="guide-item-v2">
                <CheckCircle2 size={16} />
                <span>Speak clearly and steadily</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .bg-purple-soft { background: var(--accent-soft); }
        .page-header-v2 { display: flex; align-items: center; gap: 24px; margin-bottom: 40px; }
        .header-icon-v2 { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
        .header-text-v2 h1 { font-size: 2.2rem; margin-bottom: 8px; }
        .header-text-v2 p { color: var(--text-sub); font-size: 1.1rem; }

        .speech-layout-v2 { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; }
        .test-prompt-card { background: var(--background); padding: 40px; border-radius: var(--radius-md); text-align: center; margin-bottom: 40px; }
        .badge-clinical { display: inline-block; background: var(--accent); color: white; padding: 4px 12px; border-radius: 4px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 16px; }
        .test-prompt-card h2 { font-size: 1.8rem; line-height: 1.4; color: var(--text-main); margin-bottom: 16px; }
        .instruction { color: var(--text-sub); font-weight: 600; }

        .recorder-v2 { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 32px; padding-bottom: 40px; }
        
        .waveform-viz { display: flex; align-items: center; gap: 4px; height: 60px; }
        .wave-bar { width: 3px; background: var(--accent); border-radius: 2px; transition: height 0.1s ease; }
        
        .timer-v2 { font-family: monospace; font-size: 3rem; font-weight: 700; color: var(--text-main); }

        .btn-rec-main { display: flex; flex-direction: column; align-items: center; gap: 12px; background: white; border: 2px solid var(--surface-alt); padding: 32px 48px; border-radius: 24px; cursor: pointer; transition: var(--transition); color: var(--accent); }
        .btn-rec-main:hover { border-color: var(--accent); background: var(--accent-soft); transform: scale(1.05); }
        .btn-rec-main span { font-weight: 800; font-size: 1.1rem; }

        .btn-stop-main { display: flex; flex-direction: column; align-items: center; gap: 12px; background: var(--danger); color: white; padding: 32px 48px; border-radius: 24px; border: none; cursor: pointer; animation: pulse-soft 2s infinite; }
        .btn-stop-main span { font-weight: 800; }

        .preview-actions { display: flex; gap: 16px; align-items: center; }
        .btn-icon-v2 { width: 56px; height: 56px; border-radius: 12px; border: 2px solid var(--surface-alt); display: flex; align-items: center; justify-content: center; color: var(--text-sub); background: white; cursor: pointer; }

        .speech-sidebar-v2 { display: flex; flex-direction: column; gap: 24px; }
        .metric-card-v2 h3 { margin-bottom: 20px; font-size: 1.1rem; display: flex; align-items: center; gap: 8px; }
        
        .mock-spectrum { height: 100px; background: #0f172a; border-radius: 12px; margin-bottom: 20px; overflow: hidden; position: relative; }
        .spec-line { position: absolute; bottom: 0; width: 100%; height: 2px; background: var(--accent); box-shadow: 0 0 10px var(--accent); }
        .spec-peaks { position: absolute; inset: 0; background: linear-gradient(0deg, var(--accent) 0%, transparent 100%); opacity: 0.1; }

        .biomarker-labels { display: grid; gap: 12px; }
        .bio-item { display: flex; justify-content: space-between; font-size: 0.85rem; padding-bottom: 8px; border-bottom: 1px solid var(--surface-alt); }
        .bio-item strong { color: var(--accent); }

        .ambient-info { background: #fdf2f2; border: 1px solid #fee2e2; }
        .header-info { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 0.85rem; color: #991b1b; margin-bottom: 8px; }
        .ambient-info p { font-size: 0.85rem; color: #991b1b; opacity: 0.8; }

        .guidelines-v2 h4 { margin-bottom: 16px; }
        .guide-item-v2 { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; font-size: 0.9rem; color: var(--text-sub); }
      `}</style>
    </div>
  );
};

export default SpeechTest;
