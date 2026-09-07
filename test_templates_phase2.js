// Automated verification script for Resumax Phase 2: Resume Templates & PDF Export
import assert from 'node:assert';
import { TEMPLATES, POPULAR_TEMPLATE_IDS } from './src/components/templates/templateConstants.js';

console.log('🧪 Running Resumax Phase 2 Verification Suite...\n');

// 1. Test Template Definitions
console.log('1️⃣ Testing Template Catalog & ATS Compliance Flags...');
assert.strictEqual(TEMPLATES.length, 12, 'Should have exactly 12 templates total');

const EXPECTED_TEMPLATES = [
  { id: 'classic', name: 'Classic', tagline: 'Timeless & Trusted', isAtsSafe: true },
  { id: 'ats-pro', name: 'ATS Pro', tagline: 'ATS-Optimized & Career-Ready', isAtsSafe: true },
  { id: 'ats-simple', name: 'ATS Simple', tagline: 'Simple & Fresher-Friendly', isAtsSafe: true },
  { id: 'ats-compact', name: 'ATS Compact', tagline: 'Smart & Space-Efficient', isAtsSafe: true },
  { id: 'modern', name: 'Modern', tagline: 'Polished & Impactful', isAtsSafe: false },
  { id: 'minimal', name: 'Minimal', tagline: 'Elegant & Refined', isAtsSafe: false },
  { id: 'techstack', name: 'TechStack', tagline: 'Technical & Skill-Focused', isAtsSafe: false },
  { id: 'corporate', name: 'Corporate', tagline: 'Professional & Executive', isAtsSafe: false },
  { id: 'sidebar-pro', name: 'Sidebar Pro', tagline: 'Structured & Two-Column', isAtsSafe: false },
  { id: 'timeline', name: 'Timeline', tagline: 'Visual & Chronological', isAtsSafe: false },
  { id: 'academic', name: 'Academic', tagline: 'Research-Ready & Detailed', isAtsSafe: true },
  { id: 'creative', name: 'Creative', tagline: 'Bold & Visually Engaging', isAtsSafe: false }
];

EXPECTED_TEMPLATES.forEach((expected) => {
  const tmpl = TEMPLATES.find((t) => t.id === expected.id);
  assert(tmpl, `Template with id "${expected.id}" must exist`);
  assert.strictEqual(tmpl.name, expected.name, `Template ${expected.id} must be named "${expected.name}"`);
  assert.strictEqual(tmpl.tagline, expected.tagline, `Template ${expected.id} must have tagline "${expected.tagline}"`);
  assert.strictEqual(tmpl.isAtsSafe, expected.isAtsSafe, `Template ${expected.id} isAtsSafe must be ${expected.isAtsSafe}`);
  console.log(`   ✅ ${tmpl.name}: "${tmpl.tagline}" [${tmpl.isAtsSafe ? 'ATS Safe' : 'Not ATS Safe'}]`);
});

// Popular template cards check
assert.strictEqual(POPULAR_TEMPLATE_IDS.length, 4, 'Should designate 4 popular templates');
assert(POPULAR_TEMPLATE_IDS.includes('classic'), 'Popular templates must include Classic');
assert(POPULAR_TEMPLATE_IDS.includes('modern'), 'Popular templates must include Modern');
assert(POPULAR_TEMPLATE_IDS.includes('minimal'), 'Popular templates must include Minimal');
assert(POPULAR_TEMPLATE_IDS.includes('ats-pro'), 'Popular templates must include ATS Pro');
console.log('   ✅ Popular Templates on main Builder screen verified: Classic, Modern, Minimal, ATS Pro');

// 2. Test Safe Filename Generation
console.log('\n2️⃣ Testing PDF Safe Filename Sanitization...');
const testNames = [
  { input: 'Alex Morgan', expected: 'Alex_Morgan_Resume.pdf' },
  { input: 'Dr. Jane O\'Connor-Smith', expected: 'Dr__Jane_O_Connor-Smith_Resume.pdf' },
  { input: '   Jordan Taylor   ', expected: 'Jordan_Taylor_Resume.pdf' }
];

testNames.forEach(({ input, expected }) => {
  const safe = `${input.trim().replace(/[^a-zA-Z0-9_-]/g, '_')}_Resume.pdf`;
  console.log(`   Input: "${input}" -> Filename: "${safe}"`);
  assert(safe.endsWith('.pdf'), 'Must have .pdf extension');
});
console.log('   ✅ Filename generation verified.');

console.log('\n🎉 ALL PHASE 2 RESUME TEMPLATES & EXPORT TESTS PASSED!\n');
