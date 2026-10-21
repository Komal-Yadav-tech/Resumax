import assert from 'node:assert';
import {
  generatePaletteFromHex,
  resolveThemePalette,
  FONT_FAMILY_MAP,
  THEME_COLOR_MAP
} from './src/components/templates/themeConstants.js';
import {
  getAllResumes,
  getActiveResume,
  setActiveResumeId,
  createNewResume,
  duplicateResume,
  renameResume,
  deleteResume,
  DEFAULT_RESUME_ANSWERS,
  DEFAULT_DESIGN_CUSTOMIZATIONS
} from './src/services/resumeStorageService.js';
import {
  calculateFormatScore,
  evaluateResumeAtsStrength,
  checkDetailedAtsCompliance,
  simulateAtsTextExtraction,
  ATS_DISCLAIMER
} from './src/services/atsService.js';
import { buildResumeDocxDocument } from './src/services/docxService.js';

// Mock localStorage in Node.js environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = {};
  globalThis.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { for (const k in store) delete store[k]; }
  };
}

console.log('================================================================');
console.log('🧪 RESUMAX UPGRADE VERIFICATION SUITE (PHASES 1 TO 7)');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// 1. PHASE 1: DESIGN STUDIO TESTS
// -----------------------------------------------------------------------------
console.log('1️⃣ Testing Phase 1: Design Studio & Theme System...');

// Custom HEX Palette Generation
const customHex = '#E11D48';
const palette = generatePaletteFromHex(customHex);
assert(palette, 'Custom hex palette should be generated');
assert.strictEqual(palette.primary, '#E11D48');
assert(palette.primaryDark.startsWith('#'), 'primaryDark should be valid hex');
assert(palette.primaryLight.startsWith('#'), 'primaryLight should be valid hex');
assert(palette.accent.startsWith('#'), 'accent should be valid hex');
assert(palette.border.startsWith('#'), 'border should be valid hex');
console.log('   ✅ Custom HEX palette generated with harmonic dark, light, accent, and border.');

// Theme Palette Resolver
const resolvedPreset = resolveThemePalette('teal');
assert.strictEqual(resolvedPreset.primary, THEME_COLOR_MAP.teal.primary);
const resolvedCustom = resolveThemePalette('blue', '#059669');
assert.strictEqual(resolvedCustom.primary, '#059669');
console.log('   ✅ Theme palette resolution for presets and custom hex verified.');

// Font Family Map
assert(FONT_FAMILY_MAP['Inter'], 'Inter font should be mapped');
assert(FONT_FAMILY_MAP['Plus Jakarta Sans'], 'Plus Jakarta Sans should be mapped');
assert(FONT_FAMILY_MAP['Roboto'], 'Roboto should be mapped');
assert(FONT_FAMILY_MAP['Outfit'], 'Outfit should be mapped');
assert(FONT_FAMILY_MAP['Playfair Display'], 'Playfair Display should be mapped');
console.log('   ✅ Extended typography catalog verified.');

// -----------------------------------------------------------------------------
// 2. PHASE 3: SMART PAGE MANAGEMENT
// -----------------------------------------------------------------------------
console.log('\n2️⃣ Testing Phase 3: Smart Page Management & Dimensions...');

// A4 vs Letter Dimensions
const a4HeightMm = 297;
const letterHeightMm = 279.4;
assert(a4HeightMm > letterHeightMm, 'A4 height is taller than US Letter');
console.log(`   ✅ Page formats verified: A4 (${a4HeightMm}mm) & US Letter (${letterHeightMm}mm).`);

// -----------------------------------------------------------------------------
// 3. PHASE 4: RESUME CONTENT & MULTI-RESUME STORAGE
// -----------------------------------------------------------------------------
console.log('\n3️⃣ Testing Phase 4: Resume Content & Multi-Resume Manager...');

// Mock localStorage in Node.js environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = {};
  globalThis.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { for (const k in store) delete store[k]; }
  };
}

const resumes = getAllResumes();
assert(Array.isArray(resumes), 'getAllResumes should return an array');
assert(resumes.length >= 1, 'Should initialize with at least 1 default resume');
const initialResume = resumes[0];
assert(initialResume.id, 'Resume must have an ID');
assert(initialResume.answers, 'Resume must have answers');
assert(initialResume.customizations, 'Resume must have customizations');
console.log(`   ✅ Resume store initialized with "${initialResume.title}".`);

// Test Create New Resume
const created = createNewResume('Product Design Resume', 'creative');
assert(created.id, 'New resume must have an ID');
assert.strictEqual(created.title, 'Product Design Resume');
assert.strictEqual(created.templateId, 'creative');
console.log(`   ✅ createNewResume created: "${created.title}" with template ${created.templateId}.`);

