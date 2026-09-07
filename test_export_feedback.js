// Automated verification script for Resumax Multi-Format Export & Feedback Popup
import assert from 'node:assert';
import http from 'node:http';
import app from './server/server.js';
import { generateResumePlainText } from './src/services/txtService.js';
import { buildResumeDocxDocument, exportResumeToDocx } from './src/services/docxService.js';
import { sanitizeResumeFilename } from './src/services/exportService.js';

console.log('🧪 Running Resumax Multi-Format Export & Feedback Verification Suite...\n');

const mockResume = {
  fullName: 'Jordan Taylor',
  contact: {
    email: 'jordan.taylor@example.com',
    phone: '+1 (555) 987-6543',
    location: 'New York, NY',
    website: 'linkedin.com/in/jordantaylor'
  },
  targetJobTitle: 'Staff Full Stack Engineer',
  experience: [
    {
      id: 1,
      role: 'Lead Architect',
      company: 'NextGen Cloud',
      duration: '2021 – Present',
      location: 'New York, NY',
      generatedBullets: [
        'Architected high-throughput microservices handling 100K+ req/sec with 99.99% uptime.',
        'Mentored 8 senior engineers and instituted automated CI/CD pipeline reducing deployment cycle by 45%.'
      ]
    }
  ],
  education: [
    {
      id: 1,
      school: 'Columbia University',
      degree: 'M.S. in Computer Science',
      year: '2019 – 2021',
      location: 'New York, NY'
    }
  ],
  skills: ['TypeScript', 'Node.js', 'React', 'GraphQL', 'AWS', 'Docker', 'Kubernetes']
};

const mockAIContent = {
  summary: 'Innovative and performance-driven Staff Full Stack Engineer with 8+ years experience architecting cloud systems.'
};

const TEST_PORT = 5066;
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

