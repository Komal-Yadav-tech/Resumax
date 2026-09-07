import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'adminStore.json');

const DEFAULT_STORE = {
  adminCredentials: {
    email: 'admin@resumax.com',
    password: 'admin123',
    name: 'Resumax Administrator',
    role: 'admin'
  },
  analytics: {
    totalResumesCreated: 142,
    totalResumesCompleted: 128,
    totalRegisteredUsers: 156,
    resumesToday: 14,
    resumesThisWeek: 67,
    resumesThisMonth: 142,
    popularTemplates: {
      classic: 52,
      'ats-pro': 41,
      modern: 28,
      minimal: 15,
      other: 6
    },
    lastUpdated: new Date().toISOString()
  },
  content: {
    hero: {
      welcomeHeading: 'Welcome to Resumax',
      welcomeTagline: 'Build your resume smarter with AI',
      badgeText: 'Unlimited & 100% Free AI Career Toolkit',
      dashboardHeading: 'Welcome back',
      dashboardSubtext: 'Ready to land your dream role? Answer a few guided questions to generate a tailored, ATS-ready resume or evaluate your existing resume with AI scoring.'
    },
    features: {
      builderTitle: 'AI Resume Builder',
      builderDesc: 'Answer simple step-by-step questions. Our AI drafts impactful bullet points, summary, and formats it automatically.',
      atsTitle: 'ATS Strength Checker',
      atsDesc: 'Get a 0–100 score, discover missing job keywords, and receive actionable fixes to beat applicant tracking systems.',
      advisorTitle: 'AI Career Advisor',
      advisorDesc: 'Ask tailored questions about career pivots, explaining employment gaps, interview prep, and bullet point polishing.'
    },
    announcementBanner: {
      enabled: true,
      text: '✨ Pro Tip: Over 12 modern and ATS-optimized resume templates now available for free download!',
      linkText: 'Try Templates',
      linkTarget: 'templates'
    },
    pricing: {
      title: '100% Free Forever',
      subtitle: 'No paywalls, no hidden watermarks, no credit card required.',
      highlightBadge: 'Community Edition',
      features: [
        'Unlimited AI Resume Generation',
        'Multi-Format Exports (PDF, DOCX, TXT)',
        '12 ATS-Compliant Layouts',
        '24/7 AI Career Advisor'
      ]
    },
    footer: {
      copyrightText: '© 2026 Resumax. Open & Accessible AI Career Tools for Everyone.',
      companyTagline: 'Empowering job seekers worldwide with intelligent career automation.'
    }
  },
  theme: {
    defaultMode: 'light', // 'light' | 'dark' | 'system'
    preset: 'default', // 'default' | 'emerald' | 'violet' | 'sunset' | 'ocean'
    accentColor: '#2563EB',
    radius: '10px'
  },
  users: [
    {
      uid: 'user_admin_01',
      email: 'admin@resumax.com',
      displayName: 'System Administrator',
      role: 'admin',
      resumesCount: 12,
      createdAt: '2026-01-15T08:30:00.000Z'
    },
    {
      uid: 'user_demo_default',
      email: 'demo@resumax.com',
      displayName: 'Alex Morgan',
      role: 'user',
      resumesCount: 3,
      createdAt: '2026-02-01T10:15:00.000Z'
    },
    {
      uid: 'user_sarah_99',
      email: 'sarah.connor@example.com',
      displayName: 'Sarah Connor',
      role: 'user',
      resumesCount: 5,
      createdAt: '2026-02-14T14:20:00.000Z'
    },
    {
      uid: 'user_marcus_dev',
      email: 'marcus.vance@example.com',
      displayName: 'Marcus Vance',
      role: 'user',
      resumesCount: 2,
      createdAt: '2026-03-01T11:45:00.000Z'
    }
  ]
};

// Read store from JSON file or create initial file
export const getAdminStore = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_STORE, null, 2), 'utf-8');
      return DEFAULT_STORE;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STORE,
      ...parsed,
      analytics: { ...DEFAULT_STORE.analytics, ...(parsed.analytics || {}) },
      content: {
        ...DEFAULT_STORE.content,
        ...(parsed.content || {}),
        hero: { ...DEFAULT_STORE.content.hero, ...(parsed.content?.hero || {}) },
        features: { ...DEFAULT_STORE.content.features, ...(parsed.content?.features || {}) },
        announcementBanner: { ...DEFAULT_STORE.content.announcementBanner, ...(parsed.content?.announcementBanner || {}) },
        pricing: { ...DEFAULT_STORE.content.pricing, ...(parsed.content?.pricing || {}) },
        footer: { ...DEFAULT_STORE.content.footer, ...(parsed.content?.footer || {}) }
      },
      theme: { ...DEFAULT_STORE.theme, ...(parsed.theme || {}) }
    };
  } catch (error) {
    console.error('Error reading adminStore.json, returning default store:', error);
    return DEFAULT_STORE;
  }
};

// Save store to JSON file
export const saveAdminStore = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving adminStore.json:', error);
    return false;
  }
};

// Record an analytics event
export const recordAnalyticsEvent = (eventType, details = {}) => {
  const store = getAdminStore();
  const { analytics } = store;

  if (eventType === 'resume_created') {
    analytics.totalResumesCreated = (analytics.totalResumesCreated || 0) + 1;
    analytics.resumesToday = (analytics.resumesToday || 0) + 1;
    analytics.resumesThisWeek = (analytics.resumesThisWeek || 0) + 1;
    analytics.resumesThisMonth = (analytics.resumesThisMonth || 0) + 1;
    if (details.templateId) {
      analytics.popularTemplates = analytics.popularTemplates || {};
      const key = details.templateId in analytics.popularTemplates ? details.templateId : 'other';
      analytics.popularTemplates[key] = (analytics.popularTemplates[key] || 0) + 1;
    }
  } else if (eventType === 'resume_completed') {
    analytics.totalResumesCompleted = (analytics.totalResumesCompleted || 0) + 1;
  } else if (eventType === 'user_registered') {
    analytics.totalRegisteredUsers = (analytics.totalRegisteredUsers || 0) + 1;
    if (details.user) {
      store.users = store.users || [];
      if (!store.users.some(u => u.email?.toLowerCase() === details.user.email?.toLowerCase())) {
        store.users.push({
          uid: details.user.uid || `user_${Date.now()}`,
          email: details.user.email,
          displayName: details.user.displayName || details.user.email.split('@')[0],
          role: 'user',
          resumesCount: 0,
          createdAt: new Date().toISOString()
        });
      }
    }
  }

  analytics.lastUpdated = new Date().toISOString();
  saveAdminStore(store);
  return analytics;
};
