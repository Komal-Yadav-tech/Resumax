import React, { useState } from 'react';
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
  TrendingUp,
  Copy,
  Edit3,
  Trash2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import promotionalPosterImg from '../assets/resumax-promotional-poster.jpg';
import {
  getAllResumes,
  setActiveResumeId,
  createNewResume,
  duplicateResume,
  renameResume,
  deleteResume
} from '../services/resumeStorageService';
import { TEMPLATES } from '../components/templates/templateConstants';

export const Dashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Friend';
  const [resumes, setResumes] = useState(() => getAllResumes());

  const handleOpenResume = (id) => {
    setActiveResumeId(id);
    onNavigate('builder');
  };

  const handleCreateNew = () => {
    const title = window.prompt('Enter a title for your new resume:', 'New Resume');
    if (title !== null) {
      const created = createNewResume(title || 'New Resume', 'classic');
      setResumes(getAllResumes());
      handleOpenResume(created.id);
    }
  };

  const handleDuplicate = (id) => {
    const duplicated = duplicateResume(id);
    if (duplicated) {
      setResumes(getAllResumes());
    }
  };

  const handleRename = (id, currentTitle) => {
    const newTitle = window.prompt('Rename this resume:', currentTitle);
    if (newTitle && newTitle.trim()) {
      renameResume(id, newTitle.trim());
      setResumes(getAllResumes());
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        const remaining = deleteResume(id);
        setResumes(remaining);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* Attached Resumax Promotional Poster (Immediately Below Navbar) */}
      <div className="promotional-poster-container" id="promotional-poster">
        <img
          src={promotionalPosterImg}
          alt="Resumax - Maximize Your Resume. Maximize Your Opportunities. Create Professional Resumes with AI."
          className="promotional-poster-img"
        />
      </div>

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
                  className="btn btn-gradient btn-lg"
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
              Manage, edit, duplicate, and download your customized resumes.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCreateNew}
          >
            <Plus size={16} />
            <span>New Resume</span>
          </button>
        </div>

        {resumes.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {resumes.map((resume) => {
              const tmplObj = TEMPLATES.find((t) => t.id === resume.templateId) || TEMPLATES[0];
              const dateStr = resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'Recently';

              return (
                <div
                  key={resume.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                  className="resume-card"
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {resume.title}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: tmplObj.isAtsSafe ? 'var(--accent-light)' : 'var(--bg-hover)',
                          color: tmplObj.isAtsSafe ? 'var(--accent)' : 'var(--text-secondary)',
                          textTransform: 'uppercase'
                        }}
                      >
                        {tmplObj.name} {tmplObj.isAtsSafe ? '✓ ATS' : ''}
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      {resume.answers?.targetJobTitle || 'Professional Role'} • v{resume.version || 1}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
                      <Calendar size={13} />
                      <span>Updated {dateStr}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-xs"
                      onClick={() => handleOpenResume(resume.id)}
                    >
                      <Edit3 size={13} />
                      <span>Edit Resume</span>
                    </button>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-xs"
                        onClick={() => handleDuplicate(resume.id)}
                        title="Duplicate resume"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-xs"
                        onClick={() => handleRename(resume.id, resume.title)}
                        title="Rename resume"
                      >
                        <Edit3 size={13} />
                      </button>
                      {resumes.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-danger btn-xs"
                          onClick={() => handleDelete(resume.id)}
                          title="Delete resume"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
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
              onClick={handleCreateNew}
            >
              <img src={logoImg} alt="AI" style={{ width: 16, height: 16, borderRadius: 'var(--radius-sm)' }} />
              <span>Start Building Now</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

