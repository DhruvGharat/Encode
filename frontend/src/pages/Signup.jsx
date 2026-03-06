import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Shield, ArrowRight, Activity, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm]       = useState({ full_name: '', email: '', password: '' });
  const [agreed, setAgreed]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) { setError('Please accept the Terms of Service to continue.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setError('');
    setLoading(true);
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <Activity className="text-primary" size={32} />
            <span>CogniFusion</span>
          </Link>
          <h1>Start Your Journey</h1>
          <p>Join CogniFusion for early cognitive health tracking.</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-with-icon">
              <User size={18} />
              <input
                type="text" name="full_name" placeholder="John Doe"
                value={form.full_name} onChange={handleChange} required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input
                type="email" name="email" placeholder="name@example.com"
                value={form.email} onChange={handleChange} required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Create Password</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input
                type="password" name="password" placeholder="Min. 6 characters"
                value={form.password} onChange={handleChange} required
              />
            </div>
          </div>

          <div className="terms-agreement">
            <label className="checkbox-container">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span className="text">
                I agree to the <Link to="#">Terms of Service</Link> and <Link to="#">Privacy Policy</Link> for medical data.
              </span>
            </label>
          </div>

          <button type="submit" className="btn-primary-lg full-width" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'} {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="security-note">
          <Shield size={16} />
          <span>HIPAA compliant. Your medical data is encrypted.</span>
        </div>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>

      <style jsx>{`
        .auth-page { min-height: calc(100vh - 70px); display: flex; align-items: center; justify-content: center; background: #f8fbff; padding: 40px 20px; }
        .auth-card { background: white; padding: 50px; border-radius: var(--border-radius-lg); box-shadow: 0 15px 35px rgba(0,0,0,0.05); width: 100%; max-width: 520px; }
        .auth-header { text-align: center; margin-bottom: 32px; }
        .auth-logo { display: flex; align-items: center; gap: 10px; justify-content: center; text-decoration: none; color: var(--text-primary); font-weight: 800; font-size: 1.5rem; margin-bottom: 25px; }
        .auth-header h1 { font-size: 1.8rem; margin-bottom: 8px; }
        .auth-header p { color: var(--text-secondary); }
        .auth-error { display: flex; align-items: center; gap: 8px; background: #fff1f2; border: 1px solid #fecdd3; color: #b91c1c; padding: 12px 16px; border-radius: 10px; margin-bottom: 20px; font-size: 0.9rem; font-weight: 500; }
        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
        .input-with-icon { position: relative; display: flex; align-items: center; }
        .input-with-icon svg { position: absolute; left: 15px; color: var(--text-secondary); pointer-events: none; }
        .input-with-icon input { width: 100%; padding: 14px 15px 14px 45px; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); font-size: 1rem; transition: border-color 0.2s; box-sizing: border-box; }
        .input-with-icon input:focus { outline: none; border-color: var(--primary); }
        .terms-agreement { margin: 5px 0; }
        .checkbox-container { display: flex; gap: 10px; cursor: pointer; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; align-items: flex-start; }
        .checkbox-container input[type="checkbox"] { margin-top: 2px; flex-shrink: 0; }
        .checkbox-container a { color: var(--primary); text-decoration: none; font-weight: 600; }
        .btn-primary-lg { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 16px; background: var(--primary); color: white; border: none; border-radius: var(--border-radius-sm); font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: background 0.2s; }
        .btn-primary-lg:hover:not(:disabled) { background: var(--primary-hover); }
        .btn-primary-lg:disabled { opacity: 0.6; cursor: not-allowed; }
        .full-width { width: 100%; }
        .security-note { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 20px; font-size: 0.8rem; color: var(--text-secondary); }
        .auth-footer { margin-top: 20px; text-align: center; font-size: 0.95rem; color: var(--text-secondary); }
        .auth-footer a { color: var(--primary); text-decoration: none; font-weight: 600; }
      `}</style>
    </div>
  );
};

export default Signup;
