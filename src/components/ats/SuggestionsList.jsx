import React from 'react';
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Tag,
  Check,
  RefreshCw,
  Info,
  Target
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const SuggestionsList = ({ suggestions = [], aiBreakdown = {} }) => {
  const missingKeywords = aiBreakdown.missingKeywords || [];
  const matchedKeywords = aiBreakdown.matchedKeywords || [];
  const targetKeywords = aiBreakdown.targetKeywords || [];

  return (
    <div className="ats-suggestions-container">
      <div className="suggestions-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lightbulb size={20} color="var(--accent)" />
          <h2>Actionable ATS Fixes & AI Keyword Analysis</h2>
        </div>
        <span className="badge-free">All Free & Unlocked</span>
      </div>

      {/* Target Keywords from Job Description */}
      {targetKeywords.length > 0 && (
        <div className="keywords-target-box">
          <div className="keywords-box-title">
            <Target size={16} color="var(--accent)" />
            <span>Target Role Required Keywords ({targetKeywords.length})</span>
          </div>
          <p className="keywords-box-desc">
            Key skills and competencies extracted from your Target Job Description:
          </p>
          <div className="keywords-pills-wrap">
            {targetKeywords.map((kw) => {
              const isMatched = matchedKeywords.some(
                (m) => m.toLowerCase() === kw.toLowerCase()
              );
              return (
                <span
                  key={kw}
                  className={`keyword-pill ${isMatched ? 'matched-pill' : 'target-missing-pill'}`}
                  title={isMatched ? 'Matched in resume' : 'Missing from resume'}
                >
                  {isMatched ? <Check size={12} /> : <span>•</span>} {kw}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Missing Keywords Highlight Section */}
      {missingKeywords.length > 0 && (
        <div className="keywords-highlight-box">
          <div className="keywords-box-title">
            <Tag size={16} color="var(--warning)" />
            <span>Missing Keywords from Target Role ({missingKeywords.length})</span>
          </div>
          <p className="keywords-box-desc">
            Adding these industry keywords to your skills and experience can significantly boost your ATS match score:
          </p>
          <div className="keywords-pills-wrap">
            {missingKeywords.map((kw) => (
              <span key={kw} className="keyword-pill missing-pill">
                + {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Matched Keywords Section */}
      {matchedKeywords.length > 0 && (
        <div className="keywords-matched-box">
          <div className="keywords-box-title">
            <CheckCircle2 size={16} color="var(--success)" />
            <span>Successfully Matched Keywords ({matchedKeywords.length})</span>
          </div>
          <div className="keywords-pills-wrap">
            {matchedKeywords.map((kw) => (
              <span key={kw} className="keyword-pill matched-pill">
                <Check size={12} /> {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Categorized Actionable Suggestions List */}
      <div className="suggestions-items-list">
        {suggestions.length === 0 ? (
          <div className="empty-suggestions-card">
            <CheckCircle2 size={32} color="var(--success)" />
            <h3>Outstanding! No critical fixes required.</h3>
            <p>Your resume satisfies all primary ATS guidelines and content standards.</p>
          </div>
        ) : (
          suggestions.map((item, idx) => {
            const isCritical = item.type === 'critical';
            const isWarning = item.type === 'warning';

            return (
              <div
                key={idx}
                className={`suggestion-card ${
                  isCritical ? 'suggestion-critical' : isWarning ? 'suggestion-warning' : 'suggestion-tip'
                }`}
              >
                <div className="suggestion-icon-wrap">
                  {isCritical ? (
                    <AlertCircle size={18} color="var(--danger)" />
                  ) : isWarning ? (
                    <AlertCircle size={18} color="var(--warning)" />
                  ) : (
                    <img src={logoImg} alt="AI" style={{ width: 18, height: 18, borderRadius: 'var(--radius-sm)' }} />
                  )}
                </div>
                <div className="suggestion-content">
                  <div className="suggestion-category-tag">{item.category}</div>
                  <p className="suggestion-text">{item.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
