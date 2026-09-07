import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck,
  Zap,
  TrendingUp,
  Target
} from 'lucide-react';

export const ScoreCard = ({ evaluation }) => {
  if (!evaluation) return null;

  const {
    overallScore = 0,
    formattingScore = 0,
    contentScore = 0,
    formatBreakdown = {},
    aiBreakdown = {}
  } = evaluation;

  // Determine score tier color and badge
  const getScoreTier = (score) => {
    if (score >= 80) {
      return {
        label: 'ATS Optimized',
        colorClass: 'score-tier-high',
        textColor: 'var(--success)',
        bgColor: 'var(--success-light)',
        icon: ShieldCheck,
        description: 'Your resume has high ATS parseability and strong content metrics.'
      };
    }
    if (score >= 60) {
      return {
        label: 'Good Foundation',
        colorClass: 'score-tier-medium',
        textColor: 'var(--warning)',
        bgColor: 'var(--warning-light)',
        icon: AlertTriangle,
        description: 'Solid base, but needs keyword tailoring and measurable metrics.'
      };
    }
    return {
      label: 'Needs Improvement',
      colorClass: 'score-tier-low',
      textColor: 'var(--danger)',
      bgColor: 'var(--danger-light)',
      icon: XCircle,
      description: 'Critical format or content gaps detected. Apply suggestions below.'
    };
  };

  const tier = getScoreTier(overallScore);
  const TierIcon = tier.icon;

  return (
    <div className="ats-scorecard-container">
      {/* Primary Score Hero */}
      <div className="scorecard-hero">
        <div className="score-meter-circle" style={{ borderColor: tier.textColor }}>
          <span className="score-number" style={{ color: tier.textColor }}>
            {overallScore}
          </span>
          <span className="score-out-of">/ 100</span>
        </div>

        <div className="score-hero-details">
          <div className="score-tier-badge" style={{ backgroundColor: tier.bgColor, color: tier.textColor }}>
            <TierIcon size={16} />
            <span>{tier.label}</span>
          </div>
          <h2 className="score-hero-title">Overall ATS Strength Score</h2>
          <p className="score-hero-desc">{tier.description}</p>
        </div>
      </div>

      {/* Metric Breakdown Grid */}
      <div className="scorecard-breakdown-grid">
        {/* Metric 1: Format Score */}
        <div className="breakdown-card">
          <div className="breakdown-card-header">
            <div className="breakdown-icon-box" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <FileCheck size={18} />
            </div>
            <div>
              <span className="breakdown-title">Formatting & Layout</span>
              <div className="breakdown-score-val">{formattingScore}%</div>
            </div>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{
                width: `${formattingScore}%`,
                backgroundColor: formattingScore >= 80 ? 'var(--success)' : formattingScore >= 60 ? 'var(--warning)' : 'var(--danger)'
              }}
            />
          </div>
          <div className="breakdown-micro-list">
            <span>Headers: {formatBreakdown.sectionHeaders || 0}/35</span>
            <span>Contact: {formatBreakdown.contactCompleteness || 0}/30</span>
            <span>Template: {formatBreakdown.templateSafety || 0}/20</span>
          </div>
        </div>

        {/* Metric 2: Power Action Verbs */}
        <div className="breakdown-card">
          <div className="breakdown-card-header">
            <div className="breakdown-icon-box" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
              <Zap size={18} />
            </div>
            <div>
              <span className="breakdown-title">Action Verb Power</span>
              <div className="breakdown-score-val">{aiBreakdown.actionVerbsScore || 0}%</div>
            </div>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{
                width: `${aiBreakdown.actionVerbsScore || 0}%`,
                backgroundColor: aiBreakdown.actionVerbsScore >= 80 ? 'var(--success)' : 'var(--warning)'
              }}
            />
          </div>
          <div className="breakdown-micro-list">
            <span>Rating: <strong>{aiBreakdown.bulletStrength || 'Moderate'}</strong></span>
            <span>Active phrasing ratio</span>
          </div>
        </div>

        {/* Metric 3: Quantifiable Impact */}
        <div className="breakdown-card">
          <div className="breakdown-card-header">
            <div className="breakdown-icon-box" style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#7C3AED' }}>
              <TrendingUp size={18} />
            </div>
            <div>
              <span className="breakdown-title">Measurable Metrics</span>
              <div className="breakdown-score-val">{aiBreakdown.quantifiableMetricsScore || 0}%</div>
            </div>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{
                width: `${aiBreakdown.quantifiableMetricsScore || 0}%`,
                backgroundColor: aiBreakdown.quantifiableMetricsScore >= 80 ? 'var(--success)' : 'var(--warning)'
              }}
            />
          </div>
          <div className="breakdown-micro-list">
            <span>%, $, numeric outcomes</span>
            <span>Outcome-driven bullets</span>
          </div>
        </div>

        {/* Metric 4: Keyword Gap Match */}
        <div className="breakdown-card">
          <div className="breakdown-card-header">
            <div className="breakdown-icon-box" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
              <Target size={18} />
            </div>
            <div>
              <span className="breakdown-title">Target Keyword Match</span>
              <div className="breakdown-score-val">{aiBreakdown.keywordMatchScore || 0}%</div>
            </div>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{
                width: `${aiBreakdown.keywordMatchScore || 0}%`,
                backgroundColor: aiBreakdown.keywordMatchScore >= 80 ? 'var(--success)' : 'var(--warning)'
              }}
            />
          </div>
          <div className="breakdown-micro-list">
            <span>Matched: {aiBreakdown.matchedKeywords?.length || 0}</span>
            <span>Missing: {aiBreakdown.missingKeywords?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
