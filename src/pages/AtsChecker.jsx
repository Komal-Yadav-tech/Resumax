import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  FileText,
  Briefcase,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Edit3,
  Layers,
  UploadCloud,
  FileUp,
  CheckCircle2,
  AlertCircle,
  Check,
  Trash2,
  FileCode,
  Tag,
  Target,
  ExternalLink
} from 'lucide-react';
import { ScoreCard } from '../components/ats/ScoreCard';
import { SuggestionsList } from '../components/ats/SuggestionsList';
import { evaluateResumeAtsStrength } from '../services/atsService';
import { parseUploadedResumeFile, parseResumeTextContent } from '../services/resumeParserService';
import { useFeedback } from '../context/FeedbackContext';
import { TEMPLATES } from '../components/templates/templateConstants';
import logoImg from '../assets/logo.png';

const SAMPLE_JOB_DESCRIPTION = `We are looking for a Senior Frontend Engineer proficient in React, TypeScript, Next.js, and REST APIs. The ideal candidate has experience with CI/CD pipelines, System Architecture, Agile/Scrum methodologies, automated testing, and Performance Optimization. Cross-functional leadership and strong UI/UX design collaboration are highly valued.`;

const SAMPLE_JD_PRESETS = [
  {
    label: 'Senior Frontend Engineer',
    text: `We are looking for a Senior Frontend Engineer proficient in React, TypeScript, Next.js, and REST APIs. The ideal candidate has experience with CI/CD pipelines, System Architecture, Agile/Scrum methodologies, automated testing, and Performance Optimization. Cross-functional leadership and strong UI/UX design collaboration are highly valued.`
  },
  {
    label: 'Full Stack Developer',
    text: `Seeking a Full Stack Developer experienced in Node.js, Express, React, PostgreSQL, Docker, AWS, and Microservices architecture. Must be familiar with GraphQL, CI/CD automated deployments, Unit Testing, and scalable backend design.`
  },
  {
    label: 'Data Scientist / AI Engineer',
    text: `Looking for a Data Scientist / AI Engineer skilled in Python, Machine Learning, TensorFlow, PyTorch, SQL, Cloud Computing (GCP/AWS), Data Analytics, and LLM prompt engineering with reproducible research standards.`
  }
];

