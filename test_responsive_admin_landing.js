import assert from 'node:assert';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import app from './server/server.js';
import { getAdminStore, saveAdminStore, recordAnalyticsEvent } from './server/adminService.js';

console.log('================================================================');
console.log('🧪 TESTING RESPONSIVENESS, ADMIN PANEL & WELCOME SCREEN');
console.log('================================================================\n');

const TEST_PORT = 5088;
let server;

async function runTests() {
  try {
    // Start backend server
    await new Promise((resolve) => {
      server = app.listen(TEST_PORT, () => {
        console.log(`📡 Test server running on http://localhost:${TEST_PORT}`);
        resolve();
      });
    });

    const baseUrl = `http://localhost:${TEST_PORT}`;

    // ------------------------------------------------------------------------
    // 1. Test Admin Login Endpoint (POST /api/admin/login)
    // ------------------------------------------------------------------------
    console.log('1️⃣ Testing Admin Authentication...');

    // Successful login
    const loginRes = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@resumax.com', password: 'admin123' })
    });
    assert.strictEqual(loginRes.status, 200, 'Admin login should return status 200');
    const loginData = await loginRes.json();
    assert.strictEqual(loginData.success, true, 'loginData.success should be true');
    assert.strictEqual(loginData.user.role, 'admin', 'User role must be admin');
    assert(loginData.user.token, 'Admin session must include token');
    console.log('   ✅ Valid admin login succeeded with role "admin".');

    // Invalid credentials rejected
    const badLoginRes = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@resumax.com', password: 'wrongpassword' })
    });
    assert.strictEqual(badLoginRes.status, 401, 'Bad credentials should return status 401');
    console.log('   ✅ Unauthorized admin attempt correctly rejected with 401.');

    // ------------------------------------------------------------------------
    // 2. Test Admin Stats & Analytics (GET /api/admin/stats)
    // ------------------------------------------------------------------------
    console.log('\n2️⃣ Testing Admin Analytics Dashboard Data...');
    const statsRes = await fetch(`${baseUrl}/api/admin/stats`);
    assert.strictEqual(statsRes.status, 200, 'Stats endpoint should return 200');
    const statsData = await statsRes.json();
    assert(statsData.analytics, 'Stats response should include analytics');
    assert(typeof statsData.analytics.totalResumesCreated === 'number', 'totalResumesCreated should be a number');
    assert(typeof statsData.analytics.resumesToday === 'number', 'resumesToday should be a number');
    assert(typeof statsData.analytics.resumesThisWeek === 'number', 'resumesThisWeek should be a number');
    assert(typeof statsData.registeredUsersCount === 'number', 'registeredUsersCount should be a number');
    console.log(`   ✅ Analytics stats verified: ${statsData.analytics.totalResumesCreated} resumes created, ${statsData.registeredUsersCount} registered users.`);

    // ------------------------------------------------------------------------
    // 3. Test Analytics Event Tracking (POST /api/admin/event)
    // ------------------------------------------------------------------------
    console.log('\n3️⃣ Testing Analytics Event Ingestion...');
    const initialCreated = statsData.analytics.totalResumesCreated;
    const eventRes = await fetch(`${baseUrl}/api/admin/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'resume_created', details: { templateId: 'ats-pro' } })
    });
    assert.strictEqual(eventRes.status, 200, 'Event endpoint should return 200');
    const eventData = await eventRes.json();
    assert.strictEqual(eventData.analytics.totalResumesCreated, initialCreated + 1, 'Resume count should increment by 1');
    console.log(`   ✅ Event recorded successfully: totalResumesCreated incremented to ${eventData.analytics.totalResumesCreated}.`);

    // ------------------------------------------------------------------------
    // 4. Test Live Content Management (GET/PUT /api/admin/content)
    // ------------------------------------------------------------------------
    console.log('\n4️⃣ Testing Live Content Management & Persistence...');
    const getContRes = await fetch(`${baseUrl}/api/admin/content`);
    assert.strictEqual(getContRes.status, 200, 'GET /api/admin/content should return 200');
    const originalContent = await getContRes.json();
    assert(originalContent.hero, 'Content should include hero section');
    assert(originalContent.announcementBanner, 'Content should include announcementBanner');

    const updatedTagline = 'Build your resume smarter with AI (Updated Test)';
    const putContRes = await fetch(`${baseUrl}/api/admin/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hero: {
          ...originalContent.hero,
          welcomeTagline: updatedTagline
        }
      })
    });
    assert.strictEqual(putContRes.status, 200, 'PUT /api/admin/content should return 200');
    const updatedContent = await putContRes.json();
    assert.strictEqual(updatedContent.content.hero.welcomeTagline, updatedTagline, 'Updated tagline must match payload');

    // Restore original content
    await fetch(`${baseUrl}/api/admin/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(originalContent)
    });
    console.log('   ✅ Live content updates and roundtrip persistence verified.');

    // ------------------------------------------------------------------------
    // 5. Test Site-Wide Theme Settings (GET/PUT /api/admin/theme)
    // ------------------------------------------------------------------------
    console.log('\n5️⃣ Testing Site-Wide Theme Preset Controls...');
    const getThemeRes = await fetch(`${baseUrl}/api/admin/theme`);
    assert.strictEqual(getThemeRes.status, 200, 'GET /api/admin/theme should return 200');
    const originalTheme = await getThemeRes.json();

    const putThemeRes = await fetch(`${baseUrl}/api/admin/theme`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        preset: 'emerald',
        accentColor: '#059669',
        defaultMode: 'dark'
      })
    });
    assert.strictEqual(putThemeRes.status, 200, 'PUT /api/admin/theme should return 200');
    const themeData = await putThemeRes.json();
    assert.strictEqual(themeData.theme.preset, 'emerald', 'Theme preset should be emerald');
    assert.strictEqual(themeData.theme.accentColor, '#059669', 'Accent color should match');

    // Restore original theme
    await fetch(`${baseUrl}/api/admin/theme`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(originalTheme)
    });
    console.log('   ✅ Site-wide theme preset update verified.');

    // ------------------------------------------------------------------------
    // 6. Test User Directory (GET /api/admin/users)
    // ------------------------------------------------------------------------
    console.log('\n6️⃣ Testing User Directory Management...');
    const usersRes = await fetch(`${baseUrl}/api/admin/users`);
    assert.strictEqual(usersRes.status, 200, 'Users endpoint should return 200');
    const usersData = await usersRes.json();
    assert(Array.isArray(usersData.users), 'Users data should be an array');
    assert(usersData.users.length > 0, 'Users list should not be empty');
    assert(usersData.users.some((u) => u.role === 'admin'), 'At least one user must have admin role');
    console.log(`   ✅ User directory verified with ${usersData.users.length} registered accounts.`);

    // ------------------------------------------------------------------------
    // 7. Verify Frontend Component Code Requirements
    // ------------------------------------------------------------------------
    console.log('\n7️⃣ Verifying Frontend Code Architecture Requirements...');

    // Welcome screen file (simplified minimal landing page)
    const welcomeSrc = fs.readFileSync(path.resolve('./src/pages/WelcomeScreen.jsx'), 'utf-8');
    assert(welcomeSrc.includes('welcome-screen-container'), 'Welcome screen must have container class');
    assert(welcomeSrc.includes('welcome-cursive-heading'), 'Welcome screen must have cursive handwriting heading');
    assert(welcomeSrc.includes('welcome-pulse-icon'), 'Welcome screen must have small animated icon');
    assert(welcomeSrc.includes('welcome-top-left-logo'), 'Welcome screen must have top-left logo container');
    assert(welcomeSrc.includes('welcome-brand-logo-img'), 'Welcome screen must have top-left logo image');
    assert(welcomeSrc.includes('DISPLAY_DELAY_MS = 3000'), 'Welcome screen must have 3s timer delay');
    console.log('   ✅ WelcomeScreen component satisfies standalone minimal requirements with top-left logo.');

    // App.jsx standalone welcome verification (no navbar or banner on welcome screen)
    const appSrc = fs.readFileSync(path.resolve('./src/App.jsx'), 'utf-8');
    assert(appSrc.includes("currentPage !== 'welcome'"), 'App.jsx must exclude navbar/banner from welcome page');
    console.log('   ✅ App.jsx verified: navbar and announcement banner hidden on landing page.');

    // Navbar responsive structure & Task 3 verification (no Admin link in navbar)
    const navbarSrc = fs.readFileSync(path.resolve('./src/components/layout/Navbar.jsx'), 'utf-8');
    assert(navbarSrc.includes('mobile-hamburger-btn'), 'Navbar must have mobile hamburger toggle');
    assert(navbarSrc.includes('mobile-nav-drawer'), 'Navbar must have collapsible mobile navigation drawer');
    assert(!navbarSrc.includes('>Admin<') && !navbarSrc.includes('Admin Panel'), 'Navbar must not contain visible Admin link');
    console.log('   ✅ Navbar verified: responsive hamburger present and Admin link removed from main navigation.');

    // Admin Panel structure
    const adminSrc = fs.readFileSync(path.resolve('./src/pages/AdminPanel.jsx'), 'utf-8');
    assert(adminSrc.includes('admin-page-layout'), 'AdminPanel must have layout');
    assert(adminSrc.includes('Dashboard & Analytics'), 'AdminPanel must include Analytics dashboard');
    assert(adminSrc.includes('Content & Components'), 'AdminPanel must include Content management');
    assert(adminSrc.includes('Site-Wide Theme'), 'AdminPanel must include Theme switcher');
    assert(adminSrc.includes('User Directory'), 'AdminPanel must include Users directory');
    console.log('   ✅ AdminPanel component satisfies all Task 2 requirements.');

    // index.css responsive breakpoints
    const cssSrc = fs.readFileSync(path.resolve('./src/index.css'), 'utf-8');
    assert(cssSrc.includes('@media (max-width: 480px)'), 'index.css must include mobile breakpoint (<= 480px)');
    assert(cssSrc.includes('@media (max-width: 768px)'), 'index.css must include tablet breakpoint (<= 768px)');
    assert(cssSrc.includes('@media (min-width: 769px)'), 'index.css must include desktop breakpoint (769px+)');
    assert(cssSrc.includes('[data-theme-preset="emerald"]'), 'index.css must include Emerald theme preset');
    assert(cssSrc.includes('[data-theme-preset="violet"]'), 'index.css must include Violet theme preset');
    console.log('   ✅ index.css includes all required mobile/tablet/desktop breakpoints and theme presets.');

    console.log('\n================================================================');
    console.log('🎉 ALL RESPONSIVENESS, ADMIN PANEL & LANDING TESTS PASSED!');
    console.log('================================================================\n');

  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
  }
}

runTests();