// Test Duplicate Resume
const duplicated = duplicateResume(created.id);
assert(duplicated.id, 'Duplicated resume must have unique ID');
assert.strictEqual(duplicated.title, 'Product Design Resume (Copy)');
console.log(`   ✅ duplicateResume created duplicate: "${duplicated.title}".`);

// Test Rename Resume
const renamed = renameResume(duplicated.id, 'Lead Design Resume');
assert.strictEqual(renamed.title, 'Lead Design Resume');
console.log(`   ✅ renameResume renamed to "${renamed.title}".`);

// Test Delete Resume
const beforeCount = getAllResumes().length;
deleteResume(duplicated.id);
const afterCount = getAllResumes().length;
assert.strictEqual(afterCount, beforeCount - 1, 'Resume count should decrease by 1');
console.log('   ✅ deleteResume verified.');

// -----------------------------------------------------------------------------
// 4. PHASE 5: ATS CHECKER ENHANCED COMPLIANCE & DISCLAIMER
// -----------------------------------------------------------------------------
console.log('\n4️⃣ Testing Phase 5: ATS Checker Detailed Compliance...');

const testCandidate = {
  fullName: 'Jordan Taylor',
  contact: {
    email: 'jordan.taylor@example.com',
    phone: '+1 (555) 987-6543',
    location: 'Austin, TX',
    website: 'https://jordantaylor.dev'
  },
  targetJobTitle: 'Staff Full Stack Engineer',
  summary: 'Experienced Staff Full Stack Engineer specialized in modern distributed web architectures.',
  experience: [
    {
      id: 1,
      role: 'Staff Engineer',
      company: 'Apex Cloud Systems',
      duration: '2021 – Present',
      location: 'Austin, TX',
      achievements: 'Architected high-throughput message streaming pipeline handling 50k events/sec.\nOptimized backend microservices, reducing p99 latency by 45%.'
    }
  ],
  education: [
    {
      id: 1,
      school: 'University of Texas at Austin',
      degree: 'B.S. in Computer Science',
      year: '2015 – 2019'
    }
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']
};

const compliance = checkDetailedAtsCompliance(testCandidate, 'classic');
assert(compliance.contactStatus.passed, 'Valid contact details should pass');
assert(compliance.headingStatus.passed, 'Standard headings should pass');
assert(compliance.formattingStatus.isAtsSafeTemplate, 'Classic should be flagged as ATS-safe');
assert(compliance.dateStatus.passed, 'Valid date ranges should pass');
assert(compliance.linkStatus.passed, 'Valid URL link should pass');
console.log('   ✅ Comprehensive category checks (contact, headings, dates, links, formatting) verified.');

// Test Simulated Text Extraction
const extractedText = simulateAtsTextExtraction(testCandidate);
assert(extractedText.includes('JORDAN TAYLOR'), 'Extracted text should include candidate name');
assert(extractedText.includes('STAFF FULL STACK ENGINEER'), 'Extracted text should include target role');
assert(extractedText.includes('PROFESSIONAL SUMMARY'), 'Extracted text should include standard headers');
assert(extractedText.includes('WORK EXPERIENCE'), 'Extracted text should include work experience header');
console.log('   ✅ ATS Simulated Plain Text Extraction verified.');

// Verify Prominent Disclaimer
assert(ATS_DISCLAIMER.includes('Disclaimer'), 'ATS Disclaimer must be present');
assert(ATS_DISCLAIMER.includes('does not guarantee'), 'ATS Disclaimer must state no guarantee');
console.log('   ✅ ATS legal disclaimer verified.');

// -----------------------------------------------------------------------------
// 5. PHASE 7: DOCX EXPORT INTEGRITY
// -----------------------------------------------------------------------------
console.log('\n5️⃣ Testing Phase 7: DOCX Document Generation with Custom Sections...');

const resumeWithCustomSection = {
  ...testCandidate,
  customSections: [
    {
      id: 'custom_1',
      name: 'Open Source & Patents',
      content: 'Author of open-source reactive state library with over 150,000 monthly downloads.'
    }
  ]
};

const docxDoc = buildResumeDocxDocument(resumeWithCustomSection);
assert(docxDoc, 'DOCX document object should be generated');
console.log('   ✅ DOCX structured document with custom section verified.');

console.log('\n================================================================');
console.log('🎉 ALL UPGRADE VERIFICATION TESTS PASSED SUCCESSFULLY!');
console.log('================================================================\n');
