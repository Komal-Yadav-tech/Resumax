import React, { useState } from 'react';
import { TemplatePicker } from '../templates/TemplatePicker';
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
  generatedContent,
  selectedTemplate = 'classic',
  onSelectTemplate,
  onOpenGallery
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [activeFormat, setActiveFormat] = useState('pdf');
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

      {/* Render Selected Template */}
      <div className="resume-sheet-viewport">
        {selectedTemplate === 'classic' && (
          <ClassicTemplate answers={answers} generatedContent={generatedContent} />
        )}
        {selectedTemplate === 'ats-pro' && (
          <AtsProTemplate answers={answers} generatedContent={generatedContent} />
        )}
        {selectedTemplate === 'ats-simple' && (
          <AtsSimpleTemplate answers={answers} generatedContent={generatedContent} />
        )}
        {selectedTemplate === 'ats-compact' && (
          <AtsCompactTemplate answers={answers} generatedContent={generatedContent} />
        )}
        {selectedTemplate === 'modern' && (
          <ModernTemplate answers={answers} generatedContent={generatedContent} />
        )}
        {selectedTemplate === 'minimal' && (
          <MinimalTemplate answers={answers} generatedContent={generatedContent} />
        )}
        {selectedTemplate === 'techstack' && (
          <TechStackTemplate answers={answers} generatedContent={generatedContent} />
        )}
        {selectedTemplate === 'corporate' && (
          <CorporateTemplate answers={answers} generatedContent={generatedContent} />
        )}
        {selectedTemplate === 'sidebar-pro' && (
          <SidebarProTemplate answers={answers} generatedContent={generatedContent} />
        )}
        {selectedTemplate === 'timeline' && (
          <TimelineTemplate answers={answers} generatedContent={generatedContent} />
        )}
        {selectedTemplate === 'academic' && (
          <AcademicTemplate answers={answers} generatedContent={generatedContent} />
        )}
        {selectedTemplate === 'creative' && (
          <CreativeTemplate answers={answers} generatedContent={generatedContent} />
        )}

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
        ].includes(selectedTemplate) && (
          <ClassicTemplate answers={answers} generatedContent={generatedContent} />
        )}
      </div>
    </div>
  );
};
