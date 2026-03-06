import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Shield, ArrowRight, Activity } from 'lucide-react';

const Signup = () => {
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

                <form className="auth-form" onSubmit={(e) => { e.preventDefault(); window.location.href = '/dashboard'; }}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-with-icon">
                                <User size={18} />
                                <input type="text" placeholder="John Doe" required />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={18} />
                            <input type="email" placeholder="name@example.com" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Create Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} />
                            <input type="password" placeholder="••••••••" required />
                        </div>
                    </div>

                    <div className="terms-agreement">
                        <label className="checkbox-container">
                            <input type="checkbox" required />
                            <span className="checkmark"></span>
                            <span className="text">I agree to the <Link to="#">Terms of Service</Link> and <Link to="#">Privacy Policy</Link> for medical data.</span>
                        </label>
                    </div>

                    <button type="submit" className="btn-primary-lg full-width">
                        Create Account <ArrowRight size={20} />
                    </button>
                </form>

                <div className="security-note">
                    <Shield size={16} className="text-secondary" />
                    <span>HIPAA compliant secure data encryption active.</span>
                </div>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>

            <style jsx>{`
        .auth-page {
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fbff;
          padding: 40px 20px;
        }
        .auth-card {
          background: white;
          padding: 50px;
          border-radius: var(--border-radius-lg);
          box-shadow: 0 15px 35px rgba(0,0,0,0.05);
          width: 100%;
          max-width: 520px;
        }
        .auth-header { text-align: center; margin-bottom: 40px; }
        .auth-logo { display: flex; align-items: center; gap: 10px; justify-content: center; text-decoration: none; color: var(--text-primary); font-weight: 800; font-size: 1.5rem; margin-bottom: 25px; }
        .auth-header h1 { font-size: 1.8rem; margin-bottom: 8px; }
        .auth-header p { color: var(--text-secondary); }

        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
        
        .input-with-icon { position: relative; display: flex; align-items: center; }
        .input-with-icon :global(svg) { position: absolute; left: 15px; color: var(--text-secondary); }
        
        .input-with-icon input {
          width: 100%;
          padding: 14px 15px 14px 45px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .input-with-icon input:focus { outline: none; border-color: var(--primary); }

        .terms-agreement { margin: 10px 0; }
        .checkbox-container { display: flex; gap: 10px; cursor: pointer; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; }
        .checkbox-container a { color: var(--primary); text-decoration: none; font-weight: 600; }

        .btn-primary-lg { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 16px; background: var(--primary); color: white; border: none; border-radius: var(--border-radius-sm); font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: background 0.2s; }
        .btn-primary-lg:hover { background: var(--primary-hover); }
        .full-width { width: 100%; }

        .security-note { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 25px; font-size: 0.8rem; color: var(--text-secondary); }

        .auth-footer { margin-top: 30px; text-align: center; font-size: 0.95rem; color: var(--text-secondary); }
        .auth-footer a { color: var(--primary); text-decoration: none; font-weight: 600; }
        .auth-footer a:hover { text-decoration: underline; }
      `}</style>
        </div>
    );
};

export default Signup;
