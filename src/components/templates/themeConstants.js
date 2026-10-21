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
  'Plus Jakarta Sans': "'Plus Jakarta Sans', 'Inter', sans-serif",
  'Playfair Display': "'Playfair Display', Georgia, serif",
  'Merriweather': "'Merriweather', Georgia, serif",
  'JetBrains Mono': "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace"
};

/**
 * Preset Theme Colors
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
  },
  crimson: {
    primary: '#E11D48',
    primaryDark: '#BE123C',
    primaryLight: '#FFF1F2',
    accent: '#F43F5E',
    border: '#FECDD3'
  },
  amber: {
    primary: '#D97706',
    primaryDark: '#B45309',
    primaryLight: '#FFFBEB',
    accent: '#F59E0B',
    border: '#FDE68A'
  }
};

/**
 * Generates harmonic color variations for any custom HEX color
 */
export const generatePaletteFromHex = (hex) => {
  if (!hex || !/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)) {
    return null;
  }

  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }

  const num = parseInt(cleanHex, 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;

  // Convert to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h *= 60;
  }

  const hslToHex = (hVal, sVal, lVal) => {
    const lPerc = lVal / 100;
    const a = (sVal * Math.min(lPerc, 1 - lPerc)) / 100;
    const f = (n) => {
      const k = (n + hVal / 30) % 12;
      const color = lPerc - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const primary = `#${cleanHex}`;
  const primaryDark = hslToHex(h, Math.min(100, s * 100 + 5), Math.max(10, l * 100 - 15));
  const primaryLight = hslToHex(h, Math.max(20, s * 100 - 20), 96);
  const accent = hslToHex((h + 10) % 360, Math.min(100, s * 100), Math.min(90, l * 100 + 5));
  const border = hslToHex(h, Math.max(20, s * 100 - 15), 85);

  return { primary, primaryDark, primaryLight, accent, border };
};

/**
 * Resolves full color palette considering presets & custom HEX
 */
export const resolveThemePalette = (themeColorKey = 'blue', customHex = '') => {
  if (customHex) {
    const customPalette = generatePaletteFromHex(customHex);
    if (customPalette) return customPalette;
  }
  return THEME_COLOR_MAP[themeColorKey] || THEME_COLOR_MAP.blue;
};
