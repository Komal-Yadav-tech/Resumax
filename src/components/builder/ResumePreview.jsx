import React, { useState } from 'react';
import { TemplatePicker } from '../templates/TemplatePicker';
import { ResumeCustomizerToolbar } from './ResumeCustomizerToolbar';
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
  const [zoomLevel, setZoomLevel] = useState(0.85); // Default fit zoom for A4 in split view
  const { triggerFeedback } = useFeedback();

  const handleExport = async (format) => {
    try {
      setIsExporting(true);
      setActiveFormat(format);
      await exportResume(format, {
        elementId: 'resume-export-target',
        answers,
        generatedContent,
        onFeedbackTrigger: triggerFeedback
      });
    } catch (error) {
      console.error(`Failed to export ${format.toUpperCase()}:`, error);
      alert(`Unable to generate ${format.toUpperCase()} export. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  const templateProps = {
    answers,
    generatedContent,
    customizations: customizations || {}
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

      {/* Resume Customization Options Toolbar (Font Style, Font Size, Theme Color, Layout, Spacing, Photo, Skip Sections) */}
      <ResumeCustomizerToolbar
        customizations={customizations}
        setCustomizations={setCustomizations}
        answers={answers}
        setAnswers={setAnswers}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
      />

      {/* Render Selected Template within Scaled A4 Viewport */}
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
    </div>
  );
};
