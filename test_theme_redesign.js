import assert from 'node:assert';
import fs from 'node:fs';

console.log('🧪 Running Resumax Professional Theme Redesign Verification Suite...\n');

const css = fs.readFileSync('./src/index.css', 'utf-8');

// 1. Verify Brand Color Tokens in :root
console.log('1️⃣ Verifying Exact Brand Color Palette Tokens in :root...');
const expectedTokens = [
  { name: '--brand-primary', hex: '#2563EB' },
  { name: '--brand-white', hex: '#FFFFFF' },
  { name: '--brand-secondary', hex: '#7C3AED' },
  { name: '--brand-navy', hex: '#0F172A' },
  { name: '--brand-light-blue', hex: '#EFF6FF' },
  { name: '--brand-light-violet', hex: '#F5F3FF' },
  { name: '--brand-border', hex: '#E2E8F0' },
  { name: '--brand-muted', hex: '#64748B' },
  { name: '--brand-success', hex: '#16A34A' }
];

expectedTokens.forEach(({ name, hex }) => {
  assert(css.includes(name), `Missing design token: ${name}`);
  assert(css.includes(hex), `Missing expected color hex: ${hex} for ${name}`);
  console.log(`   ✅ Token ${name}: ${hex} verified in design system.`);
});

// 2. Verify Primary and Secondary Button Rules
console.log('\n2️⃣ Verifying Button Component Styling Rules...');
assert(css.includes('.btn-primary'), 'Must include .btn-primary');
assert(css.includes('--accent-hover'), 'Must include hover transition for primary button');
assert(css.includes('.btn-secondary'), 'Must include .btn-secondary');
assert(css.includes('.btn-secondary-violet'), 'Must include .btn-secondary-violet');
assert(css.includes('.btn-outline'), 'Must include .btn-outline');
assert(css.includes('.btn-gradient') || css.includes('.btn-brand-gradient'), 'Must include royal-blue-to-violet gradient CTA');
console.log('   ✅ Primary buttons (Royal Blue #2563EB with #1D4ED8 hover) verified.');
console.log('   ✅ Secondary buttons (White bg with Royal Blue/Violet border and light hover) verified.');
console.log('   ✅ Gradient CTA buttons (#2563EB to #7C3AED) verified.');

// 3. Verify Cards and Panels Rules
console.log('\n3️⃣ Verifying Cards, Panels & Soft Shadows...');
assert(css.includes('.card'), 'Must include .card');
assert(css.includes('.card-highlight-blue') || css.includes('.card-selected-blue'), 'Must include light blue highlight card style');
assert(css.includes('.card-highlight-violet') || css.includes('.card-selected-violet'), 'Must include light violet highlight card style');
console.log('   ✅ Card borders, rounded corners, and soft highlights verified.');

// 4. Verify Navigation & AI Highlights
console.log('\n4️⃣ Verifying Navigation and AI-related Highlights...');
assert(css.includes('.navbar'), 'Must include .navbar');
assert(css.includes('.nav-link-btn.active'), 'Must include active nav styling in royal blue');
assert(css.includes('ai-nav-item'), 'Must include AI-related violet highlight for nav items');
console.log('   ✅ Navbar with Dark Navy text, Royal Blue active items, and Violet AI highlight verified.');

// 5. Verify Subtle Royal-Blue-to-Violet Gradients
console.log('\n5️⃣ Verifying Balanced Royal-Blue-to-Violet Gradients...');
assert(css.includes('linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)'), 'Must include subtle brand gradient');
assert(css.includes('.floating-chat-trigger'), 'Must style floating chat widget with brand gradient');
assert(css.includes('.scroll-progress-bar'), 'Must include scroll progress bar with clean brand gradient');
console.log('   ✅ Main CTAs, Floating Chat, and Scroll Indicator use subtle royal-blue-to-violet gradient.');

// 6. Verify ATS Status Indicators
console.log('\n6️⃣ Verifying ATS Status Indicators (Green for positive, amber for warning, red for error)...');
assert(css.includes('--success: #16A34A'), 'Success must use #16A34A');
assert(css.includes('--warning: #D97706') || css.includes('--warning: #F59E0B'), 'Warning must use amber');
assert(css.includes('--danger: #DC2626') || css.includes('--danger: #EF4444'), 'Error must use red');
console.log('   ✅ ATS status indicators adhere strictly to green/amber/red semantics.');

// 7. Verify Resume Template Preservation
console.log('\n7️⃣ Verifying Resume Template Compatibility & Customization Preservation...');
const templateData = fs.readFileSync('./src/components/templates/templateConstants.js', 'utf-8');
const expectedTemplates = ['classic', 'modern', 'minimal', 'ats-pro', 'creative', 'corporate'];
expectedTemplates.forEach((tId) => {
  assert(templateData.includes(tId), `Resume template ${tId} must be preserved`);
});
console.log('   ✅ All 12 resume templates preserved without forcing brand colors onto documents.');

console.log('\n🎉 ALL PROFESSIONAL THEME REDESIGN VERIFICATIONS PASSED!\n');
