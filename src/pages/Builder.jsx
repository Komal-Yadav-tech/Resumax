import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Edit3, Sparkles, Check, ShieldCheck } from 'lucide-react';
import { StepIndicator } from '../components/builder/StepIndicator';
import { QAStepForm } from '../components/builder/QAStepForm';
import { ResumePreview } from '../components/builder/ResumePreview';
import { generateResumeContent } from '../services/aiService';

import { DEFAULT_EXTRAS, BASE_SECTIONS } from '../components/templates/templateData';
import { TemplateGalleryModal } from '../components/templates/TemplateGalleryModal';

const DEFAULT_ANSWERS = {
  fullName: 'Alex Morgan',
  contact: {
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    website: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
    portfolio: 'alexmorgan.dev'
  },
  photo: '',
  targetJobTitle: 'Senior Frontend Engineer',
  experienceLevel: 'Senior-Level',
  summary: DEFAULT_EXTRAS.summary,
  experience: [
    {
      id: 1,
      company: 'TechFlow Solutions',
      role: 'Senior Software Engineer',
      duration: '2022 – Present',
      location: 'San Francisco, CA',
      achievements:
        'Led team of 5 engineers in rebuilding customer web portal with React and Next.js\nReduced bundle size by 40% and improved Core Web Vitals to 98/100\nImplemented reusable component design system adopted across 4 product suites'
    },
    {
      id: 2,
      company: 'Apex Digital Systems',
      role: 'Frontend Developer',
      duration: '2020 – 2022',
      location: 'Austin, TX',
      achievements:
        'Developed interactive dashboards and analytics charts using React and TypeScript\nCollaborated with UI/UX team to implement responsive design patterns'
    }
  ],
  education: [
    {
      id: 1,
      school: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science',
      year: '2016 – 2020',
      location: 'Berkeley, CA'
    }
  ],
  skills: [
    'React.js',
    'TypeScript',
    'JavaScript (ES6+)',
    'Next.js',
    'HTML5 / CSS3',
    'Tailwind CSS',
    'REST APIs',
    'Git & GitHub',
    'Agile / Scrum',
    'Performance Optimization'
  ],
  projects: DEFAULT_EXTRAS.projects,
  certifications: DEFAULT_EXTRAS.certifications,
  achievements: DEFAULT_EXTRAS.achievements,
  languages: DEFAULT_EXTRAS.languages,
  ...DEFAULT_EXTRAS
};

export const Builder = ({
  onNavigate,
  isTemplateGalleryOpen: propIsGalleryOpen,
  setIsTemplateGalleryOpen: propSetIsGalleryOpen
}) => {
  const [internalIsGalleryOpen, setInternalIsGalleryOpen] = useState(false);
  const isTemplateGalleryOpen = propIsGalleryOpen !== undefined ? propIsGalleryOpen : internalIsGalleryOpen;
  const setIsTemplateGalleryOpen = propSetIsGalleryOpen || setInternalIsGalleryOpen;

  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem('resumax_builder_draft');
    if (!saved) return DEFAULT_ANSWERS;
    try {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_ANSWERS, ...parsed };
    } catch {
      return DEFAULT_ANSWERS;
    }
  });

  const [customizations, setCustomizations] = useState(() => {
    const saved = localStorage.getItem('resumax_builder_customizations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      fontStyle: 'Inter',
      fontSize: 'Medium',
      themeColor: 'blue',
      layout: 'default',
      spacing: 'Normal',
      showPhoto: false,
      photoUrl: '',
      hiddenSections: {},
      sectionOrder: BASE_SECTIONS.map((s) => s.id)
    };
  });

  // Auto-save customizations
  useEffect(() => {
    localStorage.setItem('resumax_builder_customizations', JSON.stringify(customizations));
  }, [customizations]);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    return localStorage.getItem('resumax_selected_template') || 'classic';
  });
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('form'); // 'form' | 'preview'
  const [saveStatus, setSaveStatus] = useState('');

  // Auto-save draft and selected template to localStorage
  useEffect(() => {
    localStorage.setItem('resumax_builder_draft', JSON.stringify(answers));
  }, [answers]);

  const handleSelectTemplate = (tmplId) => {
    setSelectedTemplate(tmplId);
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
    localStorage.setItem('resumax_builder_draft', JSON.stringify(answers));
    localStorage.setItem('resumax_selected_template', selectedTemplate);
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  // Distinct full-screen Template Selection view: removes StepIndicator, builder-topbar, and navbar
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
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="btn btn-outline btn-sm"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

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

      {/* Stepper Progress Bar (only rendered on builder form flow) */}
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
    </div>
  );
};

