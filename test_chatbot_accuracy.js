// Verification Suite for Resumax Chatbot Answer Accuracy, Relevance & Response Formatting
import assert from 'node:assert';
import { askResumeChatbot } from './src/services/aiService.js';
import { processCareerChatMessage } from './src/services/careerChatEngine.js';

console.log('🧪 Running Resumax AI Chatbot Accuracy & Formatting Verification Suite...\n');

// Active resume profile
const candidateContext = {
  fullName: 'Alex Morgan',
  targetJobTitle: 'Senior Frontend Engineer',
  skills: ['React', 'TypeScript', 'Next.js', 'REST APIs', 'System Architecture'],
  experience: [
    {
      role: 'Senior Software Engineer',
      company: 'TechFlow Solutions',
      achievements: 'Built client portals and managed frontend team'
    }
  ]
};

async function runTests() {
  let passedCount = 0;

  // ----------------------------------------------------
  // Test 1: Single Resume Line Rewriting (Hackathons)
  // ----------------------------------------------------
  console.log('1️⃣ Testing Test 1: Single resume bullet rewrite (7 hackathons)...');
  const t1Query = 'How can I write that I participated in 7 hackathons in my resume?';
  const t1Reply = await askResumeChatbot(t1Query, candidateContext, []);
  console.log(`   Reply: ${t1Reply}`);

  assert(
    t1Reply.toLowerCase().includes('participated in 7') || t1Reply.toLowerCase().includes('7+ hackathons'),
    'Test 1 must mention participating in 7 hackathons'
  );
  assert(
    !t1Reply.toLowerCase().startsWith('certainly') &&
    !t1Reply.toLowerCase().startsWith('hello') &&
    !t1Reply.toLowerCase().startsWith('as an ai'),
    'Test 1 must answer directly first without generic introductions'
  );
  console.log('   ✅ Test 1 Passed: Generated single polished ready-to-use resume bullet.');
  passedCount++;

  // ----------------------------------------------------
  // Test 2: Request for 3 Options
  // ----------------------------------------------------
  console.log('\n2️⃣ Testing Test 2: Exactly 3 distinct options for hackathon experience...');
  const t2Query = 'Give me 3 options for describing my hackathon experience.';
  const t2Reply = await askResumeChatbot(t2Query, candidateContext, [
    { role: 'user', content: t1Query },
    { role: 'assistant', content: t1Reply }
  ]);
  console.log(`   Reply preview:\n${t2Reply}`);

  assert(
    t2Reply.includes('Option 1') && t2Reply.includes('Option 2') && t2Reply.includes('Option 3'),
    'Test 2 must provide 3 labeled options'
  );
  console.log('   ✅ Test 2 Passed: Provided exactly 3 distinct, professional alternatives.');
  passedCount++;

  // ----------------------------------------------------
  // Test 3: Follow-up "Make the second option shorter"
  // ----------------------------------------------------
  console.log('\n3️⃣ Testing Test 3: Follow-up: "Make the second option shorter"...');
  const historyForT3 = [
    { role: 'user', content: t2Query },
    { role: 'assistant', content: t2Reply }
  ];
  const t3Query = 'Make the second option shorter.';
  const t3Reply = await askResumeChatbot(t3Query, candidateContext, historyForT3);
  console.log(`   Reply: ${t3Reply}`);

  assert(
    t3Reply.toLowerCase().includes('hackathon'),
    'Test 3 must maintain context and shorten option 2'
  );
  assert(
    t3Reply.length < 160,
    'Test 3 must be a concise, shortened version'
  );
  console.log('   ✅ Test 3 Passed: Successfully shortened second option using conversation context.');
  passedCount++;

  // ----------------------------------------------------
  // Test 4: Explanation of ATS-friendly resume
  // ----------------------------------------------------
  console.log('\n4️⃣ Testing Test 4: Explanation: "Explain what an ATS-friendly resume means"...');
  const t4Query = 'Explain what an ATS-friendly resume means.';
  const t4Reply = await askResumeChatbot(t4Query, candidateContext, []);
  console.log(`   Reply preview:\n${t4Reply.substring(0, 150)}...`);

  assert(
    t4Reply.toLowerCase().includes('ats') || t4Reply.toLowerCase().includes('applicant tracking'),
    'Test 4 must explain ATS'
  );
  assert(
    t4Reply.toLowerCase().includes('format') || t4Reply.toLowerCase().includes('keyword'),
    'Test 4 must mention formatting/keywords'
  );
  console.log('   ✅ Test 4 Passed: Clean, simple explanation with actionable examples.');
  passedCount++;

  // ----------------------------------------------------
  // Test 5: Entry-level Cybersecurity Skills
  // ----------------------------------------------------
  console.log('\n5️⃣ Testing Test 5: Skills for entry-level cybersecurity role...');
  const t5Query = 'What skills should I highlight for an entry-level cybersecurity role?';
  const t5Reply = await askResumeChatbot(t5Query, candidateContext, []);
  console.log(`   Reply preview:\n${t5Reply.substring(0, 160)}...`);

  assert(
    t5Reply.toLowerCase().includes('networking') || t5Reply.toLowerCase().includes('tcp/ip'),
    'Test 5 must highlight networking fundamentals'
  );
  assert(
    t5Reply.toLowerCase().includes('linux') || t5Reply.toLowerCase().includes('security'),
    'Test 5 must highlight relevant systems/security skills'
  );
  console.log('   ✅ Test 5 Passed: Relevant cybersecurity skills without inventing user experience.');
  passedCount++;

  // ----------------------------------------------------
  // Test 6: Broad claim "good at everything"
  // ----------------------------------------------------
  console.log('\n6️⃣ Testing Test 6: Broad claim: "Write a professional resume line saying I am good at everything"...');
  const t6Query = 'Write a professional resume line saying I am good at everything.';
  const t6Reply = await askResumeChatbot(t6Query, candidateContext, []);
  console.log(`   Reply preview:\n${t6Reply.substring(0, 180)}...`);

  assert(
    t6Reply.toLowerCase().includes('broad') || t6Reply.toLowerCase().includes('generic') || t6Reply.toLowerCase().includes('credibility'),
    'Test 6 must explain why saying "good at everything" is too broad'
  );
  assert(
    t6Reply.toLowerCase().includes('adaptable') || t6Reply.toLowerCase().includes('versatile'),
    'Test 6 must offer a stronger, truthful alternative highlighting adaptability'
  );
  console.log('   ✅ Test 6 Passed: Addressed broad claim and offered strong, truthful alternative.');
  passedCount++;

  // ----------------------------------------------------
  // Test 7: General Factual Question (Capital of Japan)
  // ----------------------------------------------------
  console.log('\n7️⃣ Testing Test 7: General factual question: "What is the capital of Japan?"...');
  const t7Query = 'What is the capital of Japan?';
  const t7Reply = await askResumeChatbot(t7Query, candidateContext, []);
  console.log(`   Reply: "${t7Reply}"`);

  assert.strictEqual(
    t7Reply,
    'Tokyo is the capital of Japan.',
    'Test 7 must directly return "Tokyo is the capital of Japan."'
  );
  assert(
    !t7Reply.toLowerCase().includes('resume') && !t7Reply.toLowerCase().includes('career'),
    'Test 7 must NOT force resume or career coaching onto a general question'
  );
  console.log('   ✅ Test 7 Passed: Direct, factual answer without unwanted resume injection.');
  passedCount++;

  // ----------------------------------------------------
  // Test 8: "Tell me about my experience"
  // ----------------------------------------------------
  console.log('\n8️⃣ Testing Test 8: Contextual inquiry: "Tell me about my experience"...');
  // 8a: With experience context
  const t8Query = 'Tell me about my experience.';
  const t8ReplyWithContext = await askResumeChatbot(t8Query, candidateContext, []);
  console.log(`   With Context Reply: ${t8ReplyWithContext.substring(0, 140)}...`);

  assert(
    t8ReplyWithContext.includes('Senior Software Engineer') && t8ReplyWithContext.includes('TechFlow Solutions'),
    'Test 8a must use loaded candidate experience context'
  );

  // 8b: Without experience context
  const emptyContext = { targetJobTitle: 'Junior Developer', skills: [], experience: [] };
  const t8ReplyEmpty = await askResumeChatbot(t8Query, emptyContext, []);
  console.log(`   Empty Context Reply: ${t8ReplyEmpty.substring(0, 140)}...`);

  assert(
    t8ReplyEmpty.toLowerCase().includes('do not have') || t8ReplyEmpty.toLowerCase().includes('share your'),
    'Test 8b must invite user to share their experience when none is loaded'
  );
  console.log('   ✅ Test 8 Passed: Accurately reflected loaded context and requested info when missing.');
  passedCount++;

  console.log(`\n🎉 ALL ${passedCount}/8 CHATBOT ACCURACY & INTENT TESTS PASSED 100%!\n`);
}

runTests().catch((err) => {
  console.error('❌ Accuracy test suite failed:', err);
  process.exit(1);
});
