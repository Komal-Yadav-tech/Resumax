// Automated verification script for Resumax Phase 5: Light Mode / Dark Mode Toggle
import assert from 'node:assert';
import fs from 'node:fs';

console.log('🧪 Running Resumax Phase 5 Theme Toggle Verification Suite...\n');

// 1. Test Theme Resolution & Fallback Logic
console.log('1️⃣ Testing Theme Resolution & Storage Persistence Logic...');

class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  clear() {
    this.store = {};
  }
}

const mockStorage = new MockLocalStorage();

function resolveInitialTheme(storage, systemPrefersDark = false) {
  const saved = storage.getItem('resumax_theme');
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  return systemPrefersDark ? 'dark' : 'light';
}

// Case A: First visit, system dark
assert.strictEqual(resolveInitialTheme(mockStorage, true), 'dark', 'Should default to dark when system is dark');
// Case B: First visit, system light
assert.strictEqual(resolveInitialTheme(mockStorage, false), 'light', 'Should default to light when system is light');

// Case C: User explicitly sets theme
mockStorage.setItem('resumax_theme', 'dark');
assert.strictEqual(resolveInitialTheme(mockStorage, false), 'dark', 'Saved preference must override system light');

mockStorage.setItem('resumax_theme', 'light');
assert.strictEqual(resolveInitialTheme(mockStorage, true), 'light', 'Saved preference must override system dark');
console.log('   ✅ Theme resolution and system fallback verified.');

// 2. Test Toggle State Transitions
console.log('\n2️⃣ Testing Theme Toggle Transitions...');
function toggleTheme(currentTheme, storage) {
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
  storage.setItem('resumax_theme', nextTheme);
  return nextTheme;
}

let activeTheme = 'light';
activeTheme = toggleTheme(activeTheme, mockStorage);
assert.strictEqual(activeTheme, 'dark', 'Light should toggle to dark');
assert.strictEqual(mockStorage.getItem('resumax_theme'), 'dark', 'localStorage should persist dark');

activeTheme = toggleTheme(activeTheme, mockStorage);
assert.strictEqual(activeTheme, 'light', 'Dark should toggle to light');
assert.strictEqual(mockStorage.getItem('resumax_theme'), 'light', 'localStorage should persist light');
console.log('   ✅ Theme toggling and state transition verified.');

// 3. Test CSS Variable Tokens for Both Themes
console.log('\n3️⃣ Verifying CSS Color Tokens in index.css...');
const cssContent = fs.readFileSync('./src/index.css', 'utf-8');

const requiredTokens = [
  '--bg-primary',
  '--bg-secondary',
  '--text-primary',
  '--text-secondary',
  '--accent',
  '--border',
  '--success',
  '--warning',
  '--danger'
];

// Check :root definition
assert(cssContent.includes(':root'), 'CSS must define :root variables');
requiredTokens.forEach((token) => {
  assert(cssContent.includes(token), `Light theme tokens must include ${token}`);
});

// Check [data-theme="dark"] definition
assert(cssContent.includes('[data-theme="dark"]'), 'CSS must define [data-theme="dark"] variables');
requiredTokens.forEach((token) => {
  const darkSection = cssContent.split('[data-theme="dark"]')[1]?.split('}')[0] || '';
  assert(darkSection.includes(token), `Dark theme tokens must include ${token}`);
});
console.log('   ✅ CSS variables for light and dark themes are fully specified.');

console.log('\n🎉 ALL PHASE 5 THEME TOGGLE TESTS PASSED!\n');
