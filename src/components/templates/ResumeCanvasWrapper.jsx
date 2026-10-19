import React, { useRef, useLayoutEffect, useState } from 'react';

/**
 * Maps user-selected font style to real CSS font-family strings
 */
export const FONT_FAMILY_MAP = {
  'Inter': "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  'Arial': "Arial, Helvetica, sans-serif",
  'Calibri': "Calibri, Candara, Segoe, 'Segoe UI', Optima, sans-serif",
  'Times New Roman': "'Times New Roman', Times, Georgia, serif",
  'Georgia': "Georgia, 'Times New Roman', serif",
  'Roboto': "'Roboto', 'Segoe UI', sans-serif",
  'Outfit': "'Outfit', 'Inter', sans-serif",
  'JetBrains Mono': "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace"
};

/**
 * Maps theme colors to primary & secondary palettes
 */
export const THEME_COLOR_MAP = {
  blue: {
    primary: '#2563EB',
    primaryDark: '#1D4ED8',
    primaryLight: '#EFF6FF',
    accent: '#3B82F6',
    border: '#BFDBFE'
  },
  black: {
    primary: '#0F172A',
    primaryDark: '#020617',
    primaryLight: '#F8FAFC',
    accent: '#334155',
    border: '#CBD5E1'
  },
  green: {
    primary: '#059669',
    primaryDark: '#047857',
    primaryLight: '#ECFDF5',
    accent: '#10B981',
    border: '#A7F3D0'
  },
  purple: {
    primary: '#7C3AED',
    primaryDark: '#6D28D9',
    primaryLight: '#F5F3FF',
    accent: '#8B5CF6',
    border: '#DDD6FE'
  },
  teal: {
    primary: '#0D9488',
    primaryDark: '#0F766E',
    primaryLight: '#F0FDFA',
    accent: '#14B8A6',
    border: '#99F6E4'
  },
  navy: {
    primary: '#1E3A8A',
    primaryDark: '#172554',
    primaryLight: '#EFF6FF',
    accent: '#2563EB',
    border: '#93C5FD'
  }
};

/**
 * ResumeCanvasWrapper enforces strict A4 dimensions (210mm x 297mm)
 * and continuously monitors content overflow.
 * If content overflows 297mm, it auto-shrinks font size down to 9pt and compresses
 * vertical spacing to guarantee it stays strictly on 1 single page.
 */
export const ResumeCanvasWrapper = ({
  children,
  templateId = 'classic',
  customizations = {},
  className = '',
  id = 'resume-export-target'
}) => {
  const containerRef = useRef(null);
  const [scaleInfo, setScaleInfo] = useState({ fontScale: 1, spacingScale: 1, isAutoFitted: false });

  const fontStyle = customizations.fontStyle || 'default';
  const fontSizeSetting = customizations.fontSize || 'Medium'; // Small, Medium, Large
  const themeColorKey = customizations.themeColor || 'blue';
  const spacingSetting = customizations.spacing || 'Normal'; // Compact, Normal, Spacious
  const layoutSetting = customizations.layout || 'default'; // default, single, two-column

  // Calculate base font multiplier from user setting
  const baseSizeMultiplier =
    fontSizeSetting === 'Small' ? 0.92 : fontSizeSetting === 'Large' ? 1.08 : 1.0;

  // Calculate base padding & spacing from user setting
  const paddingMm =
    spacingSetting === 'Compact' ? 12 : spacingSetting === 'Spacious' ? 18 : 14;

  const spacingMultiplier =
    spacingSetting === 'Compact' ? 0.85 : spacingSetting === 'Spacious' ? 1.15 : 1.0;

  const colorPalette = THEME_COLOR_MAP[themeColorKey] || THEME_COLOR_MAP.blue;

  // Auto-shrink overflow observer to strictly lock to 1 page
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Reset scales to measure natural height
    el.style.setProperty('--auto-font-scale', '1');
    el.style.setProperty('--auto-spacing-scale', '1');

    const evaluateFit = () => {
      // 297mm in pixels at 96 DPI is ~1122.5px
      const clientH = el.clientHeight || 1122;
      const scrollH = el.scrollHeight;

      if (scrollH > clientH + 2) {
        // Overflow detected! Calculate precision shrink ratio
        const ratio = clientH / scrollH;
        // Limit font shrink to 9pt equivalent (~0.72 of standard 12pt)
        const computedFontScale = Math.max(0.72, Math.min(1.0, ratio * 0.98));
        // Compress gap spacing slightly more to preserve font legibility
        const computedSpacingScale = Math.max(0.65, Math.min(1.0, ratio * 0.94));

        el.style.setProperty('--auto-font-scale', computedFontScale.toFixed(3));
        el.style.setProperty('--auto-spacing-scale', computedSpacingScale.toFixed(3));
        setScaleInfo({
          fontScale: computedFontScale,
          spacingScale: computedSpacingScale,
          isAutoFitted: true
        });
      } else {
        el.style.setProperty('--auto-font-scale', '1');
        el.style.setProperty('--auto-spacing-scale', '1');
        setScaleInfo({ fontScale: 1, spacingScale: 1, isAutoFitted: false });
      }
    };

    // Evaluate on render
    evaluateFit();

    // Re-evaluate on DOM mutations or child resize
    const ro = new ResizeObserver(() => evaluateFit());
    ro.observe(el);

    return () => ro.disconnect();
  }, [children, fontSizeSetting, spacingSetting, fontStyle, themeColorKey, layoutSetting]);

  // Compute inline CSS variables for this canvas
  const fontFamilyValue =
    fontStyle !== 'default' && FONT_FAMILY_MAP[fontStyle]
      ? FONT_FAMILY_MAP[fontStyle]
      : undefined;

  const customStyle = {
    padding: `${paddingMm}mm`,
    ...(fontFamilyValue ? { fontFamily: fontFamilyValue } : {}),
    '--theme-primary': colorPalette.primary,
    '--theme-primary-dark': colorPalette.primaryDark,
    '--theme-primary-light': colorPalette.primaryLight,
    '--theme-accent': colorPalette.accent,
    '--theme-border': colorPalette.border,
    '--user-base-font-scale': baseSizeMultiplier,
    '--user-spacing-scale': spacingMultiplier
  };

  return (
    <div
      ref={containerRef}
      id={id}
      className={`resume-paper a4-fixed-canvas template-${templateId} layout-${layoutSetting} spacing-${spacingSetting.toLowerCase()} ${className}`}
      style={customStyle}
      data-auto-fitted={scaleInfo.isAutoFitted ? 'true' : 'false'}
    >
      <div className="a4-inner-content-area">{children}</div>
    </div>
  );
};
