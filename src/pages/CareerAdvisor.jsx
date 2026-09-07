import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  FileText,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { ChatPanel } from '../components/chatbot/ChatPanel';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

export const CareerAdvisor = ({ onNavigate }) => {
  const { user } = useAuth();
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Friend';

  const [resumeData, setResumeData] = useState(() => {
    try {
      const draft = localStorage.getItem('resumax_builder_draft');
      if (draft) return JSON.parse(draft);
    } catch (e) {}
    return {
      fullName: 'Alex Morgan',
      targetJobTitle: 'Senior Frontend Engineer',
      skills: ['React', 'TypeScript', 'Next.js', 'REST APIs', 'Git', 'Agile'],
      experience: [
        {
          id: 1,
          role: 'Senior Software Engineer',
          company: 'TechFlow Solutions'
        }
      ]
    };
  });

  return (
    <div className="career-advisor-page">
      {/* Header Banner */}
      <div className="advisor-header-banner">
        <div className="advisor-header-content">
          <div className="welcome-badge">
            <img src={logoImg} alt="AI" style={{ width: 14, height: 14, borderRadius: 'var(--radius-sm)' }} /> 100% Free & Unlimited Career Coaching
          </div>
          <h1>AI Career Advisor</h1>
          <p>
            Get instant on-demand career advice, interview rehearsal questions, resume bullet rewrites,
            and employment gap strategies grounded in your real resume experience.
          </p>
        </div>

        <div className="advisor-header-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onNavigate('builder')}
          >
            <Edit3 size={15} />
            <span>Open Resume Builder</span>
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onNavigate('ats')}
          >
            <ShieldCheck size={15} />
            <span>Check ATS Score</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="advisor-main-grid">
        {/* Left Column: Context Snapshot & Quick Links */}
        <div className="advisor-sidebar-col">
          {/* Active Context Card */}
          <div className="ats-panel-card">
            <div className="ats-panel-title">
              <FileText size={16} color="var(--accent)" />
              <h3>Loaded Resume Context</h3>
            </div>
            <div className="active-resume-summary">
              <div className="summary-row">
                <span className="summary-label">Target Role:</span>
                <strong>{resumeData.targetJobTitle || 'Not specified'}</strong>
              </div>
              <div className="summary-row">
                <span className="summary-label">Primary Skills:</span>
                <span>{resumeData.skills?.slice(0, 4).join(', ') || 'None listed'}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Latest Role:</span>
                <span>{resumeData.experience?.[0]?.role || 'Professional'}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Company:</span>
                <span>{resumeData.experience?.[0]?.company || 'Tech Company'}</span>
              </div>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', fontSize: '0.8rem' }}
                onClick={() => onNavigate('builder')}
              >
                <Edit3 size={14} />
                <span>Update Resume Details</span>
              </button>
            </div>
          </div>

          {/* Tips Card */}
          <div className="ats-panel-card" style={{ marginTop: '1rem' }}>
            <div className="ats-panel-title">
              <img src={logoImg} alt="AI" style={{ width: 16, height: 16, borderRadius: 'var(--radius-sm)' }} />
              <h3>Coaching Ideas</h3>
            </div>
            <ul style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', paddingLeft: '1.1rem', lineHeight: '1.6' }}>
              <li>Ask how to negotiate higher compensation for your target role.</li>
              <li>Paste an existing bullet point and ask for 3 impactful revisions.</li>
              <li>Ask for mock behavioral interview questions using the STAR framework.</li>
              <li>Ask how to transition smoothly into a new tech domain or management.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Interactive Chat Panel */}
        <div className="advisor-chat-col">
          <ChatPanel
            resumeContext={resumeData}
            userName={userName}
            isCompact={false}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
};
