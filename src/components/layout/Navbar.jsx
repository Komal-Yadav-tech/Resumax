import React from 'react';
import { LogOut, User as UserIcon, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../theme/ThemeToggle';
import logoImg from '../../assets/logo.png';

export const Navbar = ({ onNavigate, currentPage }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      if (onNavigate) onNavigate('login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div
          className="brand-logo"
          onClick={() => (user ? onNavigate('dashboard') : onNavigate('login'))}
        >
          <div className="brand-icon-wrapper">
            <img src={logoImg} alt="Resumax" className="brand-logo-img" />
          </div>
          <span>Resumax</span>
          <span className="brand-badge">Free</span>
        </div>

        {/* Center Nav Links (When logged in) */}
        {user && (
          <nav className="nav-center-links">
            <button
              type="button"
              className={`nav-link-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => onNavigate('dashboard')}
            >
              Dashboard
            </button>
            <button
              type="button"
              className={`nav-link-btn ${currentPage === 'builder' ? 'active' : ''}`}
              onClick={() => onNavigate('builder')}
            >
              Builder
            </button>
            <button
              type="button"
              className={`nav-link-btn ${currentPage === 'ats' ? 'active' : ''}`}
              onClick={() => onNavigate('ats')}
            >
              ATS Checker
            </button>
            <button
              type="button"
              className={`nav-link-btn ${currentPage === 'advisor' ? 'active' : ''}`}
              onClick={() => onNavigate('advisor')}
            >
              AI Advisor
            </button>
          </nav>
        )}

        {/* Navigation Actions */}
        <div className="nav-actions">
          <ThemeToggle />

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="user-profile-menu">
                <div className="user-avatar">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon size={14} />}
                </div>
                <span className="user-name-display">{user.displayName || user.email}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Log Out"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {currentPage !== 'login' && (
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="btn btn-outline btn-sm"
                >
                  <LogIn size={15} />
                  <span>Log In</span>
                </button>
              )}
              {currentPage !== 'register' && (
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="btn btn-primary btn-sm"
                >
                  <UserPlus size={15} />
                  <span>Get Started</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
