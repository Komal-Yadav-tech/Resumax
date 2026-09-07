import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useSiteConfig } from './context/SiteConfigContext';
import { Navbar } from './components/layout/Navbar';
import { WelcomeScreen } from './pages/WelcomeScreen';
import { AdminPanel } from './pages/AdminPanel';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Builder } from './pages/Builder';
import { AtsChecker } from './pages/AtsChecker';
import { CareerAdvisor } from './pages/CareerAdvisor';
import { FloatingChatWidget } from './components/chatbot/FloatingChatWidget';
import { FeedbackModal } from './components/feedback/FeedbackModal';
import { Sparkles, ArrowRight, X } from 'lucide-react';

export const App = () => {
  const { user, loading } = useAuth();
  const { content } = useSiteConfig();
  const [currentPage, setCurrentPage] = useState('welcome');
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Sync body class when Template Selection full-screen view is active
  useEffect(() => {
    if (isTemplateGalleryOpen) {
      document.body.classList.add('template-gallery-active');
    } else {
      document.body.classList.remove('template-gallery-active');
    }
    return () => {
      document.body.classList.remove('template-gallery-active');
    };
  }, [isTemplateGalleryOpen]);

  // Check if directly accessing /admin via pathname or hash
  const isDirectAdminUrl = () =>
    window.location.hash === '#admin' ||
    window.location.pathname === '/admin' ||
    window.location.pathname.startsWith('/admin/');

  const [hasVisitedWelcome, setHasVisitedWelcome] = useState(false);

  // Handle URL hash changes or initial state
  useEffect(() => {
    // If directly navigating to admin, go straight to admin panel
    if (isDirectAdminUrl()) {
      setCurrentPage('admin');
      setIsTemplateGalleryOpen(false);
      setHasVisitedWelcome(true);
      return;
    }

    // Always show welcome first on initial load / refresh
    if (!hasVisitedWelcome) {
      setCurrentPage('welcome');
      setIsTemplateGalleryOpen(false);
      return;
    }

    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || '';
      const validRoutes = [
        'welcome',
        'login',
        'register',
        'dashboard',
        'builder',
        'ats',
        'advisor',
        'templates',
        'admin'
      ];

      if (validRoutes.includes(hash)) {
        if (hash === 'templates') {
          setCurrentPage('builder');
          setIsTemplateGalleryOpen(true);
        } else {
          setCurrentPage(hash);
          setIsTemplateGalleryOpen(false);
        }
      } else if (!hash) {
        setCurrentPage('welcome');
        setIsTemplateGalleryOpen(false);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [hasVisitedWelcome]);

  // Sync navigation with auth state for protected routes
  useEffect(() => {
    if (!loading) {
      if (user) {
        // If logged in and on login/register, go to dashboard
        if (currentPage === 'login' || currentPage === 'register') {
          setCurrentPage('dashboard');
          window.location.hash = 'dashboard';
        }
      } else {
        // Unauthenticated users attempting to access protected pages go to login
        if (['dashboard', 'builder', 'ats', 'advisor'].includes(currentPage)) {
          setCurrentPage('login');
          window.location.hash = 'login';
        }
      }
    }
  }, [user, loading, currentPage]);

  const navigateTo = (page) => {
    setHasVisitedWelcome(true);
    if (page === 'templates') {
      setCurrentPage('builder');
      setIsTemplateGalleryOpen(true);
      window.location.hash = 'templates';
    } else {
      setCurrentPage(page);
      setIsTemplateGalleryOpen(false);
      window.location.hash = page;
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)'
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid var(--border)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading Resumax...</p>
      </div>
    );
  }

  const showAnnouncementBanner =
    !bannerDismissed &&
    content?.announcementBanner?.enabled &&
    Boolean(content?.announcementBanner?.text) &&
    currentPage !== 'admin' &&
    currentPage !== 'welcome';

  return (
    <div className="app-container">
      {/* Top Announcement Banner */}
      {showAnnouncementBanner && (
        <div className="site-announcement-banner">
          <div className="announcement-content">
            <Sparkles size={14} className="announcement-icon" />
            <span className="announcement-text">{content.announcementBanner.text}</span>
            {content.announcementBanner.linkText && (
              <button
                type="button"
                className="announcement-link-btn"
                onClick={() => navigateTo(content.announcementBanner.linkTarget || 'templates')}
              >
                <span>{content.announcementBanner.linkText}</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
          <button
            type="button"
            className="announcement-dismiss-btn"
            onClick={() => setBannerDismissed(true)}
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Navbar: hidden when Template Selection page/view is active or on welcome/admin */}
      {!isTemplateGalleryOpen && currentPage !== 'admin' && currentPage !== 'welcome' && (
        <Navbar onNavigate={navigateTo} currentPage={currentPage} />
      )}

      <main className="main-content">
        {currentPage === 'welcome' && <WelcomeScreen onNavigate={navigateTo} />}
        {currentPage === 'admin' && <AdminPanel onNavigate={navigateTo} />}
        {currentPage === 'register' && <Register onNavigate={navigateTo} />}
        {currentPage === 'login' && <Login onNavigate={navigateTo} />}
        {currentPage === 'dashboard' && user && <Dashboard onNavigate={navigateTo} />}
        {currentPage === 'builder' && user && (
          <Builder
            onNavigate={navigateTo}
            isTemplateGalleryOpen={isTemplateGalleryOpen}
            setIsTemplateGalleryOpen={setIsTemplateGalleryOpen}
          />
        )}
        {currentPage === 'ats' && user && <AtsChecker onNavigate={navigateTo} />}
        {currentPage === 'advisor' && user && <CareerAdvisor onNavigate={navigateTo} />}
      </main>

      {/* Floating Quick Advisor: hidden when on welcome, admin, or Template Selection page */}
      {!isTemplateGalleryOpen &&
        currentPage !== 'welcome' &&
        currentPage !== 'admin' && (
          <FloatingChatWidget onNavigate={navigateTo} currentPage={currentPage} />
        )}

      {/* Session Review / Feedback Modal */}
      <FeedbackModal />
    </div>
  );
};
