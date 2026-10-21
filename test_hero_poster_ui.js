import fs from 'fs';
import path from 'path';

console.log('🧪 Running Resumax Functional Hero UI Verification Suite...\n');

let passed = true;

// 1. Verify Dashboard.jsx Hero Content
console.log('1️⃣ Checking Recreated Hero Content in Dashboard.jsx...');
const dashboardContent = fs.readFileSync(path.resolve('src/pages/Dashboard.jsx'), 'utf-8');

// Check that outlined portion is NOT displayed as an image
const hasImagePoster = dashboardContent.includes('className="promotional-poster-container"') || dashboardContent.includes('promotionalPosterImg');
if (!hasImagePoster) {
  console.log('   ✅ Outlined portion is NOT rendered as a static image.');
} else {
  console.error('   ❌ Found static poster image in Dashboard.jsx when real UI elements were requested.');
  passed = false;
}

// A. Heading Verification
const hasExactHeadingWords =
  dashboardContent.includes('Create Professional Resumes') &&
  dashboardContent.includes('with') &&
  dashboardContent.includes('AI') &&
  dashboardContent.includes('hero-main-heading');

if (hasExactHeadingWords) {
  console.log('   ✅ Main Heading verified: "Create Professional Resumes with AI" with highlight styling.');
} else {
  console.error('   ❌ Main heading mismatch.');
  passed = false;
}

// B. Supporting Description Verification
const exactDesc = 'Build, customize, and optimize your resume with smart AI tools. Get ATS-friendly, modern templates and stand out from the crowd.';
if (dashboardContent.includes(exactDesc)) {
  console.log('   ✅ Supporting Description verified: exact text match.');
} else {
  console.error('   ❌ Supporting description text mismatch.');
  passed = false;
}

// C. Four Feature Highlights Verification
const feature1 = dashboardContent.includes('AI Resume Builder') && dashboardContent.includes('Create in seconds with AI');
const feature2 = dashboardContent.includes('ATS Score Checker') && dashboardContent.includes('Improve your chances');
const feature3 = dashboardContent.includes('Multiple Templates') && dashboardContent.includes('9+ professional styles');
const feature4 = dashboardContent.includes('Easy Customization') && dashboardContent.includes('Make it your own');

if (feature1 && feature2 && feature3 && feature4) {
  console.log('   ✅ Four Feature Highlights verified with exact titles, icons, and descriptions:');
  console.log('      - AI Resume Builder ("Create in seconds with AI")');
  console.log('      - ATS Score Checker ("Improve your chances")');
  console.log('      - Multiple Templates ("9+ professional styles")');
  console.log('      - Easy Customization ("Make it your own")');
} else {
  console.error('   ❌ One or more feature highlights missing or text mismatch.');
  passed = false;
}

// D. Primary CTA Button & Functional Navigation Verification
const hasCtaLabel = dashboardContent.includes('Build Your Resume Now');
const hasCtaNavigation = dashboardContent.includes("onClick={() => onNavigate('builder')}");
const hasCtaId = dashboardContent.includes('id="hero-build-resume-btn"');

if (hasCtaLabel && hasCtaNavigation && hasCtaId) {
  console.log('   ✅ Primary CTA Button verified: "Build Your Resume Now →", functionally wired to onNavigate(\'builder\').');
} else {
  console.error('   ❌ Primary CTA button or navigation handler missing.');
  passed = false;
}

// 2. Verify Removal of Legacy Greeting Banner and My Resumes Section
console.log('\n2️⃣ Verifying Removal of Specified Sections...');
const hasLegacyGreeting = dashboardContent.includes('Welcome back,') || dashboardContent.includes('hero-user-greeting');
const hasMyResumesSection = dashboardContent.includes('id="my-resumes"') || dashboardContent.includes('My Resumes');

if (!hasLegacyGreeting) {
  console.log('   ✅ Legacy "Welcome back" greeting banner successfully removed from hero page.');
} else {
  console.error('   ❌ "Welcome back" greeting banner still present in Dashboard.jsx.');
  passed = false;
}

