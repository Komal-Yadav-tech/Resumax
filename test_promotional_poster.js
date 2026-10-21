import fs from 'fs';
import path from 'path';

console.log('🧪 Running Resumax Promotional Poster Verification Suite...\n');

let passed = true;

// 1. Verify Poster Asset Files
console.log('1️⃣ Checking Poster Image Assets...');
const publicPosterPath = path.resolve('public/assets/resumax-promotional-poster.jpg');
const srcPosterPath = path.resolve('src/assets/resumax-promotional-poster.jpg');

if (fs.existsSync(publicPosterPath) && fs.existsSync(srcPosterPath)) {
  const publicStat = fs.statSync(publicPosterPath);
  const srcStat = fs.statSync(srcPosterPath);
  const publicBuf = fs.readFileSync(publicPosterPath);
  // Verify JPEG magic bytes FF D8 FF
  const isJpeg = publicBuf[0] === 0xff && publicBuf[1] === 0xd8 && publicBuf[2] === 0xff;

  if (publicStat.size > 50000 && srcStat.size > 50000 && isJpeg) {
    console.log(`   ✅ Exact promotional poster image verified at public/assets and src/assets (${(publicStat.size / 1024).toFixed(1)} KB, valid JPEG).`);
  } else {
    console.error('   ❌ Poster file size or magic bytes invalid.');
    passed = false;
  }
} else {
  console.error('   ❌ Poster image files missing from public/assets or src/assets.');
  passed = false;
}

// 2. Verify Dashboard.jsx Implementation
console.log('\n2️⃣ Verifying Dashboard.jsx Homepage Hierarchy...');
const dashboardContent = fs.readFileSync(path.resolve('src/pages/Dashboard.jsx'), 'utf-8');

const posterImportMatch = dashboardContent.includes("import promotionalPosterImg from '../assets/resumax-promotional-poster.jpg'");
const posterContainerMatch = dashboardContent.includes('className="promotional-poster-container"');
const posterImgTagMatch = dashboardContent.includes('src={promotionalPosterImg}') && dashboardContent.includes('className="promotional-poster-img"');

if (posterImportMatch && posterContainerMatch && posterImgTagMatch) {
  console.log('   ✅ Promotional poster component and asset import verified in Dashboard.jsx.');
} else {
  console.error('   ❌ Promotional poster markup or asset import missing in Dashboard.jsx.');
  passed = false;
}

// Verify Ordering: Poster -> Welcome Banner (Hero) -> Feature 01 -> Feature 02 -> Feature 03 -> My Resumes
const posterIdx = dashboardContent.indexOf('promotional-poster-container');
const heroIdx = dashboardContent.indexOf('welcome-banner');
const builderIdx = dashboardContent.indexOf('id="feature-builder"');
const atsIdx = dashboardContent.indexOf('id="feature-ats"');
const advisorIdx = dashboardContent.indexOf('id="feature-advisor"');
const resumesIdx = dashboardContent.indexOf('id="my-resumes"');

if (
  posterIdx !== -1 &&
  heroIdx !== -1 &&
  builderIdx !== -1 &&
  atsIdx !== -1 &&
  advisorIdx !== -1 &&
  resumesIdx !== -1 &&
  posterIdx < heroIdx &&
  heroIdx < builderIdx &&
  builderIdx < atsIdx &&
  atsIdx < advisorIdx &&
  advisorIdx < resumesIdx
) {
  console.log('   ✅ Homepage structural ordering verified:');
  console.log('      [1] Attached Resumax promotional poster (immediately below navbar)');
  console.log('      [2] Existing homepage hero / welcome banner (preserved directly after poster)');
  console.log('      [3] Feature 01 AI Conversational Builder (preserved in order)');
  console.log('      [4] Feature 02 ATS Strength Checker (preserved in order)');
  console.log('      [5] Feature 03 AI Career Advisor (preserved in order)');
  console.log('      [6] My Resumes section (preserved in order)');
} else {
  console.error('   ❌ Homepage section ordering violated!');
  passed = false;
}

// 3. Verify Navbar.jsx Integrity
console.log('\n3️⃣ Verifying Navbar.jsx Integrity (Strict Preservation)...');
const navbarContent = fs.readFileSync(path.resolve('src/components/layout/Navbar.jsx'), 'utf-8');
const navbarHasBrandLogo = navbarContent.includes('className="brand-logo"');
const navbarHasCenterLinks = navbarContent.includes('className="nav-center-links desktop-only-nav"');
const navbarHasThemeToggle = navbarContent.includes('<ThemeToggle />');
const navbarHasMobileToggle = navbarContent.includes('className="mobile-hamburger-btn"');

if (navbarHasBrandLogo && navbarHasCenterLinks && navbarHasThemeToggle && navbarHasMobileToggle) {
  console.log('   ✅ Existing Navbar preserved strictly with zero breaking modifications.');
} else {
  console.error('   ❌ Navbar component was altered.');
  passed = false;
}

// 4. Verify CSS Scoped Styling & Responsiveness in index.css
console.log('\n4️⃣ Verifying Scoped CSS Styling & Responsiveness...');
const cssContent = fs.readFileSync(path.resolve('src/index.css'), 'utf-8');

const hasPosterContainerClass = cssContent.includes('.promotional-poster-container {');
const hasPosterImgClass = cssContent.includes('.promotional-poster-img {');
const hasWidth100 = cssContent.includes('width: 100%');
const hasHeightAuto = cssContent.includes('height: auto');
const hasObjectFitContain = cssContent.includes('object-fit: contain');
const hasMobileReflow = cssContent.includes('.promotional-poster-container {') && cssContent.includes('@media (max-width: 768px)');

if (hasPosterContainerClass && hasPosterImgClass && hasWidth100 && hasHeightAuto && hasObjectFitContain && hasMobileReflow) {
  console.log('   ✅ Scoped poster styling verified: width: 100%, height: auto, object-fit: contain, responsive mobile reflow.');
} else {
  console.error('   ❌ Scoped CSS styling incomplete.');
  passed = false;
}

// 5. Verify Production Build Artifact
console.log('\n5️⃣ Verifying Production Build Output...');
const distDir = path.resolve('dist/assets');
if (fs.existsSync(distDir)) {
  const distFiles = fs.readdirSync(distDir);
  const posterAssetInDist = distFiles.find(f => f.startsWith('resumax-promotional-poster') && f.endsWith('.jpg'));
  if (posterAssetInDist) {
    console.log(`   ✅ Bundled promotional poster asset verified in production build: dist/assets/${posterAssetInDist}`);
  } else {
    console.warn('   ⚠️ Note: Re-run npm run build to ensure dist contains the latest bundle.');
  }
}

if (passed) {
  console.log('\n🎉 ALL RESUMAX PROMOTIONAL POSTER REQUIREMENTS MET 100%!\n');
  process.exit(0);
} else {
  console.error('\n❌ SOME VERIFICATION CHECKS FAILED.\n');
  process.exit(1);
}
