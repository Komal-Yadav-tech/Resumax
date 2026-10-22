import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import {
  FONT_FAMILY_MAP,
  THEME_COLOR_MAP,
  generatePaletteFromHex,
  resolveThemePalette
} from './themeConstants.js';

export {
  FONT_FAMILY_MAP,
  THEME_COLOR_MAP,
  generatePaletteFromHex,
  resolveThemePalette
};

/**
 * ResumeCanvasWrapper supports A4 & US Letter sizes, custom styles,
 * section spacing, heading styles, and real-time page overflow tracking.
 */
export const ResumeCanvasWrapper = ({
  children,
  templateId = 'classic',
  customizations = {},
  className = '',
  id = 'resume-export-target',
  onOverflowStatusChange = null
}) => {
  const containerRef = useRef(null);
  const [overflowState, setOverflowState] = useState({
    isOverflowing: false,
    overflowPx: 0,
    pageCount: 1,
    pageHeightPx: 1122.5
  });

  const fontStyle = customizations.fontStyle || 'default';
  const fontSizeSetting = customizations.fontSize || 'Medium'; // Small, Medium, Large
  const fontWeightSetting = customizations.fontWeight || 'Normal'; // Normal, Medium, Semi-Bold, Bold
  const headingWeightSetting = customizations.headingWeight || 'Bold'; // Normal, Semi-Bold, Bold, Extra-Bold
  const themeColorKey = customizations.themeColor || 'blue';
  const customHexColor = customizations.customHexColor || '';
  const spacingSetting = customizations.spacing || 'Normal'; // Compact, Normal, Spacious
  const layoutSetting = customizations.layout || 'default'; // default, single, two-column
  const pageSize = customizations.pageSize || 'a4'; // a4, letter
  const pageMarginSetting = customizations.pageMargin || 'Normal'; // Narrow, Normal, Wide
  const lineHeightSetting = customizations.lineHeight || 'Normal'; // Tight, Normal, Relaxed
  const headingStyleSetting = customizations.headingStyle || 'standard'; // standard, uppercase, underline, left-accent, highlight-badge
  const dividerStyleSetting = customizations.dividerStyle || 'solid'; // solid, dashed, dotted, gradient, double, none
  const headerAlignSetting = customizations.headerAlign || 'center'; // left, center, right
  const showIconsSetting = customizations.showIcons !== false; // true / false
  const iconStyleSetting = customizations.iconStyle || 'subtle'; // subtle, badge, minimal

  // Calculate base multipliers
  const baseSizeMultiplier =
    fontSizeSetting === 'Small' ? 0.92 : fontSizeSetting === 'Large' ? 1.08 : 1.0;

  // Margin calculation (mm)
  const paddingMm =
    pageMarginSetting === 'Narrow' ? 9 : pageMarginSetting === 'Wide' ? 19 : 14;

  // Spacing multiplier for internal gaps
  const spacingMultiplier =
    spacingSetting === 'Compact' ? 0.8 : spacingSetting === 'Spacious' ? 1.2 : 1.0;

  // Line height
  const lineHeightValue =
    lineHeightSetting === 'Tight' ? '1.25' : lineHeightSetting === 'Relaxed' ? '1.65' : '1.45';

  // Section gap
  const sectionGapValue =
    spacingSetting === 'Compact' ? '10px' : spacingSetting === 'Spacious' ? '22px' : '16px';

  // Headings & body weights
  const bodyWeightValue =
    fontWeightSetting === 'Bold' ? 700 : fontWeightSetting === 'Semi-Bold' ? 600 : fontWeightSetting === 'Medium' ? 500 : 400;

  const headingWeightValue =
    headingWeightSetting === 'Normal' ? 500 : headingWeightSetting === 'Semi-Bold' ? 600 : headingWeightSetting === 'Extra-Bold' ? 800 : 700;

  // Color palette
  const colorPalette = resolveThemePalette(themeColorKey, customHexColor);

  const prevReportRef = useRef({
    isOverflowing: false,
    pageCount: 1,
    overflowPx: 0
  });

  // Monitor overflow & page boundaries
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const evaluateOverflow = () => {
      // 96 DPI: A4 is 297mm (~1122.5px), US Letter is 11in (~1056px)
      const targetPageHeight = pageSize === 'letter' ? 1056 : 1122.5;
      const scrollH = el.scrollHeight;

      const isOverflowing = scrollH > targetPageHeight + 6;
      const overflowPx = Math.max(0, scrollH - targetPageHeight);
      const calculatedPages = Math.max(1, Math.ceil(scrollH / (targetPageHeight - 20)));

      const prev = prevReportRef.current;
      const isChanged =
        prev.isOverflowing !== isOverflowing ||
        prev.pageCount !== calculatedPages ||
        Math.abs(prev.overflowPx - overflowPx) > 4;

      if (isChanged) {
        prevReportRef.current = {
          isOverflowing,
          pageCount: calculatedPages,
          overflowPx
        };

        const newState = {
          isOverflowing,
          overflowPx,
          pageCount: calculatedPages,
          pageHeightPx: targetPageHeight
        };

        setOverflowState(newState);
        const notifyCallback = onOverflowStatusChange || customizations?.onOverflowStatusChange;
        if (notifyCallback) {
          requestAnimationFrame(() => {
            notifyCallback(newState);
          });
        }
      }
    };

    evaluateOverflow();

    const ro = new ResizeObserver(() => evaluateOverflow());
    ro.observe(el);

    return () => ro.disconnect();
  }, [
    fontSizeSetting,
    spacingSetting,
    fontStyle,
    themeColorKey,
    customHexColor,
    layoutSetting,
    pageSize,
    pageMarginSetting,
    lineHeightSetting,
    headingStyleSetting,
    dividerStyleSetting
  ]);

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
    '--user-spacing-scale': spacingMultiplier,
    '--user-line-height': lineHeightValue,
    '--user-section-gap': sectionGapValue,
    '--user-body-weight': bodyWeightValue,
    '--user-heading-weight': headingWeightValue,
    '--user-header-align': headerAlignSetting,
    lineHeight: lineHeightValue
  };

  const pageSizeClass = pageSize === 'letter' ? 'size-letter' : 'size-a4';

  return (
    <div
      ref={containerRef}
      id={id}
      className={`resume-paper ${pageSizeClass}-canvas template-${templateId} layout-${layoutSetting} spacing-${spacingSetting.toLowerCase()} heading-style-${headingStyleSetting} divider-style-${dividerStyleSetting} header-align-${headerAlignSetting} icon-style-${iconStyleSetting} ${!showIconsSetting ? 'icons-hidden' : ''} ${className}`}
      style={customStyle}
      data-page-size={pageSize}
      data-overflowing={overflowState.isOverflowing ? 'true' : 'false'}
    >
      <div className="a4-inner-content-area">
        {children}

        {/* Visual Page Break Preview Indicator if content spans beyond Page 1 */}
        {overflowState.isOverflowing && (
          <div
            className="page-break-indicator-line"
            style={{
              top: `${overflowState.pageHeightPx}px`
            }}
            title="Page 1 Break Line (Content below this point moves to Page 2)"
          >
            <span className="page-break-badge">
              ─── Page 1 Break • Page 2 Begins ───
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