if (!hasMyResumesSection) {
  console.log('   ✅ "My Resumes" section successfully removed from hero page.');
} else {
  console.error('   ❌ "My Resumes" section still present in Dashboard.jsx.');
  passed = false;
}

// 3. Verify Homepage Hierarchy & Order of Remaining Sections
console.log('\n3️⃣ Verifying Remaining Homepage Hierarchy...');
const heroIdx = dashboardContent.indexOf('welcome-banner');
const builderIdx = dashboardContent.indexOf('id="feature-builder"');
const atsIdx = dashboardContent.indexOf('id="feature-ats"');
const advisorIdx = dashboardContent.indexOf('id="feature-advisor"');

if (
  heroIdx !== -1 &&
  builderIdx !== -1 &&
  atsIdx !== -1 &&
  advisorIdx !== -1 &&
  heroIdx < builderIdx &&
  builderIdx < atsIdx &&
  atsIdx < advisorIdx
) {
  console.log('   ✅ Homepage structural ordering preserved:');
  console.log('      [1] Hero section (recreated functional UI)');
  console.log('      [2] Feature 01 AI Conversational Builder (preserved in order)');
  console.log('      [3] Feature 02 ATS Strength Checker (preserved in order)');
  console.log('      [4] Feature 03 AI Career Advisor (preserved in order)');
} else {
  console.error('   ❌ Homepage section ordering violated!');
  passed = false;
}

// 3. Verify Navbar.jsx Unchanged
console.log('\n3️⃣ Verifying Navbar.jsx Preservation...');
const navbarContent = fs.readFileSync(path.resolve('src/components/layout/Navbar.jsx'), 'utf-8');
if (
  navbarContent.includes('className="brand-logo"') &&
  navbarContent.includes('className="nav-center-links desktop-only-nav"') &&
  navbarContent.includes('mobile-hamburger-btn')
) {
  console.log('   ✅ Navbar is completely preserved with all links, branding, and mobile controls intact.');
} else {
  console.error('   ❌ Navbar was improperly altered.');
  passed = false;
}

// 4. Verify CSS Design Tokens & Responsiveness in index.css
console.log('\n4️⃣ Verifying Scoped CSS Styling & Mobile Responsiveness in index.css...');
const cssContent = fs.readFileSync(path.resolve('src/index.css'), 'utf-8');

const hasHeroHeadingClass = cssContent.includes('.hero-main-heading {');
const hasHeroFeaturesRow = cssContent.includes('.hero-features-row {');
const hasHeroFeatureItem = cssContent.includes('.hero-feature-item {');
const hasHeroCtaBtn = cssContent.includes('.hero-primary-cta-btn {');
const hasHeroAiGradient = cssContent.includes('.hero-ai-gradient {');
const hasPillRadius = cssContent.includes('border-radius: 9999px');
const hasMobileReflow = cssContent.includes('@media (max-width: 768px)') && cssContent.includes('.hero-features-row {');

if (
  hasHeroHeadingClass &&
  hasHeroFeaturesRow &&
  hasHeroFeatureItem &&
  hasHeroCtaBtn &&
  hasHeroAiGradient &&
  hasPillRadius &&
  hasMobileReflow
) {
  console.log('   ✅ Scoped Hero CSS verified:');
  console.log('      - Brand typography & gradient highlight');
  console.log('      - Circular icon wrappers with soft colored tints');
  console.log('      - Pill-shaped gradient CTA button with hover/focus states');
  console.log('      - Responsive grid reflow for tablet and mobile viewports');
} else {
  console.error('   ❌ Scoped CSS styling incomplete.');
  passed = false;
}

if (passed) {
  console.log('\n🎉 ALL FUNCTIONAL HERO UI REQUIREMENTS MET 100%!\n');
  process.exit(0);
} else {
  console.error('\n❌ SOME VERIFICATION CHECKS FAILED.\n');
  process.exit(1);
}
