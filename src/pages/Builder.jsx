import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Eye,
  Edit3,
  Sparkles,
  Check,
  ShieldCheck,
  Plus,
  Copy,
  FolderOpen
} from 'lucide-react';
import { StepIndicator } from '../components/builder/StepIndicator';
import { QAStepForm } from '../components/builder/QAStepForm';
import { ResumePreview } from '../components/builder/ResumePreview';
import { AiAssistantModal } from '../components/builder/AiAssistantModal';
import { generateResumeContent } from '../services/aiService';

import { DEFAULT_EXTRAS, BASE_SECTIONS } from '../components/templates/templateData';
import { TemplateGalleryModal } from '../components/templates/TemplateGalleryModal';
import {
  getAllResumes,
  getActiveResume,
  getActiveResumeId,
  setActiveResumeId,
  updateResume,
  createNewResume,
  duplicateResume,
  renameResume,
  DEFAULT_RESUME_ANSWERS,
  DEFAULT_DESIGN_CUSTOMIZATIONS
} from '../services/resumeStorageService';

export const Builder = ({
  onNavigate,
  isTemplateGalleryOpen: propIsGalleryOpen,
  setIsTemplateGalleryOpen: propSetIsGalleryOpen
}) => {
  const [internalIsGalleryOpen, setInternalIsGalleryOpen] = useState(false);
  const isTemplateGalleryOpen = propIsGalleryOpen !== undefined ? propIsGalleryOpen : internalIsGalleryOpen;
  const setIsTemplateGalleryOpen = propSetIsGalleryOpen || setInternalIsGalleryOpen;

  // Multi-Resume Management State
  const [resumesList, setResumesList] = useState(() => getAllResumes());
  const [activeResumeIdState, setActiveResumeIdState] = useState(() => getActiveResumeId());

  // Active Resume Object
  const currentResume = resumesList.find((r) => r.id === activeResumeIdState) || resumesList[0] || {
    id: 'resume_default_1',
    title: 'My Master Resume',
    templateId: 'classic',
    answers: DEFAULT_RESUME_ANSWERS,
    customizations: DEFAULT_DESIGN_CUSTOMIZATIONS
  };

  const [answers, setAnswers] = useState(() => currentResume.answers || DEFAULT_RESUME_ANSWERS);
  const [customizations, setCustomizations] = useState(() => currentResume.customizations || DEFAULT_DESIGN_CUSTOMIZATIONS);
  const [selectedTemplate, setSelectedTemplate] = useState(() => currentResume.templateId || 'classic');

  const [currentStep, setCurrentStep] = useState(1);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('form'); // 'form' | 'preview'
  const [saveStatus, setSaveStatus] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // When active resume changes, reload its answers, customizations, and template
  const handleSwitchResume = (newResumeId) => {
    setActiveResumeId(newResumeId);
    setActiveResumeIdState(newResumeId);
    const target = resumesList.find((r) => r.id === newResumeId);
    if (target) {
      setAnswers(target.answers || DEFAULT_RESUME_ANSWERS);
      setCustomizations(target.customizations || DEFAULT_DESIGN_CUSTOMIZATIONS);
      setSelectedTemplate(target.templateId || 'classic');
    }
  };

  // Create new resume
  const handleCreateNewResume = () => {
    const title = window.prompt('Enter a title for your new resume:', 'New Resume');
    if (title !== null) {
      const created = createNewResume(title || 'New Resume', selectedTemplate);
      const updatedList = getAllResumes();
      setResumesList(updatedList);
      handleSwitchResume(created.id);
    }
  };

  // Duplicate active resume
  const handleDuplicateActiveResume = () => {
    const duplicated = duplicateResume(activeResumeIdState);
    if (duplicated) {
      const updatedList = getAllResumes();
      setResumesList(updatedList);
      handleSwitchResume(duplicated.id);
      setSaveStatus('Duplicated!');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  // Rename active resume
  const handleRenameActiveResume = () => {
    const newTitle = window.prompt('Rename this resume:', currentResume.title);
    if (newTitle && newTitle.trim()) {
      renameResume(activeResumeIdState, newTitle.trim());
      setResumesList(getAllResumes());
      setSaveStatus('Renamed!');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  // Auto-sync answers & customizations with resumeStorageService & legacy localStorage keys
  useEffect(() => {
    updateResume(activeResumeIdState, {
      answers,
      customizations,
      templateId: selectedTemplate
    });
    // Legacy support for tests and other components
    localStorage.setItem('resumax_builder_draft', JSON.stringify(answers));
    localStorage.setItem('resumax_builder_customizations', JSON.stringify(customizations));
    localStorage.setItem('resumax_selected_template', selectedTemplate);
  }, [answers, customizations, selectedTemplate, activeResumeIdState]);

  const handleSelectTemplate = (tmplId) => {
    setSelectedTemplate(tmplId);
    updateResume(activeResumeIdState, { templateId: tmplId });
    localStorage.setItem('resumax_selected_template', tmplId);
  };

  const handleGenerateResume = async () => {
    try {
      setIsGenerating(true);
      const result = await generateResumeContent(answers);
      setGeneratedContent(result);
      setIsGenerated(true);
      // Update answers with enhanced experience
      if (result.experience) {
        setAnswers((prev) => ({
          ...prev,
          experience: result.experience
        }));
      }
    } catch (error) {
      console.error('AI Generation failed:', error);
      alert('Failed to generate resume content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualSave = () => {
    updateResume(activeResumeIdState, {
      answers,
      customizations,
      templateId: selectedTemplate
    });
    localStorage.setItem('resumax_builder_draft', JSON.stringify(answers));
    localStorage.setItem('resumax_selected_template', selectedTemplate);
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  // Distinct full-screen Template Selection view
  if (isTemplateGalleryOpen) {
    return (
      <TemplateGalleryModal
        isOpen={true}
        isFullScreenPage={true}
        onClose={() => setIsTemplateGalleryOpen(false)}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={(tmplId) => {
          handleSelectTemplate(tmplId);
          setIsTemplateGalleryOpen(false);
        }}
      />
    );
  }

  return (
    <div className="builder-page-container">
      {/* Builder Top Bar */}
      <div className="builder-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="btn btn-outline btn-sm"
          >
            <ArrowLeft size={16} /> Dashboard
          </button>

          {/* Resume Switcher Dropdown */}
          <div className="resume-switcher-wrapper">
            <select
              className="resume-switcher-select"
              value={activeResumeIdState}
              onChange={(e) => handleSwitchResume(e.target.value)}
              title="Switch active resume"
            >
              {resumesList.map((r) => (
                <option key={r.id} value={r.id}>
                  📄 {r.title} (v{r.version || 1})
                </option>
              ))}
            </select>
          </div>

          {/* Resume Management Quick Actions */}
          <button
            type="button"
            className="btn btn-outline btn-xs"
            onClick={handleCreateNewResume}
            title="Create a new resume"
          >
            <Plus size={13} />
            <span>New</span>
          </button>

          <button
            type="button"
            className="btn btn-outline btn-xs"
            onClick={handleDuplicateActiveResume}
            title="Duplicate current resume"
          >
            <Copy size={13} />
            <span>Duplicate</span>
          </button>

          <button
            type="button"
            className="btn btn-outline btn-xs"
            onClick={handleRenameActiveResume}
            title="Rename current resume"
          >
            <Edit3 size={13} />
            <span>Rename</span>
          </button>
        </div>

        <div className="builder-topbar-actions">
          {/* Mobile Tab Switcher */}
          <div className="mobile-view-toggle">
            <button
              type="button"
              className={`btn btn-sm ${activeMobileTab === 'form' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveMobileTab('form')}
            >
              <Edit3 size={14} /> Form
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeMobileTab === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveMobileTab('preview')}
            >
              <Eye size={14} /> Preview
            </button>
          </div>

          {/* Phase 6 AI Assistant Trigger */}
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="btn btn-secondary-violet btn-sm btn-ai-sparkle"
            title="Launch AI Resume Assistant"
          >
            <Sparkles size={14} />
            <span>AI Assistant</span>
          </button>

          <button
            type="button"
            onClick={handleManualSave}
            className="btn btn-secondary btn-sm"
            title="Save Draft"
          >
            {saveStatus ? <Check size={14} color="var(--success)" /> : <Save size={14} />}
            <span>{saveStatus || 'Save Draft'}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('ats')}
            className="btn btn-primary btn-sm"
            title="Evaluate ATS strength"
          >
            <ShieldCheck size={14} />
            <span>Check ATS Score</span>
          </button>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <StepIndicator currentStep={currentStep} onSelectStep={setCurrentStep} />

      {/* Main Split Layout */}
      <div className="builder-grid-layout">
        {/* Left Column: Conversational Step Form */}
        <div className={`builder-column form-col ${activeMobileTab === 'preview' ? 'mobile-hidden' : ''}`}>
          <QAStepForm
            answers={answers}
            setAnswers={setAnswers}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            onGenerateResume={handleGenerateResume}
            isGenerating={isGenerating}
            isGenerated={isGenerated}
          />
        </div>

        {/* Right Column: Live Resume Preview */}
        <div className={`builder-column preview-col ${activeMobileTab === 'form' ? 'mobile-hidden' : ''}`}>
          <ResumePreview
            answers={answers}
            setAnswers={setAnswers}
            generatedContent={generatedContent}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleSelectTemplate}
            onOpenGallery={() => setIsTemplateGalleryOpen(true)}
            customizations={customizations}
            setCustomizations={setCustomizations}
          />
        </div>
      </div>

      {/* Phase 6 AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        answers={answers}
        setAnswers={setAnswers}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={handleSelectTemplate}
        customizations={customizations}
        setCustomizations={setCustomizations}
      />
    </div>
  );
};
