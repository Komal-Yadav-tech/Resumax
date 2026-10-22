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
  TrendingUp,
  Edit3,
  Rocket,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Briefcase,
  GraduationCap,
  Code2,
  Trophy,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import studentImg from '../assets/hero-student.jpg';
import rudraAvatarImg from '../assets/hero-rudra-avatar.jpg';

export const Dashboard = ({ onNavigate }) => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      {/* 1. Hero / Welcome Banner (Functional Hero UI Recreated from Poster) */}
      <section className="welcome-banner reveal-up" id="hero-section">
        <div className="hero-layout-grid">
          {/* Left Column: Strictly Preserved Existing Left-Side Content */}
          <div className="hero-content-left">
            {/* Brand Header & Tagline */}
            <div className="hero-brand-header">
              <div className="hero-brand-identity">
                <div className="hero-brand-logo-wrapper">
                  <img src={logoImg} alt="Resumax Logo" className="hero-brand-logo" />
                </div>
                <div className="hero-brand-text-block">
                  <div className="hero-brand-title-row">
                    <span className="hero-brand-title">Resumax</span>
                    <span className="welcome-badge">
                      <span>Free AI Toolkit</span>
                    </span>
                  </div>
                  <p className="hero-tagline">
                    Maximize Your <span className="text-blue">Resume</span>. Maximize Your <span className="text-violet">Opportunities</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="hero-main-heading">
              Create Professional Resumes<br />
              with <span className="hero-ai-gradient">AI</span>
            </h1>

            {/* Supporting Description */}
            <p className="hero-description">
              Build, customize, and optimize your resume with smart AI tools. Get ATS-friendly, modern templates and stand out from the crowd.
            </p>

            {/* Four Feature Highlights */}
            <div className="hero-features-row">
              <div
                className="hero-feature-item"
                onClick={() => onNavigate('builder')}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
                title="Open AI Resume Builder"
              >
                <div className="hero-feature-icon-circle icon-violet">
                  <Sparkles size={20} />
                </div>
                <div className="hero-feature-text">
                  <strong className="hero-feature-title">AI Resume Builder</strong>
                  <span className="hero-feature-subtext">Create in seconds with AI</span>
                </div>
              </div>

              <div className="hero-feature-divider" />

              <div
                className="hero-feature-item"
                onClick={() => onNavigate('ats')}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
                title="Open ATS Score Checker"
              >
                <div className="hero-feature-icon-circle icon-green">
                  <ShieldCheck size={20} />
                </div>
                <div className="hero-feature-text">
                  <strong className="hero-feature-title">ATS Score Checker</strong>
                  <span className="hero-feature-subtext">Improve your chances</span>
                </div>
              </div>

              <div className="hero-feature-divider" />

              <div
                className="hero-feature-item"
                onClick={() => onNavigate('templates')}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
                title="Explore Templates"
              >
                <div className="hero-feature-icon-circle icon-blue">
                  <Layers size={20} />
                </div>
                <div className="hero-feature-text">
                  <strong className="hero-feature-title">Multiple Templates</strong>
                  <span className="hero-feature-subtext">9+ professional styles</span>
                </div>
              </div>

              <div className="hero-feature-divider" />

              <div
                className="hero-feature-item"
                onClick={() => onNavigate('builder')}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
                title="Customize Resume in Builder"
              >
                <div className="hero-feature-icon-circle icon-purple">
                  <Edit3 size={20} />
                </div>
                <div className="hero-feature-text">
                  <strong className="hero-feature-title">Easy Customization</strong>
                  <span className="hero-feature-subtext">Make it your own</span>
                </div>
              </div>
            </div>

            {/* Primary CTA Button */}
            <div className="hero-cta-group">
              <button
                type="button"
                className="hero-primary-cta-btn"
                onClick={() => onNavigate('builder')}
                id="hero-build-resume-btn"
              >
                <span>Build Your Resume Now</span>
                <ArrowRight size={18} className="hero-cta-arrow" />
              </button>
            </div>

            {/* Bottom Trust Highlights */}
            <div className="hero-bottom-highlights">
              <div className="hero-highlight-item">
                <Zap size={16} className="highlight-icon text-blue" />
                <div className="highlight-text">
                  <strong>Save Time</strong>
                  <span>No more manual work</span>
                </div>
              </div>

              <div className="hero-highlight-separator" />

              <div className="hero-highlight-item">
                <Award size={16} className="highlight-icon text-blue" />
                <div className="highlight-text">
                  <strong>Get Noticed</strong>
                  <span>Stand out to recruiters</span>
                </div>
              </div>

              <div className="hero-highlight-separator" />

              <div className="hero-highlight-item">
                <TrendingUp size={16} className="highlight-icon text-violet" />
                <div className="highlight-text">
                  <strong>Achieve Your Goals</strong>
                  <span>Your dream job is closer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Red-Circled Poster Showcase Components */}
          <div className="hero-showcase-right">
            {/* Top Student Visual with Hand-drawn "Your Future Starts Here" */}
            <div className="hero-student-section">
              <div className="hero-future-callout">
                <span className="hero-future-text">Your Future<br />Starts Here</span>
                <svg className="hero-future-arrow" viewBox="0 0 50 35" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 6 6 C 18 24, 32 28, 44 18" />
                  <polyline points="36 22 45 17 44 8" />
                </svg>
              </div>

              <div className="hero-student-wrapper">
                <div className="hero-student-blob" />
                <img src={studentImg} alt="Student with Laptop" className="hero-student-img" />
              </div>
            </div>

            {/* Main Showcase Stage: Resume Preview + Floating Elements */}
            <div className="hero-showcase-stage">
              {/* Floating ATS Score Card (Top Right) */}
              <div className="hero-floating-ats-card">
                <div className="hero-ats-ring-wrap">
                  <svg className="hero-ats-svg-ring" width="46" height="46" viewBox="0 0 46 46">
                    <circle
                      cx="23"
                      cy="23"
                      r="18"
                      fill="transparent"
                      stroke="#E2E8F0"
                      strokeWidth="4"
                    />
                    <circle
                      cx="23"
                      cy="23"
                      r="18"
                      fill="transparent"
                      stroke="#16A34A"
                      strokeWidth="4"
                      strokeDasharray="113.1"
                      strokeDashoffset="9.0"
                      strokeLinecap="round"
                      transform="rotate(-90 23 23)"
                    />
                  </svg>
                </div>
                <div className="hero-ats-card-content">
                  <span className="hero-ats-card-label">ATS Score</span>
                  <strong className="hero-ats-card-score">92%</strong>
                  <span className="hero-ats-status-badge">
                    <span>Excellent</span>
                    <Check size={11} strokeWidth={3} />
                  </span>
                </div>
              </div>

              {/* Floating AI Powered Badge (Bottom Left) */}
              <div className="hero-floating-ai-badge">
                <Sparkles size={14} className="hero-ai-badge-icon" />
                <span>AI Powered</span>
              </div>

              {/* Main Realistic Resume Preview Mockup */}
              <div className="hero-resume-mockup">
                {/* Dark Navy Sidebar */}
                <div className="resume-mock-sidebar">
                  <div className="resume-mock-avatar-wrap">
                    <img src={rudraAvatarImg} alt="Rudra Kumar" className="resume-mock-avatar" />
                  </div>
                  <h3 className="resume-mock-name">Rudra Kumar</h3>
                  <span className="resume-mock-role">Computer Science Student</span>

                  <div className="resume-mock-contacts">
                    <div className="resume-mock-contact-item">
                      <Phone size={9} className="mock-contact-icon" />
                      <span>+91 98765 43210</span>
                    </div>
                    <div className="resume-mock-contact-item">
                      <Mail size={9} className="mock-contact-icon" />
                      <span>rudra@email.com</span>
                    </div>
                    <div className="resume-mock-contact-item">
                      <MapPin size={9} className="mock-contact-icon" />
                      <span>Kanpur, Uttar Pradesh</span>
                    </div>
                    <div className="resume-mock-contact-item">
                      <Linkedin size={9} className="mock-contact-icon" />
                      <span>linkedin.com/in/rudra</span>
                    </div>
                  </div>

                  <div className="resume-mock-skills-section">
                    <h4 className="resume-mock-section-title sidebar-title">Skills</h4>
                    <div className="resume-mock-skills-list">
                      <span className="mock-skill-pill">Python</span>
                      <span className="mock-skill-pill">Cybersecurity</span>
                      <span className="mock-skill-pill">Web Development</span>
                      <span className="mock-skill-pill">Power BI</span>
                      <span className="mock-skill-pill">Graphic Designing</span>
                    </div>
                  </div>
                </div>

                {/* White Main Content Area */}
                <div className="resume-mock-body">
                  {/* Work Experience */}
                  <div className="resume-mock-section">
                    <div className="resume-mock-header-row">
                      <Briefcase size={12} className="mock-header-icon" />
                      <h4 className="resume-mock-section-title">Work Experience</h4>
                    </div>
                    <div className="mock-entry">
                      <div className="mock-entry-title">Intern – Cybersecurity</div>
                      <div className="mock-entry-meta">ABC Tech Solutions | Jun 2025 – Aug 2025</div>
                      <ul className="mock-bullets">
                        <li>Assisted in network monitoring and threat analysis.</li>
                        <li>Worked with security tools to identify vulnerabilities.</li>
                        <li>Supported incident response and documentation.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Education */}
                  <div className="resume-mock-section">
                    <div className="resume-mock-header-row">
                      <GraduationCap size={12} className="mock-header-icon" />
                      <h4 className="resume-mock-section-title">Education</h4>
                    </div>
                    <div className="mock-entry">
                      <div className="mock-entry-title">BCA (Bachelor of Computer Applications)</div>
                      <div className="mock-entry-meta">CSJMU, Kanpur | 2023 – 2026</div>
                      <div className="mock-entry-cgpa">CGPA: 8.2</div>
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="resume-mock-section">
                    <div className="resume-mock-header-row">
                      <Code2 size={12} className="mock-header-icon" />
                      <h4 className="resume-mock-section-title">Projects</h4>
                    </div>
                    <div className="mock-entry">
                      <div className="mock-entry-title">Resumax – AI Resume Builder</div>
                      <ul className="mock-bullets">
                        <li>Built a web app using React & Tailwind CSS.</li>
                        <li>Integrated AI for resume generation & ATS check.</li>
                        <li>Added multiple templates and customization options.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="resume-mock-section">
                    <div className="resume-mock-header-row">
                      <Trophy size={12} className="mock-header-icon" />
                      <h4 className="resume-mock-section-title">Achievements</h4>
                    </div>
                    <ul className="mock-bullets">
                      <li>7+ Hackathons (Team Member & Team Leader)</li>
                      <li>Active on TryHackMe (Cybersecurity Learning)</li>
                      <li>Completed Python & Web Development Projects</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Template Preview Cards Column (Right Side of Mockup) */}
              <div className="hero-template-previews">
                {/* 1. ATS Safe */}
                <div
                  className="hero-template-card"
                  onClick={() => onNavigate('templates')}
                  role="button"
                  tabIndex={0}
                  title="Choose ATS Safe Template"
                >
                  <div className="hero-template-card-header">
                    <div className="hero-template-card-icon-wrap icon-blue">
                      <ShieldCheck size={13} />
                    </div>
                    <span className="hero-template-card-name">ATS Safe</span>
                    <CheckCircle2 size={12} className="hero-template-check-icon text-blue" />
                  </div>
                  <div className="hero-mini-wireframe wireframe-ats">
                    <div className="wireframe-bar-header" />
                    <div className="wireframe-line line-full" />
                    <div className="wireframe-line line-75" />
                    <div className="wireframe-line line-50" />
                  </div>
                </div>

                {/* 2. Modern */}
                <div
                  className="hero-template-card"
                  onClick={() => onNavigate('templates')}
                  role="button"
                  tabIndex={0}
                  title="Choose Modern Template"
                >
                  <div className="hero-template-card-header">
                    <div className="hero-template-card-icon-wrap icon-purple">
                      <Layers size={13} />
                    </div>
                    <span className="hero-template-card-name">Modern</span>
                  </div>
                  <div className="hero-mini-wireframe wireframe-modern">
                    <div className="wireframe-col-left" />
                    <div className="wireframe-col-right">
                      <div className="wireframe-line line-full" />
                      <div className="wireframe-line line-60" />
                      <div className="wireframe-line line-80" />
                    </div>
                  </div>
                </div>

                {/* 3. Minimal */}
                <div
                  className="hero-template-card"
                  onClick={() => onNavigate('templates')}
                  role="button"
                  tabIndex={0}
                  title="Choose Minimal Template"
                >
                  <div className="hero-template-card-header">
                    <div className="hero-template-card-icon-wrap icon-navy">
                      <FileText size={13} />
                    </div>
                    <span className="hero-template-card-name">Minimal</span>
                  </div>
                  <div className="hero-mini-wireframe wireframe-minimal">
                    <div className="wireframe-line line-header" />
                    <div className="wireframe-line line-full" />
                    <div className="wireframe-line line-80" />
                    <div className="wireframe-line line-70" />
                  </div>
                </div>

                {/* More Templates Link */}
                <button
                  type="button"
                  className="hero-more-templates-btn"
                  onClick={() => onNavigate('templates')}
                >
                  + More Templates
                </button>
              </div>
            </div>

            {/* Bottom Promotional Highlights (Right Side) */}
            <div className="hero-showcase-bottom">
              <div className="hero-highlight-item hero-highlight-goal">
                <Rocket size={18} className="highlight-icon text-violet" />
                <div className="highlight-text">
                  <strong>Achieve Your Goals</strong>
                  <span>Your dream job is closer</span>
                </div>
              </div>

              <div className="hero-handwritten-slogan-wrap">
                <span className="hero-handwritten-slogan">
                  Smart Resumes.<br />Bigger Opportunities.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Serial Showcase Section 1: AI Resume Builder */}
      <section className="showcase-section reveal-up" id="feature-builder">
        <div className="showcase-card">
          <div className="showcase-grid">
            {/* Left: Content */}
            <div className="showcase-content">
              <div
                className="showcase-tag tag-blue"
                onClick={() => onNavigate('builder')}
                style={{ cursor: 'pointer' }}
                title="Launch AI Resume Builder"
              >
                <Sparkles size={14} />
                <span>Feature 01 • AI Builder</span>
              </div>
              <h2
                onClick={() => onNavigate('builder')}
                style={{ cursor: 'pointer' }}
                title="Launch AI Resume Builder"
              >
                AI Conversational Resume Builder
              </h2>
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
            <div
              className="showcase-visual"
              onClick={() => onNavigate('builder')}
              style={{ cursor: 'pointer' }}
              title="Click to open Builder with Live Preview"
            >
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

    </div>
  );
};

