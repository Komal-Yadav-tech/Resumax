import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check saved preference in localStorage
    const savedTheme = localStorage.getItem('resumax_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Fall back to system preference
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [themePreset, setThemePreset] = useState(() => {
    try {
      const saved = localStorage.getItem('resumax_admin_theme');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.preset || 'default';
      }
    } catch (e) {}
    return 'default';
  });

  useEffect(() => {
    // Apply theme attribute to html/root element
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('resumax_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme-preset', themePreset);
  }, [themePreset]);

  // Listen for system color-scheme changes if user hasn't manually set preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      const saved = localStorage.getItem('resumax_theme_manual');
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  }, []);

  const toggleTheme = () => {
    localStorage.setItem('resumax_theme_manual', 'true');
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme, themePreset, setThemePreset }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
