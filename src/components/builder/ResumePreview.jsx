import React, { useState } from 'react';
import { TemplatePicker } from '../templates/TemplatePicker';
import { ResumeCustomizerToolbar } from './ResumeCustomizerToolbar';
import { ExportQualityModal } from './ExportQualityModal';
import {
  ClassicTemplate,
  ModernTemplate,
  MinimalTemplate,
  AtsProTemplate,
  AtsSimpleTemplate,
  AtsCompactTemplate,
  TechStackTemplate,
  CorporateTemplate,
  SidebarProTemplate,
  TimelineTemplate,
  AcademicTemplate,
  CreativeTemplate
} from '../templates';
import { exportResume } from '../../services/exportService';
import { useFeedback } from '../../context/FeedbackContext';
import { AlertTriangle, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

export const ResumePreview = ({
  answers,
  setAnswers,
  generatedContent,
  selectedTemplate = 'classic',
  onSelectTemplate,
  onOpenGallery,
  customizations,
  setCustomizations
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [activeFormat, setActiveFormat] = useState('pdf');
  const [isQualityModalOpen, setIsQualityModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 480) return 0.45;
      if (window.innerWidth <= 768) return 0.60;
      if (window.innerWidth <= 1024) return 0.72;
    }
    return 0.85;
  });
  const [overflowState, setOverflowState] = useState({
    isOverflowing: false,
    overflowPx: 0,
    pageCount: 1,
    pageHeightPx: 1122.5
  });

  const { triggerFeedback } = useFeedback();

  const handleExport = (format) => {
    setActiveFormat(format);
    setIsQualityModalOpen(true);
  };

  const handleApplyOverflowFix = (fixType) => {
    if (!setCustomizations) return;
    if (fixType === 'spacing') {
      setCustomizations((prev) => ({ ...prev, spacing: 'Compact' }));
    } else if (fixType === 'margin') {
      setCustomizations((prev) => ({ ...prev, pageMargin: 'Narrow' }));
    } else if (fixType === 'font') {
      setCustomizations((prev) => ({ ...prev, fontSize: 'Small' }));
    }
  };

  const templateProps = {
    answers,
    generatedContent,
    customizations: {
      ...(customizations || {}),
      onOverflowStatusChange: setOverflowState
    }
  };

  return (
    <div className="resume-preview-wrapper">
      {/* Template Picker & Download Action Bar */}
      <TemplatePicker
        selectedTemplate={selectedTemplate}
        onSelectTemplate={onSelectTemplate}
        onExport={handleExport}
        isExporting={isExporting}
        activeFormat={activeFormat}
        onOpenGallery={onOpenGallery}
      />

      {/* Resume Customization Options Toolbar (Design Studio) */}
      <ResumeCustomizerToolbar
        customizations={customizations}
        setCustomizations={setCustomizations}
        answers={answers}
        setAnswers={setAnswers}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
      />

      {/* SMART PAGE MANAGEMENT: Overflow Resolution Banner */}
      {overflowState.isOverflowing && (
        <div className="overflow-alert-banner">
          <div className="overflow-info-group">
            <div className="overflow-icon-badge">
              <AlertTriangle size={13} />
            </div>
            <div>
              <strong>Page Overflow Detected (+{Math.round(overflowState.overflowPx)}px)</strong>
              <span style={{ marginLeft: '0.4rem', opacity: 0.9 }}>
                Spilling onto Page {overflowState.pageCount || 2}. Quick 1-click fixes:
              </span>
            </div>
          </div>

          <div className="overflow-actions-group">
            <button
              type="button"
              className="overflow-action-btn"
              onClick={() => handleApplyOverflowFix('spacing')}
              title="Change section spacing to Compact"
            >
              Compact Spacing
            </button>
            <button
              type="button"
              className="overflow-action-btn"
              onClick={() => handleApplyOverflowFix('margin')}
              title="Reduce page margins to Narrow (8mm)"
            >
              Narrow Margins
            </button>
            <button
              type="button"
              className="overflow-action-btn"
              onClick={() => handleApplyOverflowFix('font')}
              title="Reduce font scale slightly"
            >
              Small Font
            </button>
          </div>
        </div>
      )}

      {/* Render Selected Template within Scaled Viewport */}
      <div className="resume-sheet-viewport">
        <div
          className="resume-sheet-zoom-container"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease'
          }}
        >
          {selectedTemplate === 'classic' && <ClassicTemplate {...templateProps} />}
          {selectedTemplate === 'ats-pro' && <AtsProTemplate {...templateProps} />}
          {selectedTemplate === 'ats-simple' && <AtsSimpleTemplate {...templateProps} />}
          {selectedTemplate === 'ats-compact' && <AtsCompactTemplate {...templateProps} />}
          {selectedTemplate === 'modern' && <ModernTemplate {...templateProps} />}
          {selectedTemplate === 'minimal' && <MinimalTemplate {...templateProps} />}
          {selectedTemplate === 'techstack' && <TechStackTemplate {...templateProps} />}
          {selectedTemplate === 'corporate' && <CorporateTemplate {...templateProps} />}
          {selectedTemplate === 'sidebar-pro' && <SidebarProTemplate {...templateProps} />}
          {selectedTemplate === 'timeline' && <TimelineTemplate {...templateProps} />}
          {selectedTemplate === 'academic' && <AcademicTemplate {...templateProps} />}
          {selectedTemplate === 'creative' && <CreativeTemplate {...templateProps} />}

          {/* Fallback to Classic if template id is unrecognized */}
          {![
            'classic',
            'ats-pro',
            'ats-simple',
            'ats-compact',
            'modern',
            'minimal',
            'techstack',
            'corporate',
            'sidebar-pro',
            'timeline',
            'academic',
            'creative'
          ].includes(selectedTemplate) && <ClassicTemplate {...templateProps} />}
        </div>
      </div>

      {/* Phase 7 Pre-Export Quality Inspection Modal */}
      <ExportQualityModal
        isOpen={isQualityModalOpen}
        onClose={() => setIsQualityModalOpen(false)}
        answers={answers}
        generatedContent={generatedContent}
        customizations={customizations}
        selectedTemplate={selectedTemplate}
        overflowState={overflowState}
        onFeedbackTrigger={triggerFeedback}
      />
    </div>
  );
};
