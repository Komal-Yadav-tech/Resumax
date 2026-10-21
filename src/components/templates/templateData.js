/**
 * Centralized Resume Data normalization and section definitions.
 * Ensures all 12 templates have access to base sections and template-specific extras.
 */

export const BASE_SECTIONS = [
  { id: 'summary', name: 'Professional Summary', icon: 'FileText' },
  { id: 'experience', name: 'Work Experience', icon: 'Briefcase' },
  { id: 'education', name: 'Education', icon: 'GraduationCap' },
  { id: 'skills', name: 'Skills & Tech', icon: 'Cpu' },
  { id: 'projects', name: 'Projects', icon: 'FolderGit2' },
  { id: 'certifications', name: 'Certifications', icon: 'Award' },
  { id: 'achievements', name: 'Achievements & Metrics', icon: 'Trophy' },
  { id: 'languages', name: 'Languages', icon: 'Languages' },
  { id: 'extras', name: 'Template Extras & Highlights', icon: 'Sparkles' }
];

export const TEMPLATE_EXTRAS_CONFIG = {
  'classic': ['extracurriculars'],
  'ats-pro': ['coreCompetencies', 'toolsAndTech', 'awards'],
  'ats-simple': ['objective', 'coursework', 'academicProjects', 'volunteering', 'hobbies'],
  'ats-compact': ['keySkills', 'publications', 'training', 'references'],
  'academic': ['research', 'publications', 'teaching', 'conferences', 'grants', 'memberships'],
  'modern': ['profileCard', 'skillPills', 'softSkills', 'interests'],
  'minimal': ['quote', 'selectedProjects', 'awards'],
  'techstack': ['techStack', 'openSource', 'hackathons', 'devCertifications'],
  'corporate': ['executiveSummary', 'keyAchievements', 'leadership', 'training', 'awards'],
  'sidebar-pro': ['skillsProgress', 'interests'],
  'timeline': ['milestones', 'volunteering', 'awards'],
  'creative': ['statHighlights', 'portfolioLinks', 'skillBadges', 'interests', 'socialLinks']
};

