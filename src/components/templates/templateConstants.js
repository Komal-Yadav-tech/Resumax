export const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    tagline: 'Timeless & Trusted',
    isAtsSafe: true,
    structure: 'single column, serif headers, traditional section order (Summary → Experience → Education → Skills)',
    description: 'Single-column, serif headers with standard section hierarchy. Guaranteed maximum parsing accuracy across all ATS systems.'
  },
  {
    id: 'ats-pro',
    name: 'ATS Pro',
    tagline: 'ATS-Optimized & Career-Ready',
    isAtsSafe: true,
    structure: 'single column, plain text, bold ALL-CAPS headers, keyword-dense',
    description: 'Ultra-clean single column layout, bold capitalized section titles, keyword-dense structure engineered for corporate screening software.'
  },
  {
    id: 'ats-simple',
    name: 'ATS Simple',
    tagline: 'Simple & Fresher-Friendly',
    isAtsSafe: true,
    structure: 'single column, Education & Projects above Experience, generous whitespace',
    description: 'Fresher-first layout highlighting education, academic projects, and credentials prior to experience with clean readability.'
  },
  {
    id: 'ats-compact',
    name: 'ATS Compact',
    tagline: 'Smart & Space-Efficient',
    isAtsSafe: true,
    structure: 'single column, tight spacing, fits long work history on one page',
    description: 'Condensed horizontal rows and tight vertical spacing designed to fit extensive career histories into a crisp single page.'
  },
  {
    id: 'modern',
    name: 'Modern',
    tagline: 'Polished & Impactful',
    isAtsSafe: false,
    structure: 'single column, colored header band, accented section dividers',
    description: 'High-impact gradient header band with accent-colored category pills and structured modern role callouts.'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    tagline: 'Elegant & Refined',
    isAtsSafe: false,
    structure: 'single column, no borders, max whitespace, thin sans-serif',
    description: 'Architectural minimalism featuring maximum whitespace, subtle typography, and sophisticated editorial styling.'
  },
  {
    id: 'techstack',
    name: 'TechStack',
    tagline: 'Technical & Skill-Focused',
    isAtsSafe: false,
    structure: 'single column, Skills shown as tags/pills near top, before Experience',
    description: 'Developer-oriented layout showcasing core technologies, languages, and frameworks upfront right after the header.'
  },
  {
    id: 'corporate',
    name: 'Corporate',
    tagline: 'Professional & Executive',
    isAtsSafe: false,
    structure: 'single column, dark solid header bar, large serif name',
    description: 'Distinguished executive aesthetic with deep navy header bar, prominent serif candidate identity, and authoritative dividers.'
  },
  {
    id: 'sidebar-pro',
    name: 'Sidebar Pro',
    tagline: 'Structured & Two-Column',
    isAtsSafe: false,
    structure: 'two-column: left sidebar (contact, skills, languages), right main column (summary, experience, education)',
    description: 'Contemporary two-column architecture isolating contact details and skills in a dedicated sidebar beside career experience.'
  },
  {
    id: 'timeline',
    name: 'Timeline',
    tagline: 'Visual & Chronological',
    isAtsSafe: false,
    structure: 'single column, vertical line with dots connecting Experience/Education entries',
    description: 'Visual chronological trajectory with an unbroken vertical timeline and connecting node dots for each career milestone.'
  },
  {
    id: 'academic',
    name: 'Academic',
    tagline: 'Research-Ready & Detailed',
    isAtsSafe: true,
    structure: 'single column, includes Publications & Research section, allows 2+ pages',
    description: 'Scholarly curriculum vitae format incorporating dedicated Publications, Research, and Teaching sections with multi-page flow.'
  },
  {
    id: 'creative',
    name: 'Creative',
    tagline: 'Bold & Visually Engaging',
    isAtsSafe: false,
    structure: 'mixed single/two-column, color blocks, icons for contact info',
    description: 'Dynamic portfolio-inspired design with vibrant color-blocked cards, icon badges, and standout creative hierarchy.'
  }
];

export const POPULAR_TEMPLATE_IDS = ['classic', 'modern', 'minimal', 'ats-pro'];
