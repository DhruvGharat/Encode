import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Brain, ArrowRight, TrendingUp, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mmseQuestions, calculateScore, interpretMMSE } from '../data/questions';
import { testService } from '../services/api';
import QuestionCard from '../components/QuestionCard';

const MMSETest = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers]         = useState({});
  const [isFinished, setIsFinished]   = useState(false);
  const [startTime]                   = useState(Date.now());
  const [result, setResult]           = useState(null);
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleAnswer = (answer) => {
    const updatedAnswers = { ...answers, [mmseQuestions[currentStep].id]: answer };
    setAnswers(updatedAnswers);
    setTimeout(() => {
      if (currentStep < mmseQuestions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        finishTest(updatedAnswers);
      }
    }, 400);
  };

  const finishTest = async (finalAnswers) => {
    setIsFinished(true);
    setSubmitting(true);
    const duration_secs = Math.round((Date.now() - startTime) / 1000);

    // Strip React elements from questions before sending
    const safeQuestions = mmseQuestions.map(({ id, section, correctAnswer, score }) => ({ id, section, correctAnswer, score }));

    try {
      const { data } = await testService.submitMMSE({ answers: finalAnswers, duration_secs, questions: safeQuestions });
      setResult(data.data);
    } catch (err) {
      // Fall back to local scoring if backend is unavailable
      const localScore = calculateScore(finalAnswers, mmseQuestions);
      setResult({ score: localScore, max_score: 30, risk_level: interpretMMSE(localScore).level });
      setSubmitError('Result saved locally (backend unavailable).');
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestion = mmseQuestions[currentStep];
  const progress        = ((currentStep + 1) / mmseQuestions.length) * 100;
  const interpretation  = result ? interpretMMSE(result.score) : null;

  if (isFinished) {
    return (
      <div className="test-v2-container animate-fade-up">
        <div className="card-modern results-summary-v2">
          {submitting ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div className="spin-ring" />
              <p style={{ marginTop: 16, color: 'var(--text-sub)' }}>Saving your results...</p>
              <style jsx>{`.spin-ring{width:40px;height:40px;border:3px solid #e2e8f0;border-top-color:var(--primary);border-radius:50%;animation:spin .8s linear infinite;margin:0 auto}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : (
            <>
              <div className="completion-top">
                <div className="lottie-mock-success"><CheckCircle2 size={60} strokeWidth={3} className="text-secondary" /></div>
                <h1>Assessment Finalized</h1>
                <p>Your longitudinal cognitive profile has been successfully updated.</p>
                {submitError && <p style={{ color: '#d97706', fontSize: '0.85rem' }}>{submitError}</p>}
              </div>
              <div className="score-viz-v2">
                <div className="circular-progress-v2">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="#f1f5f9" strokeWidth="10" fill="none" />
                    <circle cx="50" cy="50" r="45" stroke={interpretation?.color || '#6FCF97'} strokeWidth="10" fill="none"
                      strokeDasharray={`${((result?.score || 0) / 30) * 283} 283`} strokeLinecap="round"
                      style={{ transition: 'stroke-dasharray 1.5s ease-out' }} />
                  </svg>
                  <div className="center-score">
                    <span className="sc-big">{result?.score ?? '--'}</span>
                    <span className="sc-sm">Points</span>
                  </div>
                </div>
                <div className="result-badge-v2" style={{ background: `${interpretation?.color}15`, color: interpretation?.color }}>
                  <TrendingUp size={24} />
                  <div>
                    <h3>{result?.risk_level} Risk — {interpretation?.level} Classification</h3>
                    <p>{interpretation?.interpretation}</p>
                  </div>
                </div>
              </div>
              <div className="action-footer-v2">
                <button className="btn-primary-lg" onClick={() => navigate('/reports')}>Expand Clinical Data <ArrowRight size={20} /></button>
                <button className="btn-link-v2" onClick={() => navigate('/dashboard')}>Return to Health Panel</button>
              </div>
            </>
          )}
        </div>
        <style jsx>{`
          .test-v2-container { padding: 60px 20px; max-width: 680px; margin: 0 auto; }
          .results-summary-v2 { text-align: center; padding: 60px; }
          .completion-top h1 { font-size: 2.2rem; margin: 20px 0 10px; }
          .completion-top p { color: var(--text-sub); margin-bottom: 40px; }
          .score-viz-v2 { display: flex; flex-direction: column; align-items: center; gap: 40px; margin-bottom: 50px; }
          .circular-progress-v2 { position: relative; width: 220px; height: 220px; transform: rotate(-90deg); }
          .circular-progress-v2 svg { width: 100%; height: 100%; }
          .center-score { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; transform: rotate(90deg); }
          .sc-big { font-size: 4.5rem; font-weight: 800; color: var(--text-main); line-height: 1; }
          .sc-sm { font-size: 1.1rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }
          .result-badge-v2 { display: flex; align-items: center; gap: 20px; padding: 24px; border-radius: var(--radius-md); text-align: left; width: 100%; }
          .result-badge-v2 h3 { font-size: 1.25rem; margin-bottom: 4px; }
          .result-badge-v2 p { font-size: 0.95rem; opacity: 0.9; }
          .action-footer-v2 { display: grid; gap: 16px; width: 100%; }
          .btn-link-v2 { background: none; border: none; color: var(--text-sub); font-weight: 700; cursor: pointer; padding: 10px; }
          .btn-primary-lg { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 16px; background: var(--primary); color: white; border: none; border-radius: var(--border-radius-sm); font-size: 1.1rem; font-weight: 700; cursor: pointer; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="test-player-v2 container animate-fade-up">
      <header className="player-header-v2">
        <div className="player-meta">
          <div className="meta-icon-v2"><Brain size={24} /></div>
          <div>
            <h1>MMSE Clinical Assessment</h1>
            <span className="section-label-active">{currentQuestion.section}</span>
          </div>
        </div>
        <div className="player-timer"><Clock size={16} /><span>Active Session</span></div>
      </header>
      <div className="player-progress-v2">
        <div className="progress-top">
          <span>{Math.round(progress)}% Complete</span>
          <span>Question {currentStep + 1}/{mmseQuestions.length}</span>
        </div>
        <div className="progress-track-v2">
          <div className="progress-bar-v2" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="player-body-v2">
        <QuestionCard {...currentQuestion} onAnswer={handleAnswer} selectedAnswer={answers[currentQuestion.id]} accentColor="#4A90E2" />
        <div className="player-nav-v2">
          <button className="btn-text-v2" disabled={currentStep === 0} onClick={() => setCurrentStep(currentStep - 1)}>
            <ChevronLeft size={20} /> Previous
          </button>
          <div className="player-help"><AlertCircle size={16} /> Need assistance?</div>
          <button className="btn-text-v2" onClick={() => setCurrentStep(Math.min(mmseQuestions.length - 1, currentStep + 1))}>
            Skip <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <style jsx>{`
        .test-player-v2 { padding: 40px 0; max-width: 800px; }
        .player-header-v2 { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .player-meta { display: flex; align-items: center; gap: 16px; }
        .meta-icon-v2 { width: 48px; height: 48px; background: var(--surface-alt); color: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .player-meta h1 { font-size: 1.5rem; margin-bottom: 2px; }
        .section-label-active { font-size: 0.85rem; color: var(--primary); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
        .player-timer { display: flex; align-items: center; gap: 8px; color: var(--text-sub); font-weight: 600; font-size: 0.9rem; background: white; padding: 8px 16px; border-radius: 30px; box-shadow: var(--shadow-sm); }
        .player-progress-v2 { margin-bottom: 40px; }
        .progress-top { display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: 700; font-size: 0.85rem; color: var(--text-sub); }
        .progress-track-v2 { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
        .progress-bar-v2 { height: 100%; background: var(--grad-primary); transition: width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .player-nav-v2 { display: flex; justify-content: space-between; align-items: center; margin-top: 32px; }
        .btn-text-v2 { background: none; border: none; color: var(--text-sub); font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .btn-text-v2:hover:not(:disabled) { color: var(--primary); }
        .btn-text-v2:disabled { opacity: 0.4; cursor: not-allowed; }
        .player-help { font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px; font-weight: 600; }
      `}</style>
    </div>
  );
};

export default MMSETest;
