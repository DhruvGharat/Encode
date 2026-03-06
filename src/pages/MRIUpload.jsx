import React, { useState, useRef } from 'react';
import {
  Upload,
  File,
  CheckCircle2,
  X,
  ChevronRight,
  Info,
  ShieldCheck,
  Brain,
  Layers,
  Search,
  Zap
} from 'lucide-react';

const MRIUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const simulateUpload = () => {
    if (files.length === 0) return;
    setUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploading(false);
          setProgress(0);
        }, 1000);
      }
    }, 100);
  };

  return (
    <div className="mri-upload-v2 container animate-fade-up">
      <header className="page-header-v2">
        <div className="header-icon-v2 bg-green-soft">
          <Brain size={28} className="text-secondary" />
        </div>
        <div className="header-text-v2">
          <h1>Neural Image Repository</h1>
          <p>Upload DICOM, NIfTI, or High-Res MRI scans for hippocampal volumetric analysis.</p>
        </div>
      </header>

      <div className="upload-layout-v2">
        {/* Main Upload Zone */}
        <div className="upload-main-v2">
          <div
            className={`dropzone-v2 card-modern ${uploading ? 'uploading' : ''}`}
            onClick={() => !uploading && fileInputRef.current.click()}
          >
            <input
              type="file"
              multiple
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div className="dropzone-content">
              <div className="icon-stack">
                <div className="icon-circle main"><Upload size={40} /></div>
                <div className="icon-circle sub"><Layers size={20} /></div>
              </div>
              <h2>{uploading ? 'Processing Scans...' : 'Drop MRI Scans Here'}</h2>
              <p>Drag and drop multiple files or click to browse. HIPAA compliant encryption active.</p>
              <div className="format-badges">
                <span>DICOM</span>
                <span>NIfTI</span>
                <span>PNG</span>
                <span>NRRD</span>
              </div>
            </div>

            {uploading && (
              <div className="upload-overlay">
                <div className="progress-radial-container">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="45" fill="none"
                      stroke="white" strokeWidth="8"
                      strokeDasharray={`${(progress / 100) * 283} 283`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="p-text">{progress}%</span>
                </div>
              </div>
            )}
          </div>

          {files.length > 0 && (
            <div className="file-list-v2 card-modern animate-fade-up">
              <div className="list-header">
                <h3>Uploaded Assets ({files.length})</h3>
                {!uploading && <button className="btn-primary-sm" onClick={simulateUpload}>Run AI Analysis <Zap size={14} /></button>}
              </div>
              <div className="files-grid">
                {files.map((f, i) => (
                  <div key={i} className="file-item-v2">
                    <div className="f-icon"><File size={20} /></div>
                    <div className="f-info">
                      <strong>{f.name}</strong>
                      <span>{(f.size / 1024 / 1024).toFixed(2)} MB • Ready</span>
                    </div>
                    <button className="del-btn" onClick={() => setFiles(files.filter((_, idx) => idx !== i))}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Guidelines */}
        <aside className="upload-sidebar-v2">
          <div className="card-modern guide-card">
            <h3><Info size={18} className="text-primary" /> Scan Requirements</h3>
            <ul className="guide-list">
              <li>T1-weighted structural imaging preferred</li>
              <li>Slice thickness &lt; 1.5mm for better accuracy</li>
              <li>Remove personal metadata via de-identification</li>
              <li>Wait for "Verified" status before clinical review</li>
            </ul>
          </div>

          <div className="security-card-v2">
            <ShieldCheck size={32} className="text-secondary" />
            <div>
              <h4>Clinical-Grade Privacy</h4>
              <p>All neural imaging is processed on isolated secure servers. Zero data sharing model.</p>
            </div>
          </div>

          <div className="recent-scans-v2 card-modern">
            <div className="header-s">
              <h3>Recent Analyses</h3>
              <button className="icon-btn"><Search size={16} /></button>
            </div>
            <div className="mini-record-list">
              <div className="m-record">
                <CheckCircle2 size={16} className="text-secondary" />
                <div>
                  <strong>Brain_Scan_T1.dcm</strong>
                  <span>Processed • 2 days ago</span>
                </div>
              </div>
              <div className="m-record">
                <CheckCircle2 size={16} className="text-secondary" />
                <div>
                  <strong>Patient_MRI_Axial.png</strong>
                  <span>Verified • Mar 01, 2026</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .mri-upload-v2 { padding: 40px 0; }
        .page-header-v2 { display: flex; align-items: center; gap: 24px; margin-bottom: 40px; }
        .header-icon-v2 { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
        .bg-green-soft { background: var(--surface-green); }
        .header-text-v2 h1 { font-size: 2.2rem; line-height: 1; margin-bottom: 8px; }
        .header-text-v2 p { color: var(--text-sub); font-size: 1.1rem; }

        .upload-layout-v2 { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; }
        
        .dropzone-v2 { 
          height: 380px; border: 3px dashed var(--surface-alt); background: white; 
          display: flex; align-items: center; justify-content: center; text-align: center;
          cursor: pointer; position: relative; overflow: hidden;
        }
        .dropzone-v2:hover { border-color: var(--primary); background: #f8fbff; }
        .dropzone-v2.uploading { cursor: wait; pointer-events: none; }
        
        .icon-stack { position: relative; margin-bottom: 24px; height: 80px; width: 80px; margin: 0 auto 24px; }
        .icon-circle { border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .icon-circle.main { width: 80px; height: 80px; background: var(--grad-primary); color: white; }
        .icon-circle.sub { position: absolute; bottom: -5px; right: -5px; width: 36px; height: 36px; background: var(--accent); color: white; border: 3px solid white; }
        
        .dropzone-content h2 { margin-bottom: 12px; }
        .dropzone-content p { color: var(--text-sub); max-width: 400px; margin: 0 auto 20px; font-size: 0.95rem; }
        
        .format-badges { display: flex; gap: 10px; justify-content: center; }
        .format-badges span { padding: 4px 12px; background: var(--background); border-radius: 6px; font-size: 0.75rem; font-weight: 800; color: var(--text-muted); border: 1px solid var(--surface-alt); }

        .upload-overlay { position: absolute; inset: 0; background: rgba(74, 144, 226, 0.9); display: flex; align-items: center; justify-content: center; color: white; backdrop-filter: blur(4px); }
        .progress-radial-container { position: relative; width: 120px; height: 120px; transform: rotate(-90deg); }
        .p-text { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; transform: rotate(90deg); font-weight: 800; font-size: 1.25rem; }

        .file-list-v2 { margin-top: 24px; }
        .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .files-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .file-item-v2 { display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--background); border-radius: 12px; border: 1px solid var(--surface-alt); position: relative; }
        .f-icon { width: 40px; height: 40px; background: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .f-info strong { font-size: 0.9rem; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px; }
        .f-info span { font-size: 0.75rem; color: var(--text-sub); }
        .del-btn { position: absolute; top: 12px; right: 12px; border: none; background: none; color: var(--text-muted); cursor: pointer; }
        .del-btn:hover { color: var(--danger); }

        .upload-sidebar-v2 { display: flex; flex-direction: column; gap: 24px; }
        .guide-card h3 { display: flex; align-items: center; gap: 8px; font-size: 1.1rem; margin-bottom: 16px; }
        .guide-list { padding-left: 20px; display: grid; gap: 12px; font-size: 0.9rem; color: var(--text-sub); }
        
        .security-card-v2 { background: var(--surface-green); padding: 24px; border-radius: var(--radius-lg); display: flex; gap: 16px; border: 1px solid #dcfce7; }
        .security-card-v2 h4 { font-size: 1rem; margin-bottom: 4px; color: var(--secondary); }
        .security-card-v2 p { font-size: 0.85rem; color: #166534; opacity: 0.8; }

        .m-record { display: flex; gap: 12px; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid var(--surface-alt); }
        .m-record:last-child { border-bottom: none; }
        .m-record strong { font-size: 0.85rem; display: block; }
        .m-record span { font-size: 0.75rem; color: var(--text-muted); }

        @media (max-width: 992px) {
          .upload-layout-v2 { grid-template-columns: 1fr; }
          .files-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default MRIUpload;