export const AtsChecker = ({ onNavigate }) => {
  const { triggerFeedback } = useFeedback();
  const fileInputRef = useRef(null);

  // 1. Resumax Draft Resume
  const [resumaxData] = useState(() => {
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

  // 2. Uploaded / External Resume State
  const [uploadedResume, setUploadedResume] = useState(null);
  const [uploadedFileInfo, setUploadedFileInfo] = useState(null);
  const [activeSource, setActiveSource] = useState('resumax'); // 'resumax' | 'uploaded'
  const [uploadTab, setUploadTab] = useState('file'); // 'file' | 'paste'
  const [pastedText, setPastedText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  // 3. ATS & JD State
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    return localStorage.getItem('resumax_selected_template') || 'classic';
  });
  const [jobDescription, setJobDescription] = useState(SAMPLE_JOB_DESCRIPTION);
  const [evaluation, setEvaluation] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Currently active resume object based on user selection
  const currentResume = activeSource === 'uploaded' && uploadedResume ? uploadedResume : resumaxData;

  // Run ATS analysis
  const runAnalysis = async (resumeToUse = null, jdToUse = null, tmplToUse = null) => {
    setIsAnalyzing(true);
    try {
      const targetResume = resumeToUse || currentResume;
      const targetJd = jdToUse !== null ? jdToUse : jobDescription;
      const targetTmpl = tmplToUse || selectedTemplate;

      const result = await evaluateResumeAtsStrength(targetResume, targetJd, targetTmpl);
      setEvaluation(result);

      // Trigger feedback popup
      setTimeout(() => {
        triggerFeedback('ats');
      }, 1000);
    } catch (err) {
      console.error('ATS evaluation error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Re-run on template change
  useEffect(() => {
    runAnalysis(currentResume, jobDescription, selectedTemplate);
  }, [selectedTemplate, activeSource]);

  // Handle file drop / upload
  const handleProcessFile = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      const parsed = await parseUploadedResumeFile(file);
      setUploadedResume(parsed);
      setUploadedFileInfo({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        extension: file.name.split('.').pop().toUpperCase()
      });
      setActiveSource('uploaded');
      await runAnalysis(parsed, jobDescription, selectedTemplate);
    } catch (err) {
      console.error('File parsing error:', err);
      setUploadError('Unable to extract text from this file. Please ensure it is a valid PDF, DOCX, or TXT file.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle pasted text parse
  const handleProcessPastedText = async () => {
    if (!pastedText.trim() || pastedText.trim().length < 30) {
      setUploadError('Please paste at least a couple sentences of resume content to evaluate.');
      return;
    }
    setIsUploading(true);
    setUploadError(null);
    try {
      const sizeEstimate = `${(new Blob([pastedText]).size / 1024).toFixed(1)} KB`;
      const parsed = parseResumeTextContent(pastedText, 'Pasted_Resume.txt', sizeEstimate);
      setUploadedResume(parsed);
      setUploadedFileInfo({
        name: 'Pasted_Resume.txt',
        size: sizeEstimate,
        extension: 'TEXT'
      });
      setActiveSource('uploaded');
      await runAnalysis(parsed, jobDescription, selectedTemplate);
    } catch (err) {
      console.error('Pasted text parse error:', err);
      setUploadError('Failed to parse text. Please check your text format.');
    } finally {
      setIsUploading(false);
    }
  };

  // Import uploaded resume into Resumax Builder
  const handleImportToBuilder = () => {
    if (!currentResume) return;
    try {
      localStorage.setItem('resumax_builder_draft', JSON.stringify(currentResume));
      setImportSuccess(true);
      setTimeout(() => {
        if (onNavigate) onNavigate('builder');
      }, 600);
    } catch (e) {
      console.error('Failed to import into builder draft:', e);
    }
  };

  return (
    <div className="ats-checker-page">
      {/* Top Header Banner */}
      <div className="ats-header-banner reveal-up">
        <div className="ats-header-content">
          <div className="welcome-badge">
            <ShieldCheck size={14} /> 100% Free & Unlimited ATS Checker
          </div>
          <h1>ATS Resume Strength Checker</h1>
          <p>
            Scan any resume against modern Applicant Tracking System (ATS) parsing rules, quantify action
            verb strength, and discover missing target keywords for your dream role.
          </p>
        </div>

        <div className="ats-header-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onNavigate && onNavigate('builder')}
          >
            <Edit3 size={15} />
            <span>Open in Builder</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => runAnalysis()}
            disabled={isAnalyzing}
          >
            <RefreshCw size={15} className={isAnalyzing ? 'animate-spin' : ''} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Re-run Analysis'}</span>
          </button>
        </div>
      </div>

      {/* TASK 2: Wide Full-Width Target Job Description Box */}
      <div className="ats-full-width-card ats-job-desc-card">
        <div className="ats-card-header">
          <div className="ats-card-title-group">
            <Briefcase size={20} color="var(--accent)" />
            <div>
              <h3>Target Job Description</h3>
            </div>
            <span className="ats-step-pill">Target Role Matching</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quick Presets:</span>
            {SAMPLE_JD_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                onClick={() => {
                  setJobDescription(preset.text);
                  runAnalysis(currentResume, preset.text, selectedTemplate);
                }}
              >
                {preset.label}
              </button>
            ))}
            {jobDescription && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                onClick={() => setJobDescription('')}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <p className="ats-card-subtitle">
          Paste the job posting description below. Resumax ATS AI extracts core required industry skills,
          keywords, and competencies to benchmark your match rate:
        </p>

        <textarea
          className="form-textarea"
          rows={5}
          placeholder="Paste target job description here (responsibilities, requirements, technical skills, certifications)..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '0.9rem' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            💡 Matching against <strong>{jobDescription.split(/\s+/).filter(Boolean).length} words</strong> of role criteria.
          </span>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => runAnalysis(currentResume, jobDescription, selectedTemplate)}
            disabled={isAnalyzing}
          >
            <img src={logoImg} alt="AI" style={{ width: 14, height: 14, borderRadius: 'var(--radius-sm)' }} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Update Keyword Match Analysis'}</span>
          </button>
        </div>
      </div>

      {/* TASK 1: Placed directly UNDER Task 2 - Upload External Resume for ATS Check */}
      <div className="ats-full-width-card ats-upload-card">
        <div className="ats-card-header">
          <div className="ats-card-title-group">
            <UploadCloud size={20} color="var(--accent)" />
            <div>
              <h3>Upload External Resume for ATS Check</h3>
            </div>
            <span className="ats-step-pill" style={{ background: 'rgba(22, 163, 74, 0.12)', color: 'var(--success)' }}>
              External Resume Tester
            </span>
          </div>

          {/* Active Source Toggle */}
          <div className="ats-source-toggle-group">
            <button
              type="button"
              className={`btn btn-sm ${activeSource === 'uploaded' && uploadedResume ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                if (uploadedResume) {
                  setActiveSource('uploaded');
                  runAnalysis(uploadedResume, jobDescription, selectedTemplate);
                } else {
                  fileInputRef.current?.click();
                }
              }}
            >
              <FileUp size={14} />
              <span>{uploadedResume ? `External Resume (${uploadedFileInfo?.name})` : 'Upload External Resume'}</span>
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeSource === 'resumax' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setActiveSource('resumax');
                runAnalysis(resumaxData, jobDescription, selectedTemplate);
              }}
            >
              <FileText size={14} />
              <span>Resumax Draft ({resumaxData.fullName || 'Alex Morgan'})</span>
            </button>
          </div>
        </div>

        <p className="ats-card-subtitle">
          Bring any ready-made resume from outside (PDF, Word DOCX, or Text) to scan its ATS score, check
          formatting compliance, and get instant AI recommendations for missing & matched keywords.
        </p>

        {/* Upload Mode Tabs */}
        <div className="ats-upload-tabs">
          <button
            type="button"
            className={`ats-upload-tab-btn ${uploadTab === 'file' ? 'active' : ''}`}
            onClick={() => setUploadTab('file')}
          >
            <FileUp size={14} />
            <span>Upload File (PDF / DOCX / TXT)</span>
          </button>
          <button
            type="button"
            className={`ats-upload-tab-btn ${uploadTab === 'paste' ? 'active' : ''}`}
            onClick={() => setUploadTab('paste')}
          >
            <FileCode size={14} />
            <span>Paste Resume Text</span>
          </button>
        </div>

        {/* Tab 1: File Upload & Drag & Drop */}
        {uploadTab === 'file' && (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.docx,.doc,.txt,.text,.md"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleProcessFile(e.target.files[0]);
                }
              }}
            />

            <div
              className={`ats-upload-dropzone ${isDragging ? 'drag-active' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleProcessFile(e.dataTransfer.files[0]);
                }
              }}
            >
              <div className="dropzone-icon-box">
                {isUploading ? (
                  <RefreshCw size={26} className="animate-spin" />
                ) : (
                  <UploadCloud size={26} />
                )}
              </div>
              <div className="dropzone-title">
                {isUploading
                  ? 'Extracting Resume Text & ATS Rules...'
                  : 'Click to Browse or Drag & Drop Resume File Here'}
              </div>
              <div className="dropzone-hint">
                Supports <strong>PDF</strong>, Word (<strong>.docx</strong>), or Plain Text (<strong>.txt</strong>) up to 10MB.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Paste Raw Text */}
        {uploadTab === 'paste' && (
          <div>
            <textarea
              className="form-textarea"
              rows={6}
              placeholder="Paste your raw resume text here (Summary, Work History, Skills, Education)..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '0.88rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.65rem' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleProcessPastedText}
                disabled={isUploading || !pastedText.trim()}
              >
                {isUploading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                <span>Parse & Run ATS Evaluation</span>
              </button>
            </div>
          </div>
        )}

        {/* Upload Error Banner */}
        {uploadError && (
          <div
            style={{
              marginTop: '0.85rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--danger-light)',
              border: '1px solid var(--danger)',
              color: 'var(--danger)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <AlertCircle size={16} />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Uploaded File Confirmation & Import to Builder Bar */}
        {uploadedResume && (
          <div className="uploaded-file-banner" style={{ marginTop: '1rem' }}>
            <div className="uploaded-file-left">
              <CheckCircle2 size={24} color="var(--success)" />
              <div className="uploaded-file-info">
                <h4>
                  {uploadedFileInfo?.name || 'Uploaded Resume'}
                  <span
                    style={{
                      marginLeft: '0.6rem',
                      fontSize: '0.72rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(22, 163, 74, 0.15)',
                      color: 'var(--success)',
                      fontWeight: 700
                    }}
                  >
                    ATS Ready
                  </span>
                </h4>
                <div className="uploaded-file-meta">
                  <span>Candidate: <strong>{uploadedResume.fullName || 'Detected'}</strong></span>
                  <span>Role: <strong>{uploadedResume.targetJobTitle || 'Professional'}</strong></span>
                  <span>Skills: <strong>{uploadedResume.skills?.length || 0} extracted</strong></span>
                  <span>Size: <strong>{uploadedFileInfo?.size}</strong></span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              {activeSource !== 'uploaded' ? (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setActiveSource('uploaded');
                    runAnalysis(uploadedResume, jobDescription, selectedTemplate);
                  }}
                >
                  <Check size={14} />
                  <span>Switch to this Resume</span>
                </button>
              ) : (
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--success)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Check size={14} /> Active ATS Target
                </span>
              )}

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleImportToBuilder}
                title="Edit this external resume in Resumax 1-page templates"
              >
                <Edit3 size={14} />
                <span>{importSuccess ? 'Draft Saved! Opening...' : 'Import into Resumax Builder'}</span>
              </button>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                title="Upload another file"
              >
                <RefreshCw size={14} />
                <span>Change File</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lower Results Section: Active Resume Details & Results */}
      <div className="ats-main-grid">
        {/* Left Column: Active Resume Summary & Template Switcher */}
        <div className="ats-sidebar-col reveal-left stagger-1">
          {/* Active Resume Summary Card */}
          <div className="ats-panel-card">
            <div className="ats-panel-title">
              <FileText size={16} color="var(--accent)" />
              <h3>Currently Evaluated Resume</h3>
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <span
                className={`active-source-badge ${
                  activeSource === 'uploaded' ? 'source-badge-uploaded' : 'source-badge-draft'
                }`}
              >
                {activeSource === 'uploaded'
                  ? `External Upload: ${uploadedFileInfo?.name || 'File'}`
                  : 'Resumax In-App Builder Draft'}
              </span>
            </div>

            <div className="active-resume-summary">
              <div className="summary-row">
                <span className="summary-label">Candidate:</span>
                <strong>{currentResume.fullName || 'Alex Morgan'}</strong>
              </div>
              <div className="summary-row">
                <span className="summary-label">Target Role:</span>
                <span>{currentResume.targetJobTitle || 'Not specified'}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Experience:</span>
                <span>{currentResume.experience?.length || 0} position(s)</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Detected Skills:</span>
                <span>{currentResume.skills?.length || 0} skills listed</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Contact Email:</span>
                <span>{currentResume.contact?.email || 'N/A'}</span>
              </div>
            </div>

            {/* Template Selector for ATS test */}
            <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border)' }}>
              <label
                className="form-label"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}
              >
                <Layers size={14} color="var(--accent)" />
                <span>Test ATS Template Layout</span>
              </label>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                Different templates have different ATS parse ratings:
              </p>
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
        </div>

        {/* Right Column: ScoreCard & Suggestions */}
        <div className="ats-results-col reveal-right stagger-2">
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
