// Automated verification script for Resumax Phase 6: Real AI Backend & Gemini Integration
import assert from 'node:assert';
import http from 'node:http';
import app from './server/server.js';

console.log('🧪 Running Resumax Phase 6 AI Backend & API Verification Suite...\n');

const TEST_PORT = 5055;
let server;

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
        }
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(rawData);
            resolve({ statusCode: res.statusCode, data: parsed });
          } catch (e) {
            resolve({ statusCode: res.statusCode, raw: rawData });
          }
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runPhase6Tests() {
  // Start test server
  await new Promise((resolve) => {
    server = app.listen(TEST_PORT, () => {
      console.log(`   Test server running on port ${TEST_PORT}`);
      resolve();
    });
  });

  try {
    // 1. Test Health Check Endpoint
    console.log('\n1️⃣ Testing GET /api/health...');
    const healthRes = await makeRequest('/api/health');
    assert.strictEqual(healthRes.statusCode, 200, 'Health endpoint must return 200');
    assert.strictEqual(healthRes.data.status, 'healthy', 'Status must be healthy');
    console.log(`   ✅ /api/health passed: status=${healthRes.data.status}, service="${healthRes.data.service}"`);

    // 2. Test Resume Generation Endpoint
    console.log('\n2️⃣ Testing POST /api/resume/generate...');
    const resumePayload = {
      fullName: 'Alex Morgan',
      targetJobTitle: 'Senior Frontend Engineer',
      skills: ['React', 'TypeScript', 'Next.js', 'REST APIs', 'System Architecture'],
      experience: [
        {
          id: 1,
          role: 'Senior Software Engineer',
          company: 'TechFlow Solutions',
          duration: '2022 – Present',
          achievements: 'Led frontend refactor and improved Core Web Vitals'
        }
      ]
    };

    const genRes = await makeRequest('/api/resume/generate', 'POST', resumePayload);
    assert.strictEqual(genRes.statusCode, 200, 'Resume generate must return 200');
    assert(genRes.data.summary && genRes.data.summary.length > 20, 'Must return summary');
    assert(genRes.data.experience && genRes.data.experience.length > 0, 'Must return experience');
    assert(genRes.data.experience[0].generatedBullets.length > 0, 'Must return enhanced bullets');
    console.log(`   Summary Preview: "${genRes.data.summary.substring(0, 75)}..."`);
    console.log(`   Generated Bullet: "${genRes.data.experience[0].generatedBullets[0]}"`);
    console.log('   ✅ /api/resume/generate passed.');

    // 3. Test ATS Check Endpoint
    console.log('\n3️⃣ Testing POST /api/ats/check...');
    const atsPayload = {
      resumeData: resumePayload,
      jobDescription: 'Looking for a Senior Frontend Engineer proficient in React, TypeScript, Next.js, and CI/CD pipelines.'
    };

    const atsRes = await makeRequest('/api/ats/check', 'POST', atsPayload);
    assert.strictEqual(atsRes.statusCode, 200, 'ATS check must return 200');
    assert(Array.isArray(atsRes.data.matchedKeywords), 'Matched keywords must be an array');
    assert(Array.isArray(atsRes.data.missingKeywords), 'Missing keywords must be an array');
    assert(typeof atsRes.data.actionVerbsScore === 'number', 'Action verbs score must be number');
    console.log(`   Matched: ${atsRes.data.matchedKeywords.join(', ')}`);
    console.log(`   Missing: ${atsRes.data.missingKeywords.join(', ')}`);
    console.log(`   Action Verbs Score: ${atsRes.data.actionVerbsScore}%`);
    console.log('   ✅ /api/ats/check passed.');

    // 4. Test Career Chatbot Endpoint
    console.log('\n4️⃣ Testing POST /api/chatbot/message...');
    const chatPayload = {
      message: 'How do I best explain a 6-month employment gap between roles?',
      resumeContext: resumePayload,
      chatHistory: []
    };

    const chatRes = await makeRequest('/api/chatbot/message', 'POST', chatPayload);
    assert.strictEqual(chatRes.statusCode, 200, 'Chatbot message must return 200');
    assert(chatRes.data.reply && chatRes.data.reply.length > 20, 'Must return a detailed reply');
    console.log(`   AI Advisor Reply: "${chatRes.data.reply.substring(0, 90)}..."`);
    console.log('   ✅ /api/chatbot/message passed.');

    console.log('\n🎉 ALL PHASE 6 REAL AI BACKEND TESTS PASSED!\n');
    process.exit(0);
  } finally {
    if (server) {
      server.close();
    }
  }
}

runPhase6Tests().catch((err) => {
  console.error('❌ Phase 6 Test Failed:', err);
  if (server) server.close();
  process.exit(1);
});
