import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Builder } from './pages/Builder';
import { AtsChecker } from './pages/AtsChecker';
import { CareerAdvisor } from './pages/CareerAdvisor';
import { FloatingChatWidget } from './components/chatbot/FloatingChatWidget';
import { FeedbackModal } from './components/feedback/FeedbackModal';

export const App = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false);

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

  // Handle URL hash changes or initial state
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || '';
      if (['login', 'register', 'dashboard', 'builder', 'ats', 'advisor', 'templates'].includes(hash)) {
        if (hash === 'templates') {
          setCurrentPage('builder');
          setIsTemplateGalleryOpen(true);
        } else {
          setCurrentPage(hash);
          setIsTemplateGalleryOpen(false);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Sync navigation with auth state
  useEffect(() => {
    if (!loading) {
      if (user) {
        // Authenticated user should go to dashboard if on auth pages
        if (currentPage === 'login' || currentPage === 'register') {
          setCurrentPage('dashboard');
          window.location.hash = 'dashboard';
        }
      } else {
        // Unauthenticated user attempting to access protected pages should go to login
        if (['dashboard', 'builder', 'ats', 'advisor', 'templates'].includes(currentPage)) {
          setCurrentPage('login');
          window.location.hash = 'login';
        }
      }
    }
  }, [user, loading, currentPage]);

  const navigateTo = (page) => {
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

  return (
    <div className="app-container">
      {/* Top Navbar: hidden when Template Selection page/view is active */}
      {!isTemplateGalleryOpen && <Navbar onNavigate={navigateTo} currentPage={currentPage} />}
      
      <main className="main-content">
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

      {/* Floating Quick Advisor: hidden completely when Template Selection page is open */}
      {!isTemplateGalleryOpen && (
        <FloatingChatWidget onNavigate={navigateTo} currentPage={currentPage} />
      )}

      {/* Session Review / Feedback Modal */}
      <FeedbackModal />
    </div>
  );
};

