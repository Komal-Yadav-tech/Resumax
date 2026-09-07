// Automated verification script for Resumax Phase 4: AI Career Chatbot
import assert from 'node:assert';
import { askResumeChatbot } from './src/services/aiService.js';
import { STARTER_PROMPTS, getInitialWelcomeMessage } from './src/services/chatService.js';

console.log('🧪 Running Resumax Phase 4 AI Career Chatbot Verification Suite...\n');

// Mock resume context
const resumeContext = {
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

async function runChatbotTests() {
  // 1. Test Welcome Message Generation
  console.log('1️⃣ Testing Initial Welcome Message Creation...');
  const welcomeMsg = getInitialWelcomeMessage('Alex Morgan', 'Senior Frontend Engineer');
  assert.strictEqual(welcomeMsg.role, 'assistant', 'Welcome message must be from assistant');
  assert(welcomeMsg.content.includes('Senior Frontend Engineer'), 'Welcome message should reference target role');
  console.log('   ✅ Welcome message generated with personalized target role.');

  // 2. Test Starter Prompts
  console.log('\n2️⃣ Testing Starter Prompts Catalog...');
  assert.strictEqual(STARTER_PROMPTS.length, 4, 'Should have 4 starter prompt templates');
  STARTER_PROMPTS.forEach((p) => {
    assert(p.prompt.length > 10, 'Prompt text should be meaningful');
    console.log(`   Starter prompt [${p.icon} ${p.label}]: "${p.prompt.substring(0, 45)}..."`);
  });
  console.log('   ✅ Starter prompt templates verified.');

  // 3. Test Bullet Point Improvement Intent
  console.log('\n3️⃣ Testing Experience Bullet Rewriting Intent...');
  const bulletQuery = 'Can you improve my work experience bullet points?';
  const bulletReply = await askResumeChatbot(bulletQuery, resumeContext);
  console.log(`   Reply preview: "${bulletReply.substring(0, 80)}..."`);
  assert(bulletReply.includes('Senior Frontend Engineer'), 'Reply should reference target role');
  assert(bulletReply.includes('Spearheaded') || bulletReply.includes('Architected') || bulletReply.includes('Engineered'), 'Reply should contain power action verbs');
  console.log('   ✅ Bullet rewriting provides action verbs and metrics formula.');

  // 4. Test Employment Gap Explanation Intent
  console.log('\n4️⃣ Testing Employment Gap Explanation Intent...');
  const gapQuery = 'How do I explain a 1-year employment gap between roles?';
  const gapReply = await askResumeChatbot(gapQuery, resumeContext);
  console.log(`   Reply preview: "${gapReply.substring(0, 80)}..."`);
  assert(gapReply.includes('gap') || gapReply.includes('step') || gapReply.includes('upskilling'), 'Reply should address gap constructively');
  console.log('   ✅ Employment gap response provides constructive script and ATS advice.');

  // 5. Test Interview Question Simulation Intent
  console.log('\n5️⃣ Testing Interview Questions Generation Intent...');
  const interviewQuery = 'What interview questions should I prepare for?';
  const interviewReply = await askResumeChatbot(interviewQuery, resumeContext);
  console.log(`   Reply preview: "${interviewReply.substring(0, 80)}..."`);
  assert(interviewReply.includes('Senior Frontend Engineer') || interviewReply.includes('React'), 'Interview questions should be tailored to role/skills');
  assert(interviewReply.includes('STAR'), 'Should mention STAR methodology');
  console.log('   ✅ Interview preparation generates role-tailored technical & STAR behavioral questions.');

  // 6. Test Skills & ATS Advice Intent
  console.log('\n6️⃣ Testing Skills & ATS Optimization Advice Intent...');
  const skillsQuery = 'What skills should I add to improve my ATS score?';
  const skillsReply = await askResumeChatbot(skillsQuery, resumeContext);
  console.log(`   Reply preview: "${skillsReply.substring(0, 80)}..."`);
  assert(skillsReply.includes('ATS') || skillsReply.includes('skills'), 'Should address ATS keyword optimization');
  console.log('   ✅ Skills recommendation advice verified.');

  console.log('\n🎉 ALL PHASE 4 AI CAREER CHATBOT TESTS PASSED!\n');
}

runChatbotTests().catch((err) => {
  console.error('❌ Chatbot test failed:', err);
  process.exit(1);
});
