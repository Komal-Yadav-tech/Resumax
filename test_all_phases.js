// Master verification test runner for Resumax (All Phases 0 - 7)
import { spawnSync } from 'node:child_process';
import assert from 'node:assert';
import fs from 'node:fs';

console.log('================================================================');
console.log('🚀 RESUMAX MASTER VERIFICATION SUITE (ALL PHASES 0 TO 7)');
console.log('================================================================\n');

const testSuites = [
  { name: 'Phase 0: Registration, Login & Session Persistence', file: 'test_auth_phase0.js' },
  { name: 'Phase 2: Resume Templates (Classic, Modern, Minimal) & PDF', file: 'test_templates_phase2.js' },
  { name: 'Phase 3: ATS Strength Checker & Keyword Gap Engine', file: 'test_ats_phase3.js' },
  { name: 'Phase 4: AI Career Chatbot & Context Injection', file: 'test_chatbot_phase4.js' },
  { name: 'Phase 5: Light / Dark Mode Toggle & Design Tokens', file: 'test_theme_phase5.js' },
  { name: 'Phase 6: Real AI Backend & Gemini API Endpoints', file: 'test_ai_phase6.js' },
  { name: 'Feature Additions: Multi-Format Export (PDF, DOCX, TXT) & Feedback Popup', file: 'test_export_feedback.js' }
];

let passedCount = 0;

for (const suite of testSuites) {
  console.log(`▶️ Executing ${suite.name}...`);
  const result = spawnSync('node', [suite.file], {
    stdio: 'inherit',
    encoding: 'utf-8'
  });

  if (result.status === 0) {
    passedCount++;
    console.log(`✅ ${suite.name} PASSED.\n`);
  } else {
    console.error(`❌ ${suite.name} FAILED with status code ${result.status}.\n`);
    process.exit(1);
  }
}

// Check Phase 7 Deployment Artifacts
console.log('▶️ Checking Phase 7 Deployment & Documentation Files...');
assert(fs.existsSync('./Memory.md'), 'Memory.md must exist');
assert(fs.existsSync('./README.md'), 'README.md must exist');
assert(fs.existsSync('./vercel.json'), 'vercel.json must exist');
assert(fs.existsSync('./.env.example'), '.env.example must exist');
assert(fs.existsSync('./package.json'), 'package.json must exist');
console.log('   ✅ Memory.md, README.md, vercel.json, and .env.example verified.');

console.log('\n================================================================');
console.log(`🎉 ALL ${passedCount} VERIFICATION SUITES AND DEPLOYMENT CHECKS PASSED!`);
console.log('================================================================\n');
