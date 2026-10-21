import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  Download,
  FileText,
  FileCode,
  Layers,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { exportResume } from '../../services/exportService';

export const ExportQualityModal = ({
  isOpen,
  onClose,
  answers = {},
  generatedContent = null,
  customizations = {},
  selectedTemplate = 'classic',
  overflowState = {},
  onFeedbackTrigger
}) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const contact = answers.contact || {};
  const experience = answers.experience || [];
  const education = answers.education || [];
  const skills = answers.skills || [];

  // Quality Checks
  const checks = [
    {
      id: 'contact',
      label: 'Contact Information',
      passed: Boolean(answers.fullName && contact.email && contact.phone),
      details: !contact.email
        ? 'Missing email address'
        : !contact.phone
        ? 'Missing phone number'
        : 'Name, email, and phone verified'
    },
    {
      id: 'experience',
      label: 'Work Experience Entries',
      passed: experience.length > 0,
      details: experience.length > 0 ? `${experience.length} position(s) documented` : 'No work experience listed'
    },
    {
      id: 'education',
      label: 'Education Credentials',
      passed: education.length > 0,
      details: education.length > 0 ? `${education.length} degree / institution listed` : 'No education entries listed'
    },
    {
      id: 'skills',
      label: 'Skills & Competencies',
      passed: skills.length >= 3,
      details: `${skills.length} core skill(s) included`
    },
    {
      id: 'overflow',
      label: 'Single-Page Fit',
      passed: !overflowState.isOverflowing,
      details: overflowState.isOverflowing
        ? `Content extends onto Page ${overflowState.pageCount || 2} (approx +${Math.round(overflowState.overflowPx || 0)}px)`
        : 'Guaranteed single-page layout fit'
    }
  ];

  const allPassed = checks.every((c) => c.passed);

  const handleExecuteExport = async () => {
    try {
      setIsExporting(true);
      await exportResume(selectedFormat, {
        elementId: 'resume-export-target',
        answers,
        generatedContent,
        customizations,
        onFeedbackTrigger
      });
      onClose();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Unable to complete export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="feedback-modal-overlay" style={{ zIndex: 1100 }}>
      <div className="feedback-modal-card" style={{ maxWidth: 540 }}>
        {/* Header */}
        <div className="feedback-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '6px', borderRadius: '8px' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Resume Quality Inspection</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Pre-download verification for fonts, layout, and ATS compliance
              </p>
            </div>
          </div>
          <button type="button" className="feedback-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Quality Checklist */}
        <div style={{ margin: '1.25rem 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {checks.map((chk) => (
              <div
                key={chk.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: chk.passed ? 'var(--bg-primary)' : 'rgba(239, 68, 68, 0.08)',
                  border: `1px solid ${chk.passed ? 'var(--border)' : 'rgba(239, 68, 68, 0.25)'}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {chk.passed ? (
                    <CheckCircle2 size={16} color="var(--success, #10B981)" />
                  ) : (
                    <AlertTriangle size={16} color="#EF4444" />
                  )}
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{chk.label}</span>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: chk.passed ? 'var(--text-secondary)' : '#EF4444' }}>
                      {chk.details}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: chk.passed ? 'var(--success, #10B981)' : '#EF4444'
                  }}
                >
                  {chk.passed ? 'Verified' : 'Check'}
                </span>
              </div>
            ))}
          </div>

          {overflowState.isOverflowing && (
            <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.8rem', background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#92400E' }}>
              💡 <strong>Tip for 1-Page Fit:</strong> Use Compact Spacing or Narrow Margins in the Design Studio drawer if you want your resume to fit strictly on 1 page.
            </div>
          )}
        </div>

        {/* Format Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            Choose Download Format:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              className={`btn btn-sm ${selectedFormat === 'pdf' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedFormat('pdf')}
            >
              <FileText size={14} /> PDF Document
            </button>
            <button
              type="button"
              className={`btn btn-sm ${selectedFormat === 'docx' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedFormat('docx')}
            >
              <FileCode size={14} /> Word (.docx)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${selectedFormat === 'txt' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedFormat('txt')}
            >
              <FileText size={14} /> Plain Text
            </button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
            Back to Editor
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleExecuteExport}
            disabled={isExporting}
          >
            <Download size={14} />
            <span>{isExporting ? 'Generating Document...' : `Download ${selectedFormat.toUpperCase()}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