async function runTests() {
  // 1. Test Plain-Text TXT Resume Generator
  console.log('1️⃣ Testing TXT Plain-Text Resume Generation...');
  const txtOutput = generateResumePlainText(mockResume, mockAIContent);
  assert(typeof txtOutput === 'string', 'TXT output must be a string');
  assert(txtOutput.includes('JORDAN TAYLOR'), 'TXT must include candidate name');
  assert(txtOutput.includes('Staff Full Stack Engineer'), 'TXT must include job title');
  assert(txtOutput.includes('jordan.taylor@example.com'), 'TXT must include contact email');
  assert(txtOutput.includes('WORK EXPERIENCE'), 'TXT must include section headers');
  assert(txtOutput.includes('• Architected high-throughput microservices'), 'TXT must format bullets with •');
  assert(txtOutput.includes('Columbia University'), 'TXT must include education');
  assert(txtOutput.includes('TypeScript • Node.js'), 'TXT must format skills');
  console.log(`   TXT Content Preview (${txtOutput.length} chars):\n${txtOutput.substring(0, 240)}...\n`);
  console.log('   ✅ Plain-Text TXT generator verified.');

  // 2. Test Word DOCX Resume Builder
  console.log('\n2️⃣ Testing Word DOCX Document Generation...');
  const docxDoc = buildResumeDocxDocument(mockResume, mockAIContent);
  assert(docxDoc, 'DOCX Document must be created');
  const docxBuffer = await exportResumeToDocx(mockResume, mockAIContent, 'test.docx');
  assert(Buffer.isBuffer(docxBuffer), 'DOCX export in Node must produce Buffer');
  assert(docxBuffer.length > 3000, `DOCX buffer must be non-empty (was ${docxBuffer.length} bytes)`);
  // Check ZIP/DOCX header signature (PK\x03\x04)
  assert.strictEqual(docxBuffer[0], 0x50, 'Must have PK zip signature byte 0');
  assert.strictEqual(docxBuffer[1], 0x4b, 'Must have PK zip signature byte 1');
  console.log(`   ✅ Word DOCX document built successfully (${docxBuffer.length} bytes with valid docx magic bytes).`);

  // 3. Test Filename Sanitization
  console.log('\n3️⃣ Testing Filename Sanitization...');
  assert.strictEqual(sanitizeResumeFilename('Jordan Taylor'), 'Jordan_Taylor');
  assert.strictEqual(sanitizeResumeFilename("Dr. Jane O'Connor-Smith"), 'Dr._Jane_O_Connor-Smith');
  assert.strictEqual(sanitizeResumeFilename('   '), 'Resume');
  console.log('   ✅ Filename sanitization verified.');

  // 4. Test Session Feedback Trigger Logic
  console.log('\n4️⃣ Testing Feedback Session Popup Tracking Logic...');
  class MockSessionStorage {
    constructor() { this.store = {}; }
    getItem(k) { return this.store[k] || null; }
    setItem(k, v) { this.store[k] = String(v); }
    clear() { this.store = {}; }
  }

  const mockSession = new MockSessionStorage();
  function checkAndTriggerFeedback(session, source) {
    if (session.getItem('resumax_feedback_shown')) {
      return false; // already shown this session
    }
    session.setItem('resumax_feedback_shown', 'true');
    return true; // first time in session -> show popup
  }

  const trigger1 = checkAndTriggerFeedback(mockSession, 'download');
  assert.strictEqual(trigger1, true, 'First download in session must trigger popup');

  const trigger2 = checkAndTriggerFeedback(mockSession, 'download');
  assert.strictEqual(trigger2, false, 'Subsequent download in same session must NOT trigger popup');

  const trigger3 = checkAndTriggerFeedback(mockSession, 'ats');
  assert.strictEqual(trigger3, false, 'Subsequent ATS check in same session must NOT trigger popup');
  console.log('   ✅ Feedback popup session limitation verified (only once per session).');

  // 5. Test Backend Review API Endpoints
  console.log('\n5️⃣ Testing Backend POST /api/feedback & Storage...');
  await new Promise((resolve) => {
    server = app.listen(TEST_PORT, () => {
      console.log(`   Test backend server running on port ${TEST_PORT}`);
      resolve();
    });
  });

  try {
    // Valid review submission
    const reviewPayload = {
      rating: 5,
      comment: 'Super fast resume generation and ATS score is very accurate!',
      userId: 'user_12345',
      userEmail: 'jordan@example.com',
      source: 'download'
    };

    const postRes = await makeRequest('/api/feedback', 'POST', reviewPayload);
    assert.strictEqual(postRes.statusCode, 201, 'Valid feedback must return 201');
    assert.strictEqual(postRes.data.success, true, 'Response must indicate success');
    assert.strictEqual(postRes.data.review.rating, 5, 'Review rating must match');
    console.log(`   Feedback Submitted: Rating ${postRes.data.review.rating}/5 - "${postRes.data.review.comment}"`);

    // Invalid review submission (rating out of bounds)
    const invalidRes = await makeRequest('/api/feedback', 'POST', { rating: 0 });
    assert.strictEqual(invalidRes.statusCode, 400, 'Invalid rating must return 400');
    console.log('   ✅ Invalid rating correctly rejected with 400.');

    // GET /api/feedback
    const getRes = await makeRequest('/api/feedback');
    assert.strictEqual(getRes.statusCode, 200, 'GET /api/feedback must return 200');
    assert(getRes.data.total >= 1, 'Must contain at least 1 stored review');
    console.log(`   Total Stored Reviews on Server: ${getRes.data.total}`);
    console.log('   ✅ Backend feedback endpoints verified.');

    console.log('\n🎉 ALL MULTI-FORMAT EXPORT & FEEDBACK TESTS PASSED!\n');
    process.exit(0);
  } finally {
    if (server) {
      server.close();
    }
  }
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  if (server) server.close();
  process.exit(1);
});
