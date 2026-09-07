import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SiteConfigContext = createContext();

export const DEFAULT_SITE_CONTENT = {
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
};

export const DEFAULT_THEME_CONFIG = {
  defaultMode: 'light',
  preset: 'default',
  accentColor: '#2563EB',
  radius: '10px'
};

export const SiteConfigProvider = ({ children }) => {
  const [content, setContent] = useState(() => {
    try {
      const cached = localStorage.getItem('resumax_site_content');
      return cached ? JSON.parse(cached) : DEFAULT_SITE_CONTENT;
    } catch (e) {
      return DEFAULT_SITE_CONTENT;
    }
  });

  const [themeConfig, setThemeConfig] = useState(() => {
    try {
      const cached = localStorage.getItem('resumax_admin_theme');
      return cached ? JSON.parse(cached) : DEFAULT_THEME_CONFIG;
    } catch (e) {
      return DEFAULT_THEME_CONFIG;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fetch live settings from backend
  const refreshConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      const [contentRes, themeRes] = await Promise.allSettled([
        fetch('/api/admin/content'),
        fetch('/api/admin/theme')
      ]);

      if (contentRes.status === 'fulfilled' && contentRes.value.ok) {
        const contentData = await contentRes.value.json();
        setContent((prev) => {
          const merged = { ...prev, ...contentData };
          localStorage.setItem('resumax_site_content', JSON.stringify(merged));
          return merged;
        });
      }

      if (themeRes.status === 'fulfilled' && themeRes.value.ok) {
        const themeData = await themeRes.value.json();
        setThemeConfig((prev) => {
          const merged = { ...prev, ...themeData };
          localStorage.setItem('resumax_admin_theme', JSON.stringify(merged));
          return merged;
        });
      }
    } catch (err) {
      console.warn('Unable to sync live site config with backend, utilizing cached/default config:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshConfig();
  }, [refreshConfig]);

  // Apply theme preset to root document
  useEffect(() => {
    if (themeConfig?.preset) {
      document.documentElement.setAttribute('data-theme-preset', themeConfig.preset);
    }
    if (themeConfig?.accentColor) {
      document.documentElement.style.setProperty('--accent', themeConfig.accentColor);
    }
  }, [themeConfig]);

  // Update content live
  const updateContentLive = async (newContent) => {
    setContent(newContent);
    localStorage.setItem('resumax_site_content', JSON.stringify(newContent));
    try {
      await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent)
      });
    } catch (e) {
      console.warn('Failed to sync content to server:', e);
    }
  };

  // Update theme live
  const updateThemeLive = async (newTheme) => {
    setThemeConfig(newTheme);
    localStorage.setItem('resumax_admin_theme', JSON.stringify(newTheme));
    try {
      await fetch('/api/admin/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTheme)
      });
    } catch (e) {
      console.warn('Failed to sync theme to server:', e);
    }
  };

  // Helper to record analytics event
  const recordEvent = async (eventType, details = {}) => {
    try {
      await fetch('/api/admin/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, details })
      });
    } catch (e) {
      // Non-blocking
    }
  };

  return (
    <SiteConfigContext.Provider
      value={{
        content,
        themeConfig,
        isLoading,
        refreshConfig,
        updateContentLive,
        updateThemeLive,
        recordEvent
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};
