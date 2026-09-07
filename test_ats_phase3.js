// Automated verification script for Resumax Phase 3: ATS Strength Checker
import assert from 'node:assert';
import { calculateFormatScore, evaluateResumeAtsStrength } from './src/services/atsService.js';
import { checkAtsContent } from './src/services/aiService.js';

console.log('🧪 Running Resumax Phase 3 ATS Strength Checker Verification Suite...\n');

// 1. Test Strong Resume Formatting
console.log('1️⃣ Testing Formatting Rules Engine...');
const strongResume = {
  fullName: 'Alex Morgan',
  contact: {
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA'
  },
  targetJobTitle: 'Senior Frontend Engineer',
  experience: [
    {
      id: 1,
      role: 'Senior Software Engineer',
      company: 'TechFlow Solutions',
      duration: '2022 – Present',
      achievements: 'Spearheaded frontend architecture overhaul\nReduced bundle size by 40% and improved Core Web Vitals to 98/100\nMentored team of 5 junior developers'
    }
  ],
  education: [
    {
      id: 1,
      school: 'UC Berkeley',
      degree: 'B.S. in Computer Science',
      year: '2016 – 2020'
    }
  ],
  skills: ['React', 'TypeScript', 'Next.js', 'REST APIs', 'Git', 'Agile']
};

const strongFormat = calculateFormatScore(strongResume, 'classic');
console.log(`   Strong Resume Classic Format Score: ${strongFormat.score}/100`);
assert(strongFormat.score >= 90, 'Complete resume with Classic template should score >= 90 in formatting');
assert.strictEqual(strongFormat.breakdown.templateSafety, 20, 'Classic template should award 20 pts');
assert.strictEqual(strongFormat.breakdown.contactCompleteness, 30, 'Full contact info should award 30 pts');

// 2. Test Incomplete/Weak Resume Formatting
const incompleteResume = {
  fullName: '',
  contact: { email: 'invalid-email', phone: '' },
  targetJobTitle: '',
  experience: [],
  education: [],
  skills: []
};

const weakFormat = calculateFormatScore(incompleteResume, 'modern');
console.log(`   Incomplete Resume Modern Format Score: ${weakFormat.score}/100`);
assert(weakFormat.score < 40, 'Incomplete resume should score < 40 in formatting');
assert(weakFormat.feedback.length >= 3, 'Should generate specific missing section feedback');
console.log('   ✅ Rule-based format calculations verified.');

// 3. Test AI Content Evaluation (Action Verbs & Metrics)
console.log('\n2️⃣ Testing Action Verbs, Quantifiable Metrics & Keywords...');

async function runAsyncTests() {
  const contentResult = await checkAtsContent(strongResume, '');
  console.log(`   Strong Resume Bullet Strength: ${contentResult.bulletStrength}`);
  console.log(`   Action Verbs Score: ${contentResult.actionVerbsScore}%`);
  console.log(`   Quantifiable Metrics Score: ${contentResult.quantifiableMetricsScore}%`);
  assert(contentResult.actionVerbsScore >= 75, 'Strong resume action verb score should be >= 75');
  assert(contentResult.quantifiableMetricsScore >= 75, 'Strong resume metrics score should be >= 75');

  // Weak bullets test
  const weakBulletsResume = {
    ...strongResume,
    experience: [
      {
        role: 'Helper',
        company: 'Company',
        achievements: 'Helped with website fixes\nResponsible for daily tasks\nWorked on bugs'
      }
    ]
  };
  const weakContentResult = await checkAtsContent(weakBulletsResume, '');
  console.log(`   Weak Resume Bullet Strength: ${weakContentResult.bulletStrength}`);
  console.log(`   Weak Resume Action Verbs Score: ${weakContentResult.actionVerbsScore}%`);
  assert(weakContentResult.actionVerbsScore < 70, 'Weak resume action verb score should be penalized');

  // 4. Test Job Description Keyword Gap Analysis
  console.log('\n3️⃣ Testing Target Job Description Keyword Gap Analysis...');
  const sampleJobDescription = `
    Looking for a Senior Frontend Engineer with deep expertise in React, TypeScript, Next.js, and AWS.
    Must have experience with Docker, CI/CD pipelines, GraphQL, and Cross-Functional Leadership.
  `;

  const jdAnalysis = await checkAtsContent(strongResume, sampleJobDescription);
  console.log(`   Matched Keywords: ${jdAnalysis.matchedKeywords.join(', ')}`);
  console.log(`   Missing Keywords: ${jdAnalysis.missingKeywords.join(', ')}`);
  console.log(`   Keyword Match Score: ${jdAnalysis.keywordMatchScore}%`);

  assert(jdAnalysis.matchedKeywords.includes('React'), 'Should match React');
  assert(jdAnalysis.matchedKeywords.includes('TypeScript'), 'Should match TypeScript');
  assert(jdAnalysis.missingKeywords.includes('AWS') || jdAnalysis.missingKeywords.includes('Docker') || jdAnalysis.missingKeywords.includes('CI/CD'), 'Should detect missing keywords');

  // 5. Test Composite End-to-End Evaluation
  console.log('\n4️⃣ Testing Complete Composite Evaluation...');
  const fullEval = await evaluateResumeAtsStrength(strongResume, sampleJobDescription, 'classic');
  console.log(`   Composite Overall ATS Score: ${fullEval.overallScore}% (Formatting: ${fullEval.formattingScore}%, Content: ${fullEval.contentScore}%)`);
  assert(fullEval.overallScore >= 75, 'Composite overall score should be >= 75');
  assert(fullEval.suggestions.length > 0, 'Suggestions list should be generated');

  console.log('\n🎉 ALL PHASE 3 ATS STRENGTH CHECKER TESTS PASSED!\n');
}

runAsyncTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
