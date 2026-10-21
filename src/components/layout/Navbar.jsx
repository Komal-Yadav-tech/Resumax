import React, { useState } from 'react';
import {
  LogOut,
  User as UserIcon,
  LogIn,
  UserPlus,
  Menu,
  X,
  FileText,
  Home,
  MessageSquare,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../theme/ThemeToggle';
import logoImg from '../../assets/logo.png';

export const Navbar = ({ onNavigate, currentPage }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setMobileMenuOpen(false);
      await logout();
      if (onNavigate) onNavigate('welcome');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleNavClick = (page) => {
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(page);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div
          className="brand-logo"
          onClick={() => handleNavClick('welcome')}
          title="Go to Welcome Page"
        >
          <div className="brand-icon-wrapper">
            <img src={logoImg} alt="Resumax" className="brand-logo-img" />
          </div>
          <span className="brand-title-text">Resumax</span>
          <span className="brand-badge">Free</span>
        </div>

        {/* Center Nav Links (Desktop View - No Admin Link) */}
        {user && (
          <nav className="nav-center-links desktop-only-nav">
            <button
              type="button"
              className={`nav-link-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNavClick('dashboard')}
            >
              Dashboard
            </button>
            <button
              type="button"
              className={`nav-link-btn ${currentPage === 'builder' ? 'active' : ''}`}
              onClick={() => handleNavClick('builder')}
            >
              Builder
            </button>
            <button
              type="button"
              className={`nav-link-btn ${currentPage === 'ats' ? 'active' : ''}`}
              onClick={() => handleNavClick('ats')}
            >
              ATS Checker
            </button>
            <button
              type="button"
              className={`nav-link-btn ${currentPage === 'advisor' ? 'active ai-nav-item' : ''}`}
              onClick={() => handleNavClick('advisor')}
            >
              AI Advisor
            </button>
          </nav>
        )}

        {/* Desktop Navigation Actions */}
        <div className="nav-actions desktop-only-actions">
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
                  onClick={() => handleNavClick('login')}
                  className="btn btn-outline btn-sm"
                >
                  <LogIn size={15} />
                  <span>Log In</span>
                </button>
              )}
              {currentPage !== 'register' && (
                <button
                  type="button"
                  onClick={() => handleNavClick('register')}
                  className="btn btn-primary btn-sm"
                >
                  <UserPlus size={15} />
                  <span>Get Started</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mobile Action Controls: Theme + Hamburger Toggle */}
        <div className="mobile-navbar-controls">
          <ThemeToggle />
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-content">
            {/* User Profile Info on Mobile */}
            {user && (
              <div className="mobile-user-card">
                <div className="user-avatar">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon size={16} />}
                </div>
                <div className="mobile-user-info">
                  <span className="mobile-user-name">{user.displayName || 'User'}</span>
                  <span className="mobile-user-email">{user.email}</span>
                </div>
              </div>
            )}

            {/* Mobile Nav Links (No Admin Link) */}
            <div className="mobile-nav-links-list">
              <button
                type="button"
                className={`mobile-nav-item ${currentPage === 'welcome' ? 'active' : ''}`}
                onClick={() => handleNavClick('welcome')}
              >
                <Home size={18} />
                <span>Home & Welcome</span>
              </button>

              {user ? (
                <>
                  <button
                    type="button"
                    className={`mobile-nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
                    onClick={() => handleNavClick('dashboard')}
                  >
                    <FileText size={18} />
                    <span>Dashboard</span>
                  </button>

                  <button
                    type="button"
                    className={`mobile-nav-item ${currentPage === 'builder' ? 'active' : ''}`}
                    onClick={() => handleNavClick('builder')}
                  >
                    <Sparkles size={18} />
                    <span>Resume Builder</span>
                  </button>

                  <button
                    type="button"
                    className={`mobile-nav-item ${currentPage === 'ats' ? 'active' : ''}`}
                    onClick={() => handleNavClick('ats')}
                  >
                    <ShieldCheck size={18} />
                    <span>ATS Checker</span>
                  </button>

                  <button
                    type="button"
                    className={`mobile-nav-item ${currentPage === 'advisor' ? 'active ai-nav-item' : ''}`}
                    onClick={() => handleNavClick('advisor')}
                  >
                    <MessageSquare size={18} />
                    <span>AI Advisor</span>
                  </button>
                </>
              ) : null}
            </div>

            {/* Mobile Auth Actions */}
            <div className="mobile-nav-footer-actions">
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-outline btn-full mobile-logout-btn"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%' }}>
                  <button
                    type="button"
                    onClick={() => handleNavClick('login')}
                    className="btn btn-outline btn-full"
                  >
                    <LogIn size={16} />
                    <span>Log In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavClick('register')}
                    className="btn btn-primary btn-full"
                  >
                    <UserPlus size={16} />
                    <span>Create Free Account</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
