import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Activity, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <Activity className="text-primary" size={32} />
                        <span>CogniFusion</span>
                    </Link>
                    <h1>Welcome Back</h1>
                    <p>Please enter your details to sign in.</p>
                </div>

                <form className="auth-form" onSubmit={(e) => { e.preventDefault(); window.location.href = '/dashboard'; }}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={18} />
                            <input type="email" placeholder="name@example.com" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} />
                            <input type="password" placeholder="••••••••" required />
                            <EyeOff size={18} className="icon-right" />
                        </div>
                        <div className="forgot-pass">
                            <Link to="#">Forgot Password?</Link>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary-lg full-width">
                        Sign In <ArrowRight size={20} />
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/signup">Create account</Link></p>
                </div>
            </div>

            <style jsx>{`
        .auth-page {
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fbff;
          padding: 20px;
        }
        .auth-card {
          background: white;
          padding: 50px;
          border-radius: var(--border-radius-lg);
          box-shadow: 0 15px 35px rgba(0,0,0,0.05);
          width: 100%;
          max-width: 480px;
        }
        .auth-header { text-align: center; margin-bottom: 40px; }
        .auth-logo { display: flex; align-items: center; gap: 10px; justify-content: center; text-decoration: none; color: var(--text-primary); font-weight: 800; font-size: 1.5rem; margin-bottom: 25px; }
        .auth-header h1 { font-size: 1.8rem; margin-bottom: 8px; }
        .auth-header p { color: var(--text-secondary); }

        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
        
        .input-with-icon { position: relative; display: flex; align-items: center; }
        .input-with-icon :global(svg:first-child) { position: absolute; left: 15px; color: var(--text-secondary); }
        .icon-right { position: absolute; right: 15px; color: var(--text-secondary); cursor: pointer; }
        
        .input-with-icon input {
          width: 100%;
          padding: 14px 15px 14px 45px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .input-with-icon input:focus { outline: none; border-color: var(--primary); }

        .forgot-pass { text-align: right; margin-top: 5px; }
        .forgot-pass a { font-size: 0.85rem; color: var(--primary); text-decoration: none; font-weight: 600; }

        .btn-primary-lg { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 16px; background: var(--primary); color: white; border: none; border-radius: var(--border-radius-sm); font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: background 0.2s; }
        .btn-primary-lg:hover { background: var(--primary-hover); }
        .full-width { width: 100%; }

        .auth-footer { margin-top: 30px; text-align: center; font-size: 0.95rem; color: var(--text-secondary); }
        .auth-footer a { color: var(--primary); text-decoration: none; font-weight: 600; }
        .auth-footer a:hover { text-decoration: underline; }
      `}</style>
        </div>
    );
};

export default Login;
