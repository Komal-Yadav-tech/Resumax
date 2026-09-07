import React from 'react';
import {
  Sparkles,
  FileText,
  ShieldCheck,
  MessageSquare,
  Plus,
  ArrowRight,
  Clock,
  Download,
  Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

export const Dashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Friend';

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <section className="welcome-banner">
        <div className="welcome-badge">
          <img src={logoImg} alt="AI" style={{ width: 14, height: 14, borderRadius: 'var(--radius-sm)' }} /> Unlimited & 100% Free AI Career Toolkit
        </div>
        <h1>Welcome back, {userName}! 👋</h1>
        <p>
          Ready to land your dream role? Answer a few guided questions to generate a tailored,
          ATS-ready resume or evaluate your existing resume with AI scoring.
        </p>
      </section>

      {/* Feature Navigation Cards */}
      <div className="dashboard-grid">
        {/* Card 1: AI Resume Builder */}
        <div className="feature-card">
          <span className="badge-free">Free</span>
          <div
            className="feature-icon-box"
            style={{
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(124, 58, 237, 0.15))',
              color: 'var(--accent)'
            }}
          >
            <FileText size={24} />
          </div>
          <h3>AI Resume Builder</h3>
          <p>
            Answer simple step-by-step questions. Our AI drafts impactful bullet points, summary,
            and formats it automatically.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate('builder')}
          >
            <Plus size={16} />
            <span>Create New Resume</span>
          </button>
        </div>

        {/* Card 2: ATS Strength Checker */}
        <div className="feature-card">
          <span className="badge-free">Free</span>
          <div
            className="feature-icon-box"
            style={{
              background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.15), rgba(13, 148, 136, 0.15))',
              color: 'var(--success)'
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <h3>ATS Strength Checker</h3>
          <p>
            Get a 0–100 score, discover missing job keywords, and receive actionable fixes to beat
            applicant tracking systems.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate('ats')}
          >
            <span>Check Resume Score</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Card 3: AI Career Chatbot */}
        <div className="feature-card">
          <span className="badge-free">Free</span>
          <div
            className="feature-icon-box"
            style={{
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(124, 58, 237, 0.15))',
              color: 'var(--accent)'
            }}
          >
            <MessageSquare size={24} />
          </div>
          <h3>AI Career Advisor</h3>
          <p>
            Ask tailored questions about career pivots, explaining employment gaps, interview prep,
            and bullet point polishing.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate('advisor')}
          >
            <span>Ask Advisor</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Resumes Section */}
      <section style={{ marginTop: '2rem' }}>
        <div className="section-header">
          <h2>My Resumes</h2>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => onNavigate('builder')}
          >
            <Plus size={15} />
            <span>New Resume</span>
          </button>
        </div>

        <div className="resumes-empty-card">
          <div
            style={{
              width: 56,
              height: 56,
              margin: '0 auto 1rem',
              borderRadius: '50%',
              background: 'var(--accent-light)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FileText size={28} />
          </div>
          <h3 style={{ marginBottom: '0.4rem', fontSize: '1.15rem' }}>No resumes created yet</h3>
          <p>
            Start your first resume in under 5 minutes with our conversational AI assistant.
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('builder')}
          >
            <img src={logoImg} alt="AI" style={{ width: 15, height: 15, borderRadius: 'var(--radius-sm)' }} />
            <span>Start Building Now</span>
          </button>
        </div>
      </section>
    </div>
  );
};

