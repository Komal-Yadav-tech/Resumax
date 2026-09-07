import React from 'react';
import {
  Sparkles,
  FileText,
  ShieldCheck,
  MessageSquare,
  Plus,
  ArrowRight,
  CheckCircle2,
  Zap,
  BarChart3,
  Bot,
  Layers,
  Award,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

export const Dashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Friend';

  return (
    <div className="dashboard-container">
      {/* 1. Hero / Welcome Banner */}
      <section className="welcome-banner reveal-up">
        <div className="welcome-badge">
          <img src={logoImg} alt="AI" style={{ width: 14, height: 14, borderRadius: 'var(--radius-sm)' }} />
          <span>Unlimited & 100% Free AI Career Toolkit</span>
        </div>
        <h1>Welcome back, {userName}! 👋</h1>
        <p>
          Ready to land your dream role? Explore our three powerful tools below to build an ATS-optimized
          resume, audit keyword gaps, and practice interview questions with AI.
        </p>
      </section>

      {/* 2. Serial Showcase Section 1: AI Resume Builder */}
      <section className="showcase-section reveal-up" id="feature-builder">
        <div className="showcase-card">
          <div className="showcase-grid">
            {/* Left: Content */}
            <div className="showcase-content">
              <div className="showcase-tag tag-blue">
                <Sparkles size={14} />
                <span>Feature 01 • AI Builder</span>
              </div>
              <h2>AI Conversational Resume Builder</h2>
              <p className="showcase-desc">
                Transition from a blank page to a downloadable, ATS-ready resume in minutes. Answer simple guided questions, and our AI automatically structures and enhances your bullet points with power verbs.
              </p>

              <ul className="showcase-features-list">
                <li>
                  <CheckCircle2 size={16} className="feature-check-icon text-blue" />
                  <span><strong>Step-by-step Guided Flow:</strong> No formatting headache or blank page anxiety.</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="feature-check-icon text-blue" />
                  <span><strong>Google XYZ Formula:</strong> Bullet points rewritten with quantifiable impact metrics.</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="feature-check-icon text-blue" />
                  <span><strong>12+ ATS Safe Templates:</strong> Classic, Modern, and Minimal layouts ready to export.</span>
                </li>
              </ul>

              <div className="showcase-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => onNavigate('builder')}
                >
                  <Plus size={18} />
                  <span>Create New Resume</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={() => onNavigate('templates')}
                >
                  <Layers size={18} />
                  <span>Explore Templates</span>
                </button>
              </div>
            </div>

            {/* Right: Interactive Visual Mockup */}
            <div className="showcase-visual">
              <div className="mockup-window">
                <div className="mockup-header">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                  <span className="mockup-title">AI Resume Assistant • Live Preview</span>
                </div>
                <div className="mockup-body">
                  <div className="mockup-pill-badge">
                    <Zap size={13} />
                    <span>Real-time AI Rewrite</span>
                  </div>

                  <div className="mockup-diff-box">
                    <div className="diff-item raw">
                      <span className="diff-label">Your Raw Input:</span>
                      <p>"I made websites faster and managed a team of developers."</p>
                    </div>
                    <div className="diff-arrow">
                      <Sparkles size={16} color="var(--accent)" />
                    </div>
                    <div className="diff-item ai">
                      <span className="diff-label">✨ AI Google XYZ Impact:</span>
                      <p>
                        "Architected responsive React web apps, accelerating page loads by <strong>42%</strong> and leading an Agile squad of 5 engineers."
                      </p>
                    </div>
                  </div>

                  <div className="mockup-footer-tags">
                    <span className="tag-badge">✓ ATS Compatible</span>
                    <span className="tag-badge">✓ PDF / DOCX Export</span>
                    <span className="tag-badge">✓ 100% Free</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Serial Showcase Section 2: ATS Strength Checker (Reversed Layout) */}
      <section className="showcase-section reveal-up" id="feature-ats">
        <div className="showcase-card">
          <div className="showcase-grid showcase-grid-reversed">
            {/* Visual on Left */}
            <div className="showcase-visual">
              <div className="mockup-window">
                <div className="mockup-header">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                  <span className="mockup-title">ATS Diagnostic Engine</span>
                </div>
                <div className="mockup-body">
                  {/* Gauge Card */}
                  <div className="mockup-score-banner">
                    <div className="score-circle-badge">
                      <span className="score-number">94</span>
                      <span className="score-total">/100</span>
                    </div>
                    <div className="score-meta">
                      <h4>Excellent ATS Strength</h4>
                      <p>94% Match with Target Job Posting</p>
                    </div>
                  </div>

                  {/* Keywords Preview */}
                  <div className="mockup-keywords-grid">
                    <span className="kw-pill kw-match">✓ React.js</span>
                    <span className="kw-pill kw-match">✓ TypeScript</span>
                    <span className="kw-pill kw-match">✓ REST APIs</span>
                    <span className="kw-pill kw-match">✓ Performance</span>
                    <span className="kw-pill kw-suggest">+ CI/CD Pipelines</span>
                  </div>

                  <div className="mockup-check-row">
                    <ShieldCheck size={16} color="var(--success)" />
                    <span>Single-column ATS-friendly layout validated</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content on Right */}
            <div className="showcase-content">
              <div className="showcase-tag tag-green">
                <ShieldCheck size={14} />
                <span>Feature 02 • ATS Strength Checker</span>
              </div>
              <h2>Beat Applicant Tracking Systems</h2>
              <p className="showcase-desc">
                Over 75% of resumes are discarded by automated ATS filters before a human recruiter ever sees them. Resumax scores your resume against strict ATS standards and provides instant keyword gap fixes.
              </p>

              <ul className="showcase-features-list">
                <li>
                  <CheckCircle2 size={16} className="feature-check-icon text-green" />
                  <span><strong>Comprehensive 0–100 Scoring:</strong> Checks formatting, sections, contact details, and verb strength.</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="feature-check-icon text-green" />
                  <span><strong>Job Description Matcher:</strong> Paste any job posting to discover missing keywords.</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="feature-check-icon text-green" />
                  <span><strong>Actionable Fixes:</strong> Step-by-step guidance on what to improve before applying.</span>
                </li>
              </ul>

              <div className="showcase-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => onNavigate('ats')}
                >
                  <span>Check Resume Score</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Serial Showcase Section 3: AI Career Advisor */}
      <section className="showcase-section reveal-up" id="feature-advisor">
        <div className="showcase-card">
          <div className="showcase-grid">
            {/* Left: Content */}
            <div className="showcase-content">
              <div className="showcase-tag tag-purple">
                <Bot size={14} />
                <span>Feature 03 • AI Career Advisor</span>
              </div>
              <h2>24/7 Personalized AI Career Coach</h2>
              <p className="showcase-desc">
                Get real-time career coaching grounded in your actual resume data. Ask anything from explaining employment gaps and phrasing career transitions to conducting mock interview simulations with the STAR method.
              </p>

              <ul className="showcase-features-list">
                <li>
                  <CheckCircle2 size={16} className="feature-check-icon text-purple" />
                  <span><strong>Resume Context Aware:</strong> Understands your exact skills and experience history.</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="feature-check-icon text-purple" />
                  <span><strong>STAR Interview Simulator:</strong> Practice answering tough behavioral questions.</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="feature-check-icon text-purple" />
                  <span><strong>Career Pivot Strategies:</strong> Frame your transferable skills for a new industry.</span>
                </li>
              </ul>

              <div className="showcase-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => onNavigate('advisor')}
                >
                  <MessageSquare size={18} />
                  <span>Ask Career Advisor</span>
                </button>
              </div>
            </div>

            {/* Right: Interactive Chat Mockup */}
            <div className="showcase-visual">
              <div className="mockup-window">
                <div className="mockup-header">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                  <span className="mockup-title">AI Career Advisor • Live Chat</span>
                </div>
                <div className="mockup-body mockup-chat-body">
                  <div className="mockup-chat-msg user">
                    <p>How can I explain a 6-month career gap during my upcoming tech interview?</p>
                  </div>
                  <div className="mockup-chat-msg bot">
                    <div className="bot-avatar-mini">
                      <Sparkles size={12} color="#fff" />
                    </div>
                    <div className="bot-text">
                      <p>
                        Frame it positively with proactive growth:
                      </p>
                      <p style={{ marginTop: '0.35rem', fontStyle: 'italic', fontSize: '0.82rem' }}>
                        "I used that period to upskill in modern cloud architecture, build full-stack open-source projects, and re-energize for this specific role."
                      </p>
                    </div>
                  </div>

                  <div className="mockup-chat-quick-actions">
                    <span className="quick-pill">✨ Explain Career Gap</span>
                    <span className="quick-pill">🎯 STAR Interview Practice</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Resumes Section (At the Bottom) */}
      <section className="resumes-bottom-section reveal-up" id="my-resumes">
        <div className="section-header">
          <div>
            <h2>My Resumes</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Manage, edit, and download your ATS-ready resume drafts.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate('builder')}
          >
            <Plus size={16} />
            <span>New Resume</span>
          </button>
        </div>

        <div className="resumes-empty-card">
          <div className="empty-icon-circle">
            <FileText size={32} />
          </div>
          <h3>No resumes created yet</h3>
          <p>
            Start your first ATS-optimized resume in under 5 minutes with our step-by-step AI assistant.
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={() => onNavigate('builder')}
          >
            <img src={logoImg} alt="AI" style={{ width: 16, height: 16, borderRadius: 'var(--radius-sm)' }} />
            <span>Start Building Now</span>
          </button>
        </div>
      </section>
    </div>
  );
};

