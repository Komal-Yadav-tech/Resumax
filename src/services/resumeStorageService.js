/**
 * Resume Storage Service
 * Manages multiple saved resumes, versions, duplication, renaming,
 * and seamless migration from legacy single-draft storage.
 */

import { DEFAULT_EXTRAS, BASE_SECTIONS } from '../components/templates/templateData.js';

const RESUMES_STORAGE_KEY = 'resumax_resumes_list';
const ACTIVE_RESUME_ID_KEY = 'resumax_active_resume_id';
const LEGACY_DRAFT_KEY = 'resumax_builder_draft';
const LEGACY_CUSTOMIZATIONS_KEY = 'resumax_builder_customizations';
const LEGACY_TEMPLATE_KEY = 'resumax_selected_template';

export const DEFAULT_RESUME_ANSWERS = {
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
  customSections: [], // User-added custom sections
  ...DEFAULT_EXTRAS
};

export const DEFAULT_DESIGN_CUSTOMIZATIONS = {
  fontStyle: 'Inter',
  fontSize: 'Medium', // Small, Medium, Large
  fontWeight: 'Normal', // Normal, Medium, Semi-Bold, Bold
  headingWeight: 'Bold', // Normal, Semi-Bold, Bold, Extra-Bold
  themeColor: 'blue',
  customHexColor: '',
  layout: 'default', // default, single, two-column
  spacing: 'Normal', // Compact, Normal, Spacious
  pageSize: 'a4', // a4, letter
  pageMargin: 'Normal', // Narrow (8mm), Normal (14mm), Wide (20mm)
  lineHeight: 'Normal', // Tight (1.25), Normal (1.45), Relaxed (1.65)
  headingStyle: 'standard', // standard, uppercase, underline, left-accent, highlight-badge
  dividerStyle: 'solid', // solid, dashed, dotted, gradient, double, none
  headerAlign: 'center', // left, center, right
  showIcons: true,
  iconStyle: 'subtle', // subtle, badge, minimal
  showPhoto: false,
  photoUrl: '',
  hiddenSections: {},
  sectionOrder: BASE_SECTIONS.map((s) => s.id)
};

/**
 * Ensures legacy single draft is migrated to multi-resume format seamlessly.
 */
export const initializeResumes = () => {
  if (typeof localStorage === 'undefined') return [];

  let list = [];
  try {
    const raw = localStorage.getItem(RESUMES_STORAGE_KEY);
    if (raw) {
      list = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse resumes list:', e);
  }

  // If no resumes list exists yet, check for legacy draft
  if (!list || list.length === 0) {
    let legacyAnswers = null;
    let legacyCustomizations = null;
    let legacyTemplate = 'classic';

    try {
      const savedAnswers = localStorage.getItem(LEGACY_DRAFT_KEY);
      if (savedAnswers) legacyAnswers = JSON.parse(savedAnswers);

      const savedCustomizations = localStorage.getItem(LEGACY_CUSTOMIZATIONS_KEY);
      if (savedCustomizations) legacyCustomizations = JSON.parse(savedCustomizations);

      const savedTmpl = localStorage.getItem(LEGACY_TEMPLATE_KEY);
      if (savedTmpl) legacyTemplate = savedTmpl;
    } catch (e) {
      // Ignore
    }

    const initialResume = {
      id: 'resume_default_1',
      title: legacyAnswers?.fullName ? `${legacyAnswers.fullName} — Resume` : 'My Master Resume',
      templateId: legacyTemplate || 'classic',
      answers: legacyAnswers ? { ...DEFAULT_RESUME_ANSWERS, ...legacyAnswers } : DEFAULT_RESUME_ANSWERS,
      customizations: legacyCustomizations
        ? { ...DEFAULT_DESIGN_CUSTOMIZATIONS, ...legacyCustomizations }
        : DEFAULT_DESIGN_CUSTOMIZATIONS,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };

    list = [initialResume];
    localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(list));
    localStorage.setItem(ACTIVE_RESUME_ID_KEY, initialResume.id);
  }

  return list;
};

/**
 * Gets all saved resumes
 */
export const getAllResumes = () => {
  return initializeResumes();
};

/**
 * Gets currently active resume ID
 */
export const getActiveResumeId = () => {
  if (typeof localStorage === 'undefined') return 'resume_default_1';
  let activeId = localStorage.getItem(ACTIVE_RESUME_ID_KEY);
  const resumes = getAllResumes();
  if (!activeId || !resumes.find((r) => r.id === activeId)) {
    activeId = resumes[0]?.id || 'resume_default_1';
    localStorage.setItem(ACTIVE_RESUME_ID_KEY, activeId);
  }
  return activeId;
};

/**
 * Gets active resume object
 */
export const getActiveResume = () => {
  const resumes = getAllResumes();
  const activeId = getActiveResumeId();
  return resumes.find((r) => r.id === activeId) || resumes[0];
};

/**
 * Sets active resume ID
 */
export const setActiveResumeId = (id) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(ACTIVE_RESUME_ID_KEY, id);
};

/**
 * Updates a specific resume
 */
export const updateResume = (id, updates = {}) => {
  if (typeof localStorage === 'undefined') return null;
  const list = getAllResumes();
  const index = list.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const current = list[index];
  const updated = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  list[index] = updated;
  localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(list));

  // Keep legacy keys updated for backwards compatibility with any existing components/tests
  if (id === getActiveResumeId()) {
    if (updated.answers) {
      localStorage.setItem(LEGACY_DRAFT_KEY, JSON.stringify(updated.answers));
    }
    if (updated.customizations) {
      localStorage.setItem(LEGACY_CUSTOMIZATIONS_KEY, JSON.stringify(updated.customizations));
    }
    if (updated.templateId) {
      localStorage.setItem(LEGACY_TEMPLATE_KEY, updated.templateId);
    }
  }

  return updated;
};

/**
 * Creates a new blank or template-based resume
 */
export const createNewResume = (title = 'Untitled Resume', templateId = 'classic') => {
  const list = getAllResumes();
  const newResume = {
    id: `resume_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: title || 'New Resume',
    templateId: templateId || 'classic',
    answers: { ...DEFAULT_RESUME_ANSWERS },
    customizations: { ...DEFAULT_DESIGN_CUSTOMIZATIONS },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  };

  const updatedList = [newResume, ...list];
  localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(updatedList));
  setActiveResumeId(newResume.id);
  updateResume(newResume.id, newResume);
  return newResume;
};

/**
 * Duplicates an existing resume
 */
export const duplicateResume = (id) => {
  const list = getAllResumes();
  const target = list.find((r) => r.id === id);
  if (!target) return null;

  const duplicated = {
    ...target,
    id: `resume_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: `${target.title} (Copy)`,
    version: (target.version || 1) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updatedList = [duplicated, ...list];
  localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(updatedList));
  return duplicated;
};

/**
 * Renames a resume
 */
export const renameResume = (id, newTitle) => {
  return updateResume(id, { title: newTitle.trim() || 'Untitled Resume' });
};

/**
 * Deletes a resume (must keep at least 1 resume)
 */
export const deleteResume = (id) => {
  const list = getAllResumes();
  if (list.length <= 1) {
    throw new Error('Cannot delete the only remaining resume.');
  }

  const updatedList = list.filter((r) => r.id !== id);
  localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(updatedList));

  if (getActiveResumeId() === id) {
    setActiveResumeId(updatedList[0].id);
  }

  return updatedList;
};
