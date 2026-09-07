import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  FileText,
  Briefcase,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Edit3,
  Layers
} from 'lucide-react';
import { ScoreCard } from '../components/ats/ScoreCard';
import { SuggestionsList } from '../components/ats/SuggestionsList';
import { evaluateResumeAtsStrength } from '../services/atsService';
import { useFeedback } from '../context/FeedbackContext';
import { TEMPLATES } from '../components/templates/templateConstants';
import logoImg from '../assets/logo.png';

const SAMPLE_JOB_DESCRIPTION = `We are looking for a Senior Frontend Engineer proficient in React, TypeScript, Next.js, and REST APIs. The ideal candidate has experience with CI/CD pipelines, System Architecture, Agile/Scrum methodologies, automated testing, and Performance Optimization. Cross-functional leadership and strong UI/UX design collaboration are highly valued.`;

export const AtsChecker = ({ onNavigate }) => {
  const { triggerFeedback } = useFeedback();
  const [resumeData, setResumeData] = useState(() => {
    const draft = localStorage.getItem('resumax_builder_draft');
    if (draft) {
      try {
        return JSON.parse(draft);
      } catch (e) {
        // Fallback
      }
    }
    return {
      fullName: 'Alex Morgan',
      contact: {
        email: 'alex.morgan@example.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA'
      },
      targetJobTitle: 'Senior Frontend Engineer',
      experience: [
        {
          id: 1,
          company: 'TechFlow Solutions',
          role: 'Senior Software Engineer',
          duration: '2022 – Present',
          achievements:
            'Led team of 5 engineers in rebuilding customer web portal with React and Next.js\nReduced bundle size by 40% and improved Core Web Vitals to 98/100\nImplemented reusable component design system adopted across 4 product suites'
        }
      ],
      education: [
        {
          id: 1,
          school: 'UC Berkeley',
          degree: 'B.S. in Computer Science',
          year: '2016 – 2020'
        }
      ],
      skills: ['React', 'TypeScript', 'JavaScript', 'Next.js', 'REST APIs', 'Git', 'Agile']
    };
  });

  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    return localStorage.getItem('resumax_selected_template') || 'classic';
  });

  const [jobDescription, setJobDescription] = useState(SAMPLE_JOB_DESCRIPTION);
  const [evaluation, setEvaluation] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Run ATS analysis
  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await evaluateResumeAtsStrength(
        resumeData,
        jobDescription,
        selectedTemplate
      );
      setEvaluation(result);
      // Trigger review popup after viewing ATS score
      setTimeout(() => {
        triggerFeedback('ats');
      }, 1000);
    } catch (err) {
      console.error('ATS evaluation error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [selectedTemplate]);

  return (
    <div className="ats-checker-page">
      {/* Top Navigation / Breadcrumb Header */}
      <div className="ats-header-banner">
        <div className="ats-header-content">
          <div className="welcome-badge">
            <ShieldCheck size={14} /> 100% Free & Unlimited ATS Checker
          </div>
          <h1>ATS Resume Strength Checker</h1>
          <p>
            Scan your resume against modern Applicant Tracking System (ATS) parsing rules, quantify
            action verb strength, and discover missing keywords for your target role.
          </p>
        </div>

        <div className="ats-header-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onNavigate('builder')}
          >
            <Edit3 size={15} />
            <span>Open in Builder</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={runAnalysis}
            disabled={isAnalyzing}
          >
            <RefreshCw size={15} className={isAnalyzing ? 'animate-spin' : ''} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Re-run Analysis'}</span>
          </button>
        </div>
      </div>

      <div className="ats-main-grid">
        {/* Left Column: Job Description & Controls */}
        <div className="ats-sidebar-col">
          {/* Active Resume Summary Card */}
          <div className="ats-panel-card">
            <div className="ats-panel-title">
              <FileText size={16} color="var(--accent)" />
              <h3>Active Resume Details</h3>
            </div>
            <div className="active-resume-summary">
              <div className="summary-row">
                <span className="summary-label">Name:</span>
                <strong>{resumeData.fullName || 'Alex Morgan'}</strong>
              </div>
              <div className="summary-row">
                <span className="summary-label">Target Role:</span>
                <span>{resumeData.targetJobTitle || 'Not specified'}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Experience:</span>
                <span>{resumeData.experience?.length || 0} position(s)</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Skills:</span>
                <span>{resumeData.skills?.length || 0} skills listed</span>
              </div>
            </div>

            {/* Template Selector for ATS test */}
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={14} color="var(--accent)" />
                <span>Test Template Layout</span>
              </label>
              <div className="ats-template-switcher">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    className={`btn btn-sm ${selectedTemplate === tmpl.id ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => {
                      setSelectedTemplate(tmpl.id);
                      localStorage.setItem('resumax_selected_template', tmpl.id);
                    }}
                  >
                    {tmpl.id === 'classic' ? 'Classic (ATS Safe)' : tmpl.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Job Description Input Card */}
          <div className="ats-panel-card" style={{ marginTop: '1rem' }}>
            <div className="ats-panel-title">
              <Briefcase size={16} color="var(--accent)" />
              <h3>Target Job Description</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
              Paste the job posting description below to extract key requirements and analyze keyword match:
            </p>
            <textarea
              className="form-textarea"
              rows={7}
              placeholder="Paste job description here (responsibilities, requirements, skills)..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: '0.65rem' }}
              onClick={runAnalysis}
              disabled={isAnalyzing}
            >
              <img src={logoImg} alt="AI" style={{ width: 14, height: 14, borderRadius: 'var(--radius-sm)' }} />
              <span>Update Keyword Analysis</span>
            </button>
          </div>
        </div>

        {/* Right Column: ScoreCard & Suggestions */}
        <div className="ats-results-col">
          {evaluation ? (
            <>
              <ScoreCard evaluation={evaluation} />
              <SuggestionsList
                suggestions={evaluation.suggestions}
                aiBreakdown={evaluation.aiBreakdown}
              />
            </>
          ) : (
            <div className="loading-score-card">
              <RefreshCw size={24} className="animate-spin" color="var(--accent)" />
              <p>Analyzing resume format and keywords...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
