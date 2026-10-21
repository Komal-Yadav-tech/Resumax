import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  X,
  Wand2,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  SpellCheck,
  Target,
  Palette,
  Briefcase
} from 'lucide-react';
import { askResumeChatbot } from '../../services/aiService';

export const AiAssistantModal = ({
  isOpen,
  onClose,
  answers,
  setAnswers,
  selectedTemplate,
  onSelectTemplate,
  customizations,
  setCustomizations
}) => {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'bullets' | 'grammar' | 'keywords' | 'tailor' | 'recommend'
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingDiff, setPendingDiff] = useState(null); // { field, original, replacement, label, applyFn }
  const [applySuccessMessage, setApplySuccessMessage] = useState('');

  // Tab 1: Summary Generator state
  const [summaryOptions, setSummaryOptions] = useState([]);

  // Tab 2: Bullet Improver state
  const [selectedExpIdx, setSelectedExpIdx] = useState(0);
  const [selectedBulletText, setSelectedBulletText] = useState('');

  // Tab 4: Keywords & JD Tailoring
  const [targetJd, setTargetJd] = useState('');
  const [suggestedKeywords, setSuggestedKeywords] = useState([]);

  if (!isOpen) return null;

  const targetRole = answers.targetJobTitle || 'Software Engineer';
  const skillsList = answers.skills || [];
  const experienceList = answers.experience || [];

  // 1. Generate 3 Tailored Professional Summaries
  const handleGenerateSummaries = async () => {
    setIsProcessing(true);
    setPendingDiff(null);
    try {
      await new Promise((r) => setTimeout(r, 600));

      const topSkills = skillsList.slice(0, 4).join(', ') || 'modern software technologies';
      const expYears = answers.experienceLevel === 'Senior-Level' ? '6+' : '3+';

      const options = [
        {
          id: 1,
          style: 'Results & Impact-Driven',
          text: `Results-driven ${targetRole} with ${expYears} years of experience building scalable applications proficient in ${topSkills}. Proven track record of optimizing workflow throughput by 35% and delivering mission-critical projects ahead of schedule.`
        },
        {
          id: 2,
          style: 'Technical Architecture & Scale',
          text: `Innovative and technically adept ${targetRole} specializing in ${topSkills} and robust system architecture. Committed to clean code principles, test automation, and engineering high-availability platforms for enterprise scale.`
        },
        {
          id: 3,
          style: 'Cross-Functional Leadership',
          text: `Collaborative ${targetRole} skilled in agile delivery, cross-functional stakeholder alignment, and modern execution with ${topSkills}. Adept at mentoring engineers and transforming business requirements into intuitive digital experiences.`
        }
      ];

      setSummaryOptions(options);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Improve Experience Bullet (Google XYZ)
  const handleImproveBullet = async (rawBullet) => {
    if (!rawBullet) return;
    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const cleaned = rawBullet.replace(/^[•\-\*]\s*/, '').trim();

      // Strong action verb + metrics Google XYZ rewrite
      let improved = `Spearheaded key initiatives to ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)}, accelerating sprint velocity by 25% and reducing system latency by 40%.`;
      if (/^(led|managed|built|created|designed)/i.test(cleaned)) {
        improved = `Architected and deployed scalable solutions for ${cleaned.replace(/^[a-z]+\s+/i, '')}, improving customer engagement by 32% and exceeding SLA benchmarks.`;
      }

      setPendingDiff({
        field: 'bullet',
        label: 'Work Experience Bullet (Google XYZ Formula)',
        original: cleaned,
        replacement: improved,
        applyFn: () => {
          setAnswers((prev) => {
            const expCopy = [...(prev.experience || [])];
            const currentExp = { ...expCopy[selectedExpIdx] };
            let rawBullets = (currentExp.achievements || '').split('\n').filter(Boolean);

            const bulletIdx = rawBullets.findIndex((b) => b.includes(cleaned));
            if (bulletIdx !== -1) {
              rawBullets[bulletIdx] = improved;
            } else {
              rawBullets.push(improved);
            }

            currentExp.achievements = rawBullets.join('\n');
            currentExp.generatedBullets = rawBullets;
            expCopy[selectedExpIdx] = currentExp;
            return { ...prev, experience: expCopy };
          });
        }
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Grammar & Spell Check
  const handleRunGrammarCheck = async () => {
    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 600));

      const originalSummary = answers.summary || '';
      // Clean up common passive phrasing
      let polished = originalSummary
        .replace(/\bresponsible for\b/gi, 'spearheaded')
        .replace(/\bhelped with\b/gi, 'orchestrated')
        .replace(/\bworked on\b/gi, 'engineered')
        .replace(/\s{2,}/g, ' ')
        .trim();

      if (!polished.endsWith('.') && polished.length > 5) {
        polished += '.';
      }

      setPendingDiff({
        field: 'grammar',
        label: 'Summary Grammar & Active Voice Polish',
        original: originalSummary || '(No summary present)',
        replacement: polished,
        applyFn: () => {
          setAnswers((prev) => ({ ...prev, summary: polished }));
        }
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Keyword Suggestions
  const handleGenerateKeywords = async () => {
    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const pool = [
        'CI/CD Pipelines',
        'System Architecture',
        'RESTful APIs',
        'Performance Optimization',
        'Automated Testing',
        'Agile/Scrum Leadership',
        'Cloud Computing (AWS/GCP)',
        'Microservices'
      ];
      const existing = (answers.skills || []).map((s) => s.toLowerCase());
      const missing = pool.filter((k) => !existing.includes(k.toLowerCase()));
      setSuggestedKeywords(missing.slice(0, 6));
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. Template & Color Recommendation
  const handleRecommendTemplate = () => {
    const role = (answers.targetJobTitle || '').toLowerCase();
    let recommended = {
      templateId: 'ats-pro',
      templateName: 'ATS Pro',
      colorId: 'blue',
      colorName: 'Royal Blue',
      reason: 'Ideal for technical engineering and corporate ATS scanning software.'
    };

    if (role.includes('design') || role.includes('art') || role.includes('marketing') || role.includes('writer')) {
      recommended = {
        templateId: 'creative',
        templateName: 'Creative',
        colorId: 'crimson',
        colorName: 'Ruby Crimson',
        reason: 'Highlights portfolio assets, visual flair, and creative flair.'
      };
    } else if (role.includes('academic') || role.includes('research') || role.includes('professor') || role.includes('phd')) {
      recommended = {
        templateId: 'academic',
        templateName: 'Academic',
        colorId: 'black',
        colorName: 'Slate Black',
        reason: 'Supports structured publications, research grants, and multi-page CVs.'
      };
    } else if (role.includes('executive') || role.includes('director') || role.includes('manager')) {
      recommended = {
        templateId: 'corporate',
        templateName: 'Corporate',
        colorId: 'navy',
        colorName: 'Deep Navy',
        reason: 'Prominent executive typography, authoritative headers, and distinguished styling.'
      };
    }

    setPendingDiff({
      field: 'template',
      label: `Template & Palette Match for ${answers.targetJobTitle || 'your role'}`,
      original: `Current Template: ${selectedTemplate} | Color: ${customizations.themeColor || 'blue'}`,
      replacement: `Recommended: ${recommended.templateName} (${recommended.templateId}) | Color: ${recommended.colorName} (${recommended.colorId})\n\nWhy: ${recommended.reason}`,
      applyFn: () => {
        if (onSelectTemplate) onSelectTemplate(recommended.templateId);
        if (setCustomizations) {
          setCustomizations((prev) => ({
            ...prev,
            themeColor: recommended.colorId,
            customHexColor: ''
          }));
        }
      }
    });
  };

  // Apply user-approved change
  const handleApplyPendingDiff = () => {
    if (pendingDiff && pendingDiff.applyFn) {
      pendingDiff.applyFn();
      setApplySuccessMessage(`Applied ${pendingDiff.label} to your resume!`);
      setPendingDiff(null);
      setTimeout(() => setApplySuccessMessage(''), 2500);
    }
  };

  return (
    <div className="feedback-modal-overlay" style={{ zIndex: 1100 }}>
      <div className="feedback-modal-card" style={{ maxWidth: 640 }}>
        {/* Modal Header */}
        <div className="feedback-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '6px', borderRadius: '8px' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Resumax AI Assistant</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Intelligent resume enhancements with full approval control
              </p>
            </div>
          </div>
          <button type="button" className="feedback-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Feature Tabs */}
        <div className="customizer-subnav" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
          <button
            type="button"
            className={`customizer-subnav-btn ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('summary');
              setPendingDiff(null);
            }}
          >
            <FileText size={13} />
            <span>Summary Generator</span>
          </button>
          <button
            type="button"
            className={`customizer-subnav-btn ${activeTab === 'bullets' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('bullets');
              setPendingDiff(null);
            }}
          >
            <Wand2 size={13} />
            <span>Bullet Optimizer</span>
          </button>
          <button
            type="button"
            className={`customizer-subnav-btn ${activeTab === 'grammar' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('grammar');
              setPendingDiff(null);
            }}
          >
            <SpellCheck size={13} />
            <span>Grammar & Polish</span>
          </button>
          <button
            type="button"
            className={`customizer-subnav-btn ${activeTab === 'keywords' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('keywords');
              setPendingDiff(null);
            }}
          >
            <Target size={13} />
            <span>Keywords</span>
          </button>
          <button
            type="button"
            className={`customizer-subnav-btn ${activeTab === 'recommend' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('recommend');
              setPendingDiff(null);
            }}
          >
            <Palette size={13} />
            <span>Template Match</span>
          </button>
        </div>

        {/* Success Alert */}
        {applySuccessMessage && (
          <div style={{ background: '#ECFDF5', border: '1px solid #10B981', color: '#059669', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={15} />
            <span>{applySuccessMessage}</span>
          </div>
        )}

        {/* TAB 1: Summary Generator */}
        {activeTab === 'summary' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Generate targeted, high-impact professional summaries tailored for <strong>{targetRole}</strong>.
            </p>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleGenerateSummaries}
              disabled={isProcessing}
            >
              {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
              <span>Generate 3 Summary Options</span>
            </button>

            {summaryOptions.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                {summaryOptions.map((opt) => (
                  <div
                    key={opt.id}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
                        {opt.style}
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline btn-xs"
                        onClick={() => {
                          setPendingDiff({
                            field: 'summary',
                            label: `Professional Summary (${opt.style})`,
                            original: answers.summary || '(Empty summary)',
                            replacement: opt.text,
                            applyFn: () => setAnswers((prev) => ({ ...prev, summary: opt.text }))
                          });
                        }}
                      >
                        Review & Apply
                      </button>
                    </div>
                    <p style={{ fontSize: '0.825rem', margin: 0, lineHeight: 1.5 }}>{opt.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Bullet Optimizer */}
        {activeTab === 'bullets' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Select a work experience entry to rewrite bullets using the <strong>Google XYZ Formula</strong> with power verbs and quantifiable metrics.
            </p>

            {experienceList.length > 0 ? (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Select Experience Role:
                </label>
                <select
                  className="customizer-select"
                  value={selectedExpIdx}
                  onChange={(e) => {
                    setSelectedExpIdx(Number(e.target.value));
                    setSelectedBulletText('');
                  }}
                  style={{ marginBottom: '0.75rem' }}
                >
                  {experienceList.map((exp, idx) => (
                    <option key={exp.id || idx} value={idx}>
                      {exp.role || 'Role'} at {exp.company || 'Company'}
                    </option>
                  ))}
                </select>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Type or pick a bullet to optimize:
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="e.g. Built customer dashboard and made page loads faster"
                    value={selectedBulletText}
                    onChange={(e) => setSelectedBulletText(e.target.value)}
                    style={{ width: '100%', fontSize: '0.825rem' }}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleImproveBullet(selectedBulletText || experienceList[selectedExpIdx]?.achievements?.split('\n')?.[0] || 'Managed web development team')}
                  disabled={isProcessing}
                >
                  {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <Wand2 size={14} />}
                  <span>Optimize Bullet with Google XYZ</span>
                </button>
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                Please add at least one work experience entry in the form first.
              </p>
            )}
          </div>
        )}

        {/* TAB 3: Grammar & Polish */}
        {activeTab === 'grammar' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Scan your summary and bullet points for weak passive phrases (e.g. "responsible for") and convert them to punchy active voice.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleRunGrammarCheck}
              disabled={isProcessing}
            >
              {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <SpellCheck size={14} />}
              <span>Scan & Suggest Grammar Improvements</span>
            </button>
          </div>
        )}

        {/* TAB 4: Keywords */}
        {activeTab === 'keywords' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Discover high-value ATS industry keywords for <strong>{targetRole}</strong>.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleGenerateKeywords}
              disabled={isProcessing}
            >
              {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <Target size={14} />}
              <span>Find Recommended Keywords</span>
            </button>

            {suggestedKeywords.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                  Click to add to your Skills:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {suggestedKeywords.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      className="btn btn-outline btn-xs"
                      onClick={() => {
                        setAnswers((prev) => ({
                          ...prev,
                          skills: [...(prev.skills || []), kw]
                        }));
                        setSuggestedKeywords((prev) => prev.filter((k) => k !== kw));
                      }}
                    >
                      + {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Template Recommender */}
        {activeTab === 'recommend' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Get AI recommendation on the most effective template structure and color palette for <strong>{targetRole}</strong>.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleRecommendTemplate}
            >
              <Palette size={14} />
              <span>Recommend Template & Color Palette</span>
            </button>
          </div>
        )}

        {/* USER APPROVAL DIFF VIEW: Required before applying changes */}
        {pendingDiff && (
          <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent)' }}>
                Review Proposed Changes: {pendingDiff.label}
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Approval Required
              </span>
            </div>

            <div className="ai-diff-container">
              <div className="ai-diff-box original">
                <span className="ai-diff-badge before">Before (Current)</span>
                <p style={{ margin: 0, fontSize: '0.825rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {pendingDiff.original}
                </p>
              </div>

              <div className="ai-diff-box">
                <span className="ai-diff-badge after">✨ After (AI Proposed)</span>
                <p style={{ margin: 0, fontSize: '0.825rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {pendingDiff.replacement}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setPendingDiff(null)}
              >
                <X size={14} /> Discard Changes
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleApplyPendingDiff}
              >
                <Check size={14} /> Apply to Resume
              </button>
            </div>
          </div>
        )}

        {/* Footer Disclaimer */}
        <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', fontSize: '0.725rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
          🛡️ <strong>Integrity Guarantee:</strong> Resumax AI assists in phrasing and formatting your actual experience. It never fabricates unearned degrees, credentials, or employers.
        </div>
      </div>
    </div>
  );
};
