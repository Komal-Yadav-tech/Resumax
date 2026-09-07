// Automated verification script for Resumax Phase 1: Core Q&A Resume Generator
import assert from 'node:assert';
import { generateResumeContent } from './src/services/aiService.js';

console.log('🧪 Running Resumax Phase 1 Verification Suite...\n');

const sampleAnswers = {
  fullName: 'Jordan Taylor',
  contact: {
    email: 'jordan.taylor@example.com',
    phone: '+1 555 123 4567',
    location: 'Seattle, WA',
    website: 'github.com/jordantaylor'
  },
  targetJobTitle: 'Lead Cloud Solutions Architect',
  experienceLevel: 'Senior-Level',
  experience: [
    {
      id: 101,
      company: 'CloudScale Enterprises',
      role: 'Staff Solutions Architect',
      duration: '2021 – Present',
      location: 'Seattle, WA',
      achievements: 'Migrated 50+ enterprise workloads to AWS multi-region infrastructure\nReduced cloud spend by $1.2M annually while maintaining 99.99% SLA uptime\nMentored 8 junior architects and led architecture review board'
    },
    {
      id: 102,
      company: 'DataCore Systems',
      role: 'Cloud Engineer',
      duration: '2018 – 2021',
      location: 'Bellevue, WA',
      achievements: 'Engineered automated CI/CD pipelines using Terraform and GitHub Actions\nOptimized containerized Kubernetes clusters'
    }
  ],
  education: [
    {
      id: 201,
      school: 'University of Washington',
      degree: 'M.S. in Information Systems',
      year: '2016 – 2018',
      location: 'Seattle, WA'
    }
  ],
  skills: [
    'AWS',
    'Kubernetes',
    'Terraform',
    'System Architecture',
    'Docker',
    'Python',
    'CI/CD Pipelines',
    'Cloud Security'
  ]
};

console.log('1️⃣ Testing AI Resume Generation (`generateResumeContent`)...');
const startTime = Date.now();
const result = await generateResumeContent(sampleAnswers);
const elapsed = Date.now() - startTime;

console.log(`   ⏱️ AI generation completed in ${elapsed}ms`);

// Assert Summary Generation
assert(result.summary, 'Summary should be generated');
assert(
  result.summary.includes('Lead Cloud Solutions Architect'),
  'Summary should incorporate target job title'
);
assert(result.summary.length > 50, 'Summary should be substantial and professional');
console.log('   ✅ Professional summary successfully generated:\n   "', result.summary, '"');

// Assert Enhanced Experience & Bullet Points
assert(Array.isArray(result.experience), 'Experience should be returned as array');
assert.strictEqual(result.experience.length, 2, 'Should preserve experience entries count');

result.experience.forEach((exp, idx) => {
  assert(Array.isArray(exp.generatedBullets), `Experience item ${idx + 1} should have generatedBullets`);
  assert(exp.generatedBullets.length > 0, `Experience item ${idx + 1} should have non-empty bullets`);
  console.log(`\n   ✅ Experience #${idx + 1} (${exp.role} @ ${exp.company}) generated ${exp.generatedBullets.length} enhanced bullet points:`);
  exp.generatedBullets.forEach((bullet) => {
    console.log(`      • ${bullet}`);
  });
});

// Assert Skills
assert.deepStrictEqual(result.skills, sampleAnswers.skills, 'Skills array should match');
console.log('\n   ✅ Skills preserved and validated.');

console.log('\n🎉 ALL PHASE 1 RESUME BUILDER & AI GENERATOR TESTS PASSED!\n');