export const DEFAULT_EXTRAS = {
  summary:
    'Results-driven Senior Frontend Engineer with 5+ years of experience designing scalable web architectures, reusable component design systems, and high-conversion user interfaces. Proven track record in optimizing Core Web Vitals and collaborating across agile engineering teams.',
  objective:
    'Dedicated software professional seeking to leverage modern frontend technologies and full-stack architecture to build resilient, accessible, and high-impact digital applications.',
  quote:
    '"Clean architecture and intentional design create software that scales seamlessly for millions of users."',
  projects: [
    {
      id: 1,
      title: 'CloudPulse Telemetry Platform',
      role: 'Lead Architect',
      duration: '2023',
      link: 'github.com/alexmorgan/cloudpulse',
      description:
        'Engineered real-time telemetry analytics platform handling 10k events/sec using React, TypeScript, and WebSockets. Reduced dashboard load latency by 45%.'
    },
    {
      id: 2,
      title: 'DesignSystem Kit & Component Library',
      role: 'Author & Maintainer',
      duration: '2022',
      link: 'github.com/alexmorgan/designsystem',
      description:
        'Architected an accessible, WCAG-compliant design system adopted across 4 major product lines with over 50,000 developer downloads.'
    }
  ],
  certifications: [
    { id: 1, name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2023' },
    { id: 2, name: 'Meta Certified Frontend Architect', issuer: 'Meta / Coursera', year: '2022' }
  ],
  achievements: [
    {
      id: 1,
      title: 'Engineering Excellence Award',
      organization: 'TechFlow Solutions',
      year: '2023',
      metric: 'Awarded to top 2% of engineering staff for web platform overhaul'
    },
    {
      id: 2,
      title: 'Global Hackathon Grand Champion',
      organization: 'DevCon International',
      year: '2022',
      metric: '1st place out of 85 international development teams'
    }
  ],
  languages: [
    { id: 1, language: 'English', proficiency: 'Native / Bilingual' },
    { id: 2, language: 'Spanish', proficiency: 'Professional Working' }
  ],
  extracurriculars: [
    'Organizer of Bay Area React Developers Guild (800+ active members)',
    'Volunteer Coding Instructor at Girls Who Code & STEM Youth Foundation'
  ],
  coreCompetencies: [
    'Frontend Architecture',
    'Component Systems',
    'Performance Tuning',
    'State Management',
    'REST & GraphQL APIs',
    'CI/CD Workflows',
    'Web Accessibility (a11y)',
    'Cross-Functional Leadership'
  ],
  toolsAndTech: [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'Docker', 'GraphQL', 'TailwindCSS', 'Jest', 'Vite', 'Git'
  ],
  awards: [
    { id: 1, title: 'Outstanding Technical Contributor', year: '2023', issuer: 'TechFlow Solutions' },
    { id: 2, title: 'National Science Foundation Scholar', year: '2020', issuer: 'NSF' }
  ],
  coursework: [
    'Data Structures & Algorithms',
    'Distributed Systems',
    'Database Architecture',
    'Operating Systems',
    'Human-Computer Interaction'
  ],
  academicProjects: [
    {
      id: 1,
      title: 'Fault-Tolerant Distributed Key-Value Store',
      year: '2020',
      description: 'Implemented Raft consensus algorithm in Go with 99.99% replication reliability under simulated network partitions.'
    }
  ],
  volunteering: [
    {
      id: 1,
      role: 'Volunteer Web Engineer',
      organization: 'Code for Community',
      year: '2021 – Present',
      description: 'Built open portal connecting underserved families with local food assistance pantries.'
    }
  ],
  hobbies: ['Landscape Photography', 'Marathon Training', 'Open-Source Hardware', 'Chess Strategy'],
  keySkills: [
    'Full-Stack JavaScript',
    'Cloud Deployments (AWS/GCP)',
    'Core Web Vitals Optimization',
    'Micro-Frontends'
  ],
  publications: [
    {
      id: 1,
      title: 'Zero-Runtime Overhead Design Systems in Modern SSR Frameworks',
      journal: 'IEEE Software Engineering Letters',
      year: '2023'
    }
  ],
  training: [
    { id: 1, program: 'Advanced Distributed Systems Executive Seminar', provider: 'MIT Online', year: '2022' }
  ],
  references: 'Available upon request',
  research: [
    {
      id: 1,
      title: 'Heuristic Optimization of Client-Side Virtual DOM Reconciliation',
      advisor: 'Prof. E. Vance',
      institution: 'UC Berkeley',
      year: '2019 – 2020'
    }
  ],
  teaching: [
    {
      id: 1,
      role: 'Graduate Teaching Assistant - CS 61B: Data Structures',
      institution: 'UC Berkeley',
      year: '2019 – 2020',
      description: 'Conducted weekly lab sections and authored automated grading test suites for 300+ students.'
    }
  ],
  conferences: [
    { id: 1, name: 'React Summit US', role: 'Keynote Speaker: Building Resilient Micro-Frontends', year: '2023' }
  ],
  grants: [
    { id: 1, name: 'NSF Undergraduate STEM Research Grant', amount: '$12,500', year: '2019' }
  ],
  memberships: [
    'IEEE Computer Society (Professional Member)',
    'Association for Computing Machinery (ACM)'
  ],
  softSkills: [
    'Engineering Mentorship',
    'Cross-Functional Collaboration',
    'Technical Roadmap Planning',
    'Incident Post-Mortems'
  ],
  interests: ['Generative AI Systems', 'Edge Computing', 'Typography & Print Design', 'Acoustic Guitar'],
  techStack: {
    languages: ['TypeScript', 'JavaScript (ES6+)', 'Python', 'Go', 'SQL', 'HTML5/CSS3'],
    frameworks: ['React.js', 'Next.js', 'Node.js', 'Express', 'TailwindCSS', 'Redux Toolkit'],
    tools: ['Git/GitHub', 'Docker', 'Webpack/Vite', 'Postman', 'Vercel', 'AWS S3']
  },
  openSource: [
    {
      id: 1,
      repo: 'facebook/react',
      role: 'Contributor',
      contribution: 'Fixed edge-case SSR hydration mismatch warning for async island boundaries.'
    }
  ],
  hackathons: [
    {
      id: 1,
      event: 'Silicon Valley AI Hackathon',
      project: 'MedAssist AI Triage Bot',
      award: 'Winner - Best Developer Tool (1st of 90 teams)'
    }
  ],
  devCertifications: [
    'Certified Kubernetes Application Developer (CKAD)',
    'AWS Solutions Architect - Associate',
    'Meta React Professional Architect'
  ],
  leadership: [
    {
      id: 1,
      role: 'Frontend Engineering Guild Leader',
      description: 'Founded company-wide frontend standards guild uniting 35+ engineers across 4 business units.'
    }
  ],
  milestones: [
    { year: '2024', title: 'Staff Promotion', note: 'Promoted to Senior Technical Lead for client architecture.' },
    { year: '2022', title: 'Joined TechFlow Solutions', note: 'Spearheaded frontend overhaul and headless CMS migration.' },
    { year: '2020', title: 'UC Berkeley Graduation', note: 'B.S. in Computer Science with Honors (3.8 GPA).' }
  ],
  stats: [
    { label: 'Production Apps', value: '12+' },
    { label: 'Years Experience', value: '5+' },
    { label: 'Team Mentored', value: '10+' }
  ]
};

/**
 * Normalizes answers data to guarantee every section has complete, robust data
 */
export const normalizeResumeData = (answers = {}, generatedContent = null) => {
  const contact = answers.contact || {};
  const experience = Array.isArray(answers.experience) && answers.experience.length > 0
    ? answers.experience
    : [
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
      ];

  const education = Array.isArray(answers.education) && answers.education.length > 0
    ? answers.education
    : [
        {
          id: 1,
          school: 'University of California, Berkeley',
          degree: 'B.S. in Computer Science',
          year: '2016 – 2020',
          location: 'Berkeley, CA'
        }
      ];

  const skills = Array.isArray(answers.skills) && answers.skills.length > 0
    ? answers.skills
    : ['React.js', 'TypeScript', 'JavaScript (ES6+)', 'Next.js', 'HTML5 / CSS3', 'Tailwind CSS', 'REST APIs', 'Git & GitHub', 'Agile / Scrum', 'Performance Optimization'];

  const summary =
    generatedContent?.summary ||
    answers.summary ||
    DEFAULT_EXTRAS.summary;

  return {
    fullName: answers.fullName || 'Alex Morgan',
    targetJobTitle: answers.targetJobTitle || 'Senior Frontend Engineer',
    contact: {
      email: contact.email || 'alex.morgan@example.com',
      phone: contact.phone || '+1 (555) 234-5678',
      location: contact.location || 'San Francisco, CA',
      website: contact.website || 'linkedin.com/in/alexmorgan',
      github: contact.github || 'github.com/alexmorgan',
      portfolio: contact.portfolio || 'alexmorgan.dev'
    },
    photo: answers.photo || '',
    summary,
    objective: answers.objective || DEFAULT_EXTRAS.objective,
    quote: answers.quote || DEFAULT_EXTRAS.quote,
    experience,
    education,
    skills,
    projects: answers.projects && answers.projects.length > 0 ? answers.projects : DEFAULT_EXTRAS.projects,
    certifications: answers.certifications && answers.certifications.length > 0 ? answers.certifications : DEFAULT_EXTRAS.certifications,
    achievements: answers.achievements && answers.achievements.length > 0 ? answers.achievements : DEFAULT_EXTRAS.achievements,
    languages: answers.languages && answers.languages.length > 0 ? answers.languages : DEFAULT_EXTRAS.languages,

    // Template specific extras
    extracurriculars: answers.extracurriculars || DEFAULT_EXTRAS.extracurriculars,
    coreCompetencies: answers.coreCompetencies || DEFAULT_EXTRAS.coreCompetencies,
    toolsAndTech: answers.toolsAndTech || DEFAULT_EXTRAS.toolsAndTech,
    awards: answers.awards || DEFAULT_EXTRAS.awards,
    coursework: answers.coursework || DEFAULT_EXTRAS.coursework,
    academicProjects: answers.academicProjects || DEFAULT_EXTRAS.academicProjects,
    volunteering: answers.volunteering || DEFAULT_EXTRAS.volunteering,
    hobbies: answers.hobbies || DEFAULT_EXTRAS.hobbies,
    keySkills: answers.keySkills || DEFAULT_EXTRAS.keySkills,
    publications: answers.publications || DEFAULT_EXTRAS.publications,
    training: answers.training || DEFAULT_EXTRAS.training,
    references: answers.references || DEFAULT_EXTRAS.references,
    research: answers.research || DEFAULT_EXTRAS.research,
    teaching: answers.teaching || DEFAULT_EXTRAS.teaching,
    conferences: answers.conferences || DEFAULT_EXTRAS.conferences,
    grants: answers.grants || DEFAULT_EXTRAS.grants,
    memberships: answers.memberships || DEFAULT_EXTRAS.memberships,
    softSkills: answers.softSkills || DEFAULT_EXTRAS.softSkills,
    interests: answers.interests || DEFAULT_EXTRAS.interests,
    techStack: answers.techStack || DEFAULT_EXTRAS.techStack,
    openSource: answers.openSource || DEFAULT_EXTRAS.openSource,
    hackathons: answers.hackathons || DEFAULT_EXTRAS.hackathons,
    devCertifications: answers.devCertifications || DEFAULT_EXTRAS.devCertifications,
    leadership: answers.leadership || DEFAULT_EXTRAS.leadership,
    milestones: answers.milestones || DEFAULT_EXTRAS.milestones,
    stats: answers.stats || DEFAULT_EXTRAS.stats,
    customSections: answers.customSections || []
  };
};

/**
 * Checks if a section is allowed to render based on customization options
 */
export const isSectionVisible = (sectionKey, customizations = {}) => {
  if (!customizations || !customizations.hiddenSections) return true;
  return !customizations.hiddenSections[sectionKey];
};
