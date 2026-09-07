import React, { useState } from 'react';
import { MessageSquare, X, ChevronDown } from 'lucide-react';
import { ChatPanel } from './ChatPanel';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';

export const FloatingChatWidget = ({ onNavigate, currentPage }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // If on the full-page career advisor page or unauthenticated, don't show the floating widget
  if (!user || currentPage === 'advisor' || currentPage === 'login' || currentPage === 'register') {
    return null;
  }

  // Get active resume context
  let resumeContext = {};
  try {
    const draft = localStorage.getItem('resumax_builder_draft');
    if (draft) resumeContext = JSON.parse(draft);
  } catch (e) {
    // fallback
  }

  return (
    <div className="floating-chat-root">
      {isOpen ? (
        <div className="floating-chat-window">
          <div className="floating-chat-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <img src={logoImg} alt="AI" style={{ width: 16, height: 16, borderRadius: 'var(--radius-sm)' }} />
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Quick AI Career Advisor</span>
            </div>
            <button
              type="button"
              className="btn-outline floating-close-btn"
              onClick={() => setIsOpen(false)}
              title="Close chat drawer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="floating-chat-body">
            <ChatPanel
              resumeContext={resumeContext}
              userName={user?.displayName || 'Friend'}
              isCompact={true}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="floating-chat-trigger"
          onClick={() => setIsOpen(true)}
          title="Open AI Career Advisor"
        >
          <div className="floating-trigger-icon">
            <img src={logoImg} alt="AI" style={{ width: 20, height: 20, borderRadius: 'var(--radius-sm)' }} />
          </div>
          <span className="floating-trigger-label">AI Advisor</span>
          <span className="floating-trigger-badge">Free</span>
        </button>
      )}
    </div>
  );
};
