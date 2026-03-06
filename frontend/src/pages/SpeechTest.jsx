import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  StopCircle,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader,
  Info,
} from "lucide-react";
import { speechService } from "../services/api";

const SpeechTest = () => {
  const [phase, setPhase] = useState("idle"); // idle | recording | review | uploading | done | error | mode-select
  const [duration, setDuration] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [hasPermission, setPerm] = useState(null);
  const [testMode, setTestMode] = useState(null); // 'upload' | 'record'

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Set phase to mode-select initially
  useEffect(() => {
    setPhase("mode-select");
  }, []);

  // Request mic permission on mount (only if needed for recording)
  useEffect(() => {
    if (testMode === "record") {
      navigator.mediaDevices
        ?.getUserMedia({ audio: true })
        .then((stream) => {
          setPerm(true);
          stream.getTracks().forEach((t) => t.stop()); // Stop immediately, just checking
        })
        .catch(() => setPerm(false));
    }
    return () => {
      clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [testMode]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "audio/wav" && !file.name.endsWith(".wav")) {
        setError("Please upload a .wav file for analysis.");
        setPhase("error");
        return;
      }
      chunksRef.current = [file];
      setDuration(0); // Optional: could try to get duration from file
      setPhase("review");
    }
  };

  const startRecording = async () => {
    try {
      setError("");
      setDuration(0);
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        setPhase("review");
      };

      recorder.start(100);
      setPhase("recording");
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch (err) {
      setError(
        "Microphone access denied. Please grant permission in your browser settings.",
      );
      setPerm(false);
    }
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
  };

  const submitRecording = async () => {
    setPhase("uploading");
    const blob =
      chunksRef.current[0] instanceof File
        ? chunksRef.current[0]
        : new Blob(chunksRef.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", blob, blob.name || "speech-recording.webm");
    formData.append("duration_secs", String(duration));

    try {
      const { data } = await speechService.upload(formData);
      setResult(data.data);
      setPhase("done");
    } catch (err) {
      setError(
        err.response?.data?.message || "Upload failed. Please try again.",
      );
      setPhase("error");
    }
  };

  const formatTime = (s) =>
    s
      ? `${Math.floor(s / 60)
          .toString()
          .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`
      : "00:00";

  const getRiskColor = (risk) =>
    ({ Low: "#6FCF97", Moderate: "#F59E0B", High: "#EF4444" })[risk] ||
    "#4A90E2";

  return (
    <div className="speech-test-v2 container animate-fade-up">
      <div className="speech-header">
        <div
          className="icon-header-sq"
          style={{ background: "linear-gradient(135deg, #8B5CF6, #7C3AED)" }}
        >
          <Mic size={28} />
        </div>
        <div>
          <h1>Vocal Biomarker Analysis</h1>
          <p>
            Speak naturally for 30–60 seconds. Our AI detects linguistic
            patterns indicative of cognitive change.
          </p>
        </div>
      </div>

      {/* Guidelines */}
      <div className="info-row">
        {[
          {
            icon: <Mic size={18} />,
            text: "Read aloud naturally — describe what you see or tell a story",
          },
          {
            icon: <Info size={18} />,
            text: "Ensure a quiet environment for best biomarker accuracy",
          },
          {
            icon: <CheckCircle2 size={18} />,
            text: "Minimum 30-second recording recommended for full analysis",
          },
        ].map((g, i) => (
          <div key={i} className="guideline-pill">
            <span className="guide-icon">{g.icon}</span>
            {g.text}
          </div>
        ))}
      </div>

      {/* Permission warning */}
      {hasPermission === false && testMode === "record" && (
        <div className="alert-block alert-warning">
          <AlertCircle size={20} />
          <span>
            Microphone permission denied. Please enable it in your browser and
            refresh.
          </span>
        </div>
      )}

      {error && phase === "error" && (
        <div className="alert-block alert-danger">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button
            className="btn-retry"
            onClick={() => setPhase("mode-select")}
            style={{
              marginLeft: "12px",
              background: "none",
              border: "1px solid currentColor",
              borderRadius: "4px",
              padding: "2px 8px",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Main Card */}
      <div className="card-modern speech-card">
        {/* MODE SELECT */}
        {phase === "mode-select" && (
          <div className="phase-center">
            <div className="mic-bubble">
              <Mic size={48} />
            </div>
            <h2>Choose Assessment Method</h2>
            <p>
              Select how you would like to provide your speech sample for AI
              analysis.
            </p>
            <div className="mode-selection-grid">
              <button
                className="mode-btn record-mode"
                onClick={() => {
                  setTestMode("record");
                  setPhase("idle");
                }}
              >
                <Mic size={32} />
                <span>Record Session</span>
                <p>Start a new audio recording directly in your browser.</p>
              </button>
              <button
                className="mode-btn upload-mode"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={32} />
                <span>Upload File</span>
                <p>Select an existing .wav audio file from your device.</p>
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".wav"
              onChange={handleFileUpload}
            />
          </div>
        )}

        {/* IDLE */}
        {phase === "idle" && (
          <div className="phase-center">
            <div className="mic-bubble">
              <Mic size={48} />
            </div>
            <h2>Ready to Record</h2>
            <p>
              Click the button below to start your 30–60 second vocal
              assessment.
            </p>
            <button
              className="btn-record-start"
              onClick={startRecording}
              disabled={hasPermission === false}
            >
              <Mic size={20} /> Begin Voice Assessment
            </button>
            <button
              className="btn-back"
              onClick={() => setPhase("mode-select")}
              style={{
                marginTop: "12px",
                color: "var(--text-sub)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Go Back
            </button>
          </div>
        )}

        {/* RECORDING */}
        {phase === "recording" && (
          <div className="phase-center">
            <div className="mic-bubble recording-pulse">
              <Mic size={48} />
            </div>
            <div className="timer-display">{formatTime(duration)}</div>
            <p className="recording-hint">
              Recording in progress — speak clearly and naturally
            </p>
            <div className="wave-visual">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="wave-bar"
                  style={{
                    animationDelay: `${i * 0.07}s`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`,
                  }}
                />
              ))}
            </div>
            <button className="btn-record-stop" onClick={stopRecording}>
              <StopCircle size={20} /> Stop Recording
            </button>
          </div>
        )}

        {/* REVIEW */}
        {phase === "review" && (
          <div className="phase-center">
            <div className="review-icon">
              <CheckCircle2 size={52} className="text-secondary" />
            </div>
            <h2>
              {chunksRef.current[0] instanceof File
                ? "File Ready"
                : "Recording Complete"}
            </h2>
            <p>
              {chunksRef.current[0] instanceof File
                ? `File: ${chunksRef.current[0].name}`
                : `Duration: ${formatTime(duration)} · Audio captured successfully`}
            </p>
            <div className="review-actions">
              <button className="btn-submit-speech" onClick={submitRecording}>
                <Upload size={20} /> Submit for AI Analysis
              </button>
              <button
                className="btn-rerecord"
                onClick={() => setPhase("mode-select")}
              >
                Choose Different
              </button>
            </div>
          </div>
        )}

        {/* UPLOADING */}
        {phase === "uploading" && (
          <div className="phase-center">
            <Loader size={52} className="text-primary spin-icon" />
            <h2>Analyzing Vocal Biomarkers</h2>
            <p>Our neural network is processing your speech patterns...</p>
          </div>
        )}

        {/* DONE */}
        {phase === "done" && result && (
          <div className="results-grid-speech">
            <div className="results-header-speech">
              <CheckCircle2 size={40} className="text-secondary" />
              <h2>Analysis Complete</h2>
              <p style={{ color: "var(--text-sub)" }}>
                Vocal biomarker assessment logged to your profile.
              </p>
            </div>
            <div className="biomarker-cards">
              {[
                {
                  label: "Speech Stability",
                  value: `${result.stability_pct}%`,
                  caption: "Neural coherence index",
                  color: getRiskColor(result.risk_level),
                },
                {
                  label: "Temporal Jitter",
                  value: `${result.jitter_f0}%`,
                  caption: "F0 perturbation ratio",
                  color: "#4A90E2",
                },
                {
                  label: "Neural Latency",
                  value: `${result.neural_latency}ms`,
                  caption: "Vocal processing speed",
                  color: "#8B5CF6",
                },
              ].map((m, i) => (
                <div
                  key={i}
                  className="biomarker-card"
                  style={{ borderTop: `3px solid ${m.color}` }}
                >
                  <p className="bio-label">{m.label}</p>
                  <span className="bio-value" style={{ color: m.color }}>
                    {m.value}
                  </span>
                  <p className="bio-caption">{m.caption}</p>
                </div>
              ))}
            </div>
            <div
              className="risk-result-speech"
              style={{
                background: `${getRiskColor(result.risk_level)}15`,
                border: `1px solid ${getRiskColor(result.risk_level)}30`,
              }}
            >
              <strong style={{ color: getRiskColor(result.risk_level) }}>
                Risk Level: {result.risk_level}
              </strong>
              <p>{result.analysis_notes}</p>
            </div>
            <button
              className="btn-rerecord"
              onClick={() => {
                setPhase("mode-select");
                setResult(null);
              }}
            >
              Start Another Analysis
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .speech-test-v2 {
          padding: 40px 0;
          max-width: 800px;
        }
        .speech-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
        }
        .icon-header-sq {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        .speech-header h1 {
          font-size: 2rem;
          margin-bottom: 6px;
        }
        .speech-header p {
          color: var(--text-sub);
        }
        .info-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .guideline-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          padding: 10px 16px;
          border-radius: 30px;
          box-shadow: var(--shadow-sm);
          font-size: 0.85rem;
          color: var(--text-sub);
          font-weight: 500;
        }
        .guide-icon {
          color: var(--primary);
          flex-shrink: 0;
        }
        .alert-block {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .alert-warning {
          background: #fff7ed;
          color: #92400e;
          border: 1px solid #fde68a;
        }
        .alert-danger {
          background: #fff1f2;
          color: #9f1239;
          border: 1px solid #fecdd3;
        }
        .speech-card {
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .phase-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          text-align: center;
          width: 100%;
        }
        .phase-center h2 {
          font-size: 2rem;
        }
        .phase-center p {
          color: var(--text-sub);
          max-width: 480px;
        }
        .mode-selection-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-top: 20px;
          width: 100%;
          max-width: 600px;
        }
        .mode-btn {
          background: var(--surface-alt);
          border-radius: 20px;
          padding: 32px 24px;
          border: 2px solid transparent;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          transition: all 0.3s;
          color: var(--primary);
        }
        .mode-btn span {
          font-weight: 800;
          font-size: 1.25rem;
        }
        .mode-btn p {
          font-size: 0.85rem;
          color: var(--text-sub);
        }
        .mode-btn:hover {
          border-color: var(--primary);
          transform: translateY(-4px);
          background: #fdfefe;
        }
        .mic-bubble {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: var(--surface-alt);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }
        .spin-icon {
          animation: spin 1.5s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .recording-pulse {
          animation: recordPulse 1.5s infinite;
          background: #fff1f2;
          color: #ef4444;
        }
        @keyframes recordPulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(239, 68, 68, 0);
          }
        }
        .timer-display {
          font-size: 3.5rem;
          font-weight: 800;
          color: #ef4444;
          letter-spacing: 0.05em;
        }
        .recording-hint {
          font-size: 0.95rem;
          color: var(--text-sub);
          font-style: italic;
        }
        .wave-visual {
          display: flex;
          align-items: center;
          gap: 3px;
          height: 50px;
        }
        .wave-bar {
          width: 4px;
          background: linear-gradient(to top, var(--primary), #8b5cf6);
          border-radius: 2px;
          animation: waveAnim 0.8s ease-in-out infinite alternate;
        }
        @keyframes waveAnim {
          0% {
            height: 8px;
          }
          100% {
            height: 40px;
          }
        }
        .btn-record-start {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          background: var(--grad-primary);
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-record-start:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-record-stop {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          background: #fff1f2;
          color: #ef4444;
          border: 1px solid #fecdd3;
          border-radius: 14px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
        }
        .review-icon {
          color: var(--secondary);
        }
        .review-actions {
          display: flex;
          gap: 16px;
        }
        .btn-submit-speech {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: var(--secondary);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-rerecord {
          padding: 12px 24px;
          background: var(--surface-alt);
          color: var(--text-main);
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .results-grid-speech {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: center;
        }
        .results-header-speech {
          text-align: center;
        }
        .results-header-speech h2 {
          font-size: 1.8rem;
        }
        .biomarker-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          width: 100%;
        }
        .biomarker-card {
          background: var(--background);
          padding: 24px;
          border-radius: 16px;
          text-align: center;
        }
        .bio-label {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .bio-value {
          font-size: 2.2rem;
          font-weight: 800;
        }
        .bio-caption {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
        .risk-result-speech {
          width: 100%;
          padding: 20px 24px;
          border-radius: 14px;
          text-align: center;
        }
        .risk-result-speech p {
          margin-top: 6px;
          color: var(--text-sub);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default SpeechTest;
