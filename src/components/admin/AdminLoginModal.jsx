import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Loader2, Sparkles, Check } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const AdminLoginModal = ({ onLoginSuccess, onCancel }) => {
  const { loginAdmin } = useAdmin();
  const [email, setEmail] = useState('admin@resumax.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginAdmin(email, password);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Invalid admin credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@resumax.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-card">
        <div className="admin-card-badge">
          <Shield size={16} /> Admin Access Gate
        </div>

        <h2>Resumax Control Center</h2>
        <p className="admin-login-subtext">
          Authorized personnel only. Sign in with administrative credentials to manage analytics, content, and themes.
        </p>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">Admin Email</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                id="admin-email"
                type="email"
                className="form-input input-with-icon"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@resumax.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-pass">Master Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                id="admin-pass"
                type="password"
                className="form-input input-with-icon"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="admin-quick-fill">
            <button
              type="button"
              className="quick-demo-btn"
              onClick={handleFillDemo}
            >
              <Sparkles size={13} />
              <span>Use Default Credentials (admin@resumax.com / admin123)</span>
            </button>
          </div>

          <div className="admin-form-actions">
            {onCancel && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Enter Admin Panel</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
