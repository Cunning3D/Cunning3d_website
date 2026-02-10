// ============================================
// Design Tokens for Tailwind CSS v4
// ============================================
// Comprehensive design system using OKLCH color space
// and CSS-first configuration approach
// ============================================

// ============================================
// COLOR SYSTEM - OKLCH Color Space
// ============================================

/**
 * OKLCH Primary Palette - Blue-based primary
 * Lightness, Chroma, Hue format
 */
export const primaryColors = {
  50:  { l: 0.97, c: 0.02, h: 250 }, // Lightest
  100: { l: 0.94, c: 0.04, h: 250 },
  200: { l: 0.89, c: 0.08, h: 250 },
  300: { l: 0.82, c: 0.12, h: 250 },
  400: { l: 0.73, c: 0.16, h: 250 },
  500: { l: 0.62, c: 0.20, h: 250 }, // Base
  600: { l: 0.52, c: 0.18, h: 250 },
  700: { l: 0.42, c: 0.16, h: 250 },
  800: { l: 0.32, c: 0.12, h: 250 },
  900: { l: 0.22, c: 0.08, h: 250 },
  950: { l: 0.12, c: 0.04, h: 250 }, // Darkest
} as const;

/**
 * Gray/Neutral Palette - Neutral hue
 */
export const grayColors = {
  50:  { l: 0.98, c: 0.005, h: 250 },
  100: { l: 0.95, c: 0.01, h: 250 },
  200: { l: 0.90, c: 0.015, h: 250 },
  300: { l: 0.82, c: 0.02, h: 250 },
  400: { l: 0.70, c: 0.025, h: 250 },
  500: { l: 0.55, c: 0.03, h: 250 },
  600: { l: 0.45, c: 0.025, h: 250 },
  700: { l: 0.35, c: 0.02, h: 250 },
  800: { l: 0.25, c: 0.015, h: 250 },
  900: { l: 0.15, c: 0.01, h: 250 },
  950: { l: 0.08, c: 0.005, h: 250 },
} as const;

/**
 * Semantic Colors
 */
export const semanticColors = {
  success: {
    50:  { l: 0.97, c: 0.03, h: 150 },
    100: { l: 0.94, c: 0.06, h: 150 },
    200: { l: 0.88, c: 0.12, h: 150 },
    300: { l: 0.80, c: 0.18, h: 150 },
    400: { l: 0.70, c: 0.22, h: 150 },
    500: { l: 0.60, c: 0.24, h: 150 }, // Base
    600: { l: 0.50, c: 0.22, h: 150 },
    700: { l: 0.40, c: 0.18, h: 150 },
    800: { l: 0.30, c: 0.14, h: 150 },
    900: { l: 0.20, c: 0.10, h: 150 },
    950: { l: 0.10, c: 0.06, h: 150 },
  },
  warning: {
    50:  { l: 0.97, c: 0.03, h: 85 },
    100: { l: 0.94, c: 0.06, h: 85 },
    200: { l: 0.88, c: 0.12, h: 85 },
    300: { l: 0.80, c: 0.18, h: 85 },
    400: { l: 0.70, c: 0.22, h: 85 },
    500: { l: 0.60, c: 0.24, h: 85 }, // Base
    600: { l: 0.50, c: 0.22, h: 85 },
    700: { l: 0.40, c: 0.18, h: 85 },
    800: { l: 0.30, c: 0.14, h: 85 },
    900: { l: 0.20, c: 0.10, h: 85 },
    950: { l: 0.10, c: 0.06, h: 85 },
  },
  error: {
    50:  { l: 0.97, c: 0.03, h: 25 },
    100: { l: 0.94, c: 0.06, h: 25 },
    200: { l: 0.88, c: 0.12, h: 25 },
    300: { l: 0.80, c: 0.18, h: 25 },
    400: { l: 0.70, c: 0.22, h: 25 },
    500: { l: 0.60, c: 0.24, h: 25 }, // Base
    600: { l: 0.50, c: 0.22, h: 25 },
    700: { l: 0.40, c: 0.18, h: 25 },
    800: { l: 0.30, c: 0.14, h: 25 },
    900: { l: 0.20, c: 0.10, h: 25 },
    950: { l: 0.10, c: 0.06, h: 25 },
  },
  info: {
    50:  { l: 0.97, c: 0.03, h: 220 },
    100: { l: 0.94, c: 0.06, h: 220 },
    200: { l: 0.88, c: 0.12, h: 220 },
    300: { l: 0.80, c: 0.18, h: 220 },
    400: { l: 0.70, c: 0.22, h: 220 },
    500: { l: 0.60, c: 0.24, h: 220 }, // Base
    600: { l: 0.50, c: 0.22, h: 220 },
    700: { l: 0.40, c: 0.18, h: 220 },
    800: { l: 0.30, c: 0.14, h: 220 },
    900: { l: 0.20, c: 0.10, h: 220 },
    950: { l: 0.10, c: 0.06, h: 220 },
  },
} as const;

// ============================================
// TYPOGRAPHY SYSTEM
// ============================================

/**
 * Font Family Stack Definitions
 */
export const fontFamilies = {
  sans: [
    'Inter',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ].join(', '),

  heading: [
    'Inter',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ].join(', '),

  mono: [
    'JetBrains Mono',
    'Fira Code',
    'SF Mono',
    'Monaco',
    'Inconsolata',
    'Roboto Mono',
    'monospace',
  ].join(', '),
} as const;

/**
 * Type Scale - Major Third (1.25) with adjustments
 */
export const typeScale = {
  xs:    { size: '0.75rem',   lineHeight: '1rem',    letterSpacing: '0.05em' },   // 12px
  sm:    { size: '0.875rem',  lineHeight: '1.25rem', letterSpacing: '0.025em' },  // 14px
  base:  { size: '1rem',      lineHeight: '1.5rem',  letterSpacing: '0em' },       // 16px
  lg:    { size: '1.125rem',  lineHeight: '1.75rem', letterSpacing: '-0.025em' },  // 18px
  xl:    { size: '1.25rem',   lineHeight: '1.75rem', letterSpacing: '-0.025em' },  // 20px
  '2xl': { size: '1.5rem',    lineHeight: '2rem',    letterSpacing: '-0.025em' },  // 24px
  '3xl': { size: '1.875rem',   lineHeight: '2.25rem', letterSpacing: '-0.025em' },  // 30px
  '4xl': { size: '2.25rem',    lineHeight: '2.5rem',  letterSpacing: '-0.025em' },  // 36px
  '5xl': { size: '3rem',       lineHeight: '1',       letterSpacing: '-0.025em' },  // 48px
  '6xl': { size: '3.75rem',    lineHeight: '1',       letterSpacing: '-0.025em' },  // 60px
  '7xl': { size: '4.5rem',     lineHeight: '1',       letterSpacing: '-0.025em' },  // 72px
  '8xl': { size: '6rem',       lineHeight: '1',       letterSpacing: '-0.025em' },  // 96px
  '9xl': { size: '8rem',       lineHeight: '1',       letterSpacing: '-0.025em' },  // 128px
} as const;

/**
 * Font Weights
 */
export const fontWeights = {
  thin:       100,
  extralight: 200,
  light:      300,
  normal:     400,
  medium:     500,
  semibold:   600,
  bold:       700,
  extrabold:  800,
  black:      900,
} as const;

// ============================================
// SPACING SYSTEM
// ============================================

/**
 * 4px Base Grid Spacing Scale
 */
export const spacing = {
  0:   '0px',
  0.5: '2px',    // 0.125rem
  1:   '4px',    // 0.25rem
  1.5: '6px',    // 0.375rem
  2:   '8px',    // 0.5rem
  2.5: '10px',   // 0.625rem
  3:   '12px',   // 0.75rem
  3.5: '14px',   // 0.875rem
  4:   '16px',   // 1rem
  5:   '20px',   // 1.25rem
  6:   '24px',   // 1.5rem
  7:   '28px',   // 1.75rem
  8:   '32px',   // 2rem
  9:   '36px',   // 2.25rem
  10:  '40px',   // 2.5rem
  11:  '44px',   // 2.75rem
  12:  '48px',   // 3rem
  14:  '56px',   // 3.5rem
  16:  '64px',   // 4rem
  20:  '80px',   // 5rem
  24:  '96px',   // 6rem
  28:  '112px',  // 7rem
  32:  '128px',  // 8rem
  36:  '144px',  // 9rem
  40:  '160px',  // 10rem
  44:  '176px',  // 11rem
  48:  '192px',  // 12rem
  52:  '208px',  // 13rem
  56:  '224px',  // 14rem
  60:  '240px',  // 15rem
  64:  '256px',  // 16rem
  72:  '288px',  // 18rem
  80:  '320px',  // 20rem
  96:  '384px',  // 24rem
} as const;

// ============================================
// BORDER & RADIUS
// ============================================

/**
 * Border Radius Scale
 */
export const borderRadius = {
  none:  '0px',
  sm:    '2px',   // 0.125rem
  DEFAULT: '4px', // 0.25rem
  md:    '6px',   // 0.375rem
  lg:    '8px',   // 0.5rem
  xl:    '12px',  // 0.75rem
  '2xl': '16px',  // 1rem
  '3xl': '24px',  // 1.5rem
  full:  '9999px',
} as const;

/**
 * Border Width Scale
 */
export const borderWidth = {
  0: '0px',
  DEFAULT: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const;

// ============================================
// SHADOWS & ELEVATION
// ============================================

/**
 * Shadow Scale - Light Mode
 */
export const shadows = {
  xs:   '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm:   '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  md:   '0 6px 8px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg:   '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl:   '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const;

/**
 * Shadow Scale - Dark Mode
 */
export const shadowsDark = {
  xs:   '0 1px 2px 0 rgb(0 0 0 / 0.3)',
  sm:   '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
  DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
  md:   '0 6px 8px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
  lg:   '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
  xl:   '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.6)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.3)',
  none: 'none',
} as const;

// ============================================
// ANIMATION & TRANSITIONS
// ============================================

/**
 * Duration Scale (in milliseconds)
 */
export const duration = {
  0:       '0ms',
  50:      '50ms',
  100:     '100ms',
  150:     '150ms',
  200:     '200ms',
  250:     '250ms',
  300:     '300ms',
  350:     '350ms',
  400:     '400ms',
  450:     '450ms',
  500:     '500ms',
  600:     '600ms',
  700:     '700ms',
  800:     '800ms',
  900:     '900ms',
  1000:    '1000ms',
  1500:    '1500ms',
  2000:    '2000ms',
  3000:    '3000ms',
  4000:    '4000ms',
  5000:    '5000ms',
  DEFAULT: '150ms',
} as const;

/**
 * Easing Functions
 */
export const easing = {
  // Standard
  linear:      'linear',
  DEFAULT:     'cubic-bezier(0.4, 0, 0.2, 1)',

  // Material Design
  standard:    'cubic-bezier(0.4, 0, 0.2, 1)',      // Standard
  decelerate:  'cubic-bezier(0, 0, 0.2, 1)',        // Entering
  accelerate:  'cubic-bezier(0.4, 0, 1, 1)',        // Exiting
  sharp:       'cubic-bezier(0.4, 0, 0.6, 1)',      // Temporary

  // Custom
  bounce:      'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic:     'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  smooth:      'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
  snap:        'cubic-bezier(0.86, 0, 0.07, 1)',
} as const;

/**
 * Transition Presets
 */
export const transitions = {
  // Base
  none:   'none',
  all:    `all ${duration.DEFAULT} ${easing.DEFAULT}`,

  // Common properties
  colors: `color, background-color, border-color, text-decoration-color, fill, stroke ${duration.DEFAULT} ${easing.DEFAULT}`,
  opacity: `opacity ${duration.DEFAULT} ${easing.DEFAULT}`,
  shadow: `box-shadow ${duration.DEFAULT} ${easing.DEFAULT}`,
  transform: `transform ${duration.DEFAULT} ${easing.DEFAULT}`,

  // Compound
  'transform-opacity': `transform, opacity ${duration.DEFAULT} ${easing.DEFAULT}`,
  'colors-opacity': `color, background-color, border-color, text-decoration-color, fill, stroke, opacity ${duration.DEFAULT} ${easing.DEFAULT}`,

  // Specialized
  button: `color, background-color, border-color, box-shadow, transform ${duration[200]} ${easing.standard}`,
  input: `border-color, box-shadow, background-color ${duration[150]} ${easing.standard}`,
  modal: `opacity, transform ${duration[300]} ${easing.decelerate}`,
  drawer: `transform ${duration[300]} ${easing.standard}`,
  tooltip: `opacity, transform ${duration[150]} ${easing.decelerate}`,
  skeleton: `opacity ${duration[1000]} ${easing.linear}`,
  spin: `transform ${duration[1000]} ${easing.linear}`,
  ping: `transform, opacity ${duration[1000]} ${easing.standard}`,
  pulse: `opacity ${duration[2000]} ${easing.standard}`,
  bounce: `transform ${duration[1000]} ${easing.bounce}`,
} as const;

// ============================================
// Z-INDEX SCALE
// ============================================

export const zIndex = {
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  100: 100,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
  '4xl': '2560px',
} as const;

// ============================================
// CONTAINER SIZES
// ============================================

export const containerSizes = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
  min: 'min-content',
  max: 'max-content',
  fit: 'fit-content',
  prose: '65ch',
  'screen-sm': breakpoints.sm,
  'screen-md': breakpoints.md,
  'screen-lg': breakpoints.lg,
  'screen-xl': breakpoints.xl,
  'screen-2xl': breakpoints['2xl'],
} as const;

// ============================================
// OPACITY SCALE
// ============================================

export const opacity = {
  0:   '0',
  5:   '0.05',
  10:  '0.1',
  15:  '0.15',
  20:  '0.2',
  25:  '0.25',
  30:  '0.3',
  35:  '0.35',
  40:  '0.4',
  45:  '0.45',
  50:  '0.5',
  55:  '0.55',
  60:  '0.6',
  65:  '0.65',
  70:  '0.7',
  75:  '0.75',
  80:  '0.8',
  85:  '0.85',
  90:  '0.9',
  95:  '0.95',
  100: '1',
} as const;

// ============================================
// ASPECT RATIOS
// ============================================

export const aspectRatios = {
  auto: 'auto',
  square: '1 / 1',
  video: '16 / 9',
  portrait: '3 / 4',
  landscape: '4 / 3',
  ultrawide: '21 / 9',
  cinematic: '2.39 / 1',
} as const;

// ============================================
// UTILITY HELPERS
// ============================================

/**
 * Generate CSS OKLCH color string
 */
export function oklch(l: number, c: number, h: number, alpha?: number): string {
  if (alpha !== undefined) {
    return `oklch(${l * 100}% ${c} ${h} / ${alpha})`;
  }
  return `oklch(${l * 100}% ${c} ${h})`;
}

/**
 * Convert OKLCH token to CSS string
 */
export function toCssColor(token: { l: number; c: number; h: number }): string {
  return oklch(token.l, token.c, token.h);
}

/**
 * Generate CSS custom properties for colors
 */
export function generateColorCssVariables(): string {
  const lines: string[] = [];

  // Primary
  Object.entries(primaryColors).forEach(([shade, token]) => {
    lines.push(`  --color-primary-${shade}: ${toCssColor(token)};`);
  });

  // Gray
  Object.entries(grayColors).forEach(([shade, token]) => {
    lines.push(`  --color-gray-${shade}: ${toCssColor(token)};`);
  });

  // Semantic
  Object.entries(semanticColors).forEach(([name, shades]) => {
    Object.entries(shades).forEach(([shade, token]) => {
      lines.push(`  --color-${name}-${shade}: ${toCssColor(token)};`);
    });
  });

  return `:root {\n${lines.join('\n')}\n}`;
}

// ============================================
// TAILWIND CSS v4 THEME CONFIGURATION
// ============================================

/**
 * Generate @theme block for Tailwind CSS v4
 */
export function generateTailwindTheme(): string {
  const lines: string[] = ['@theme {'];

  // Colors
  Object.entries(primaryColors).forEach(([shade]) => {
    lines.push(`  --color-primary-${shade}: var(--color-primary-${shade});`);
  });

  Object.entries(grayColors).forEach(([shade]) => {
    lines.push(`  --color-gray-${shade}: var(--color-gray-${shade});`);
  });

  Object.entries(semanticColors).forEach(([name]) => {
    Object.keys(name === 'success' ? semanticColors.success :
      name === 'warning' ? semanticColors.warning :
      name === 'error' ? semanticColors.error : semanticColors.info).forEach((shade) => {
      lines.push(`  --color-${name}-${shade}: var(--color-${name}-${shade});`);
    });
  });

  // Font families
  lines.push(`  --font-family-sans: ${fontFamilies.sans};`);
  lines.push(`  --font-family-heading: ${fontFamilies.heading};`);
  lines.push(`  --font-family-mono: ${fontFamilies.mono};`);

  // Type scale
  Object.entries(typeScale).forEach(([key, value]) => {
    const suffix = key === 'base' ? '' : `-${key}`;
    lines.push(`  --text${suffix}: ${value.size};`);
    lines.push(`  --text${suffix}--line-height: ${value.lineHeight};`);
    lines.push(`  --text${suffix}--letter-spacing: ${value.letterSpacing};`);
  });

  // Spacing
  Object.entries(spacing).forEach(([key, value]) => {
    const keyStr = String(key).replace('.', '\\.');
    lines.push(`  --spacing-${keyStr}: ${value};`);
  });

  // Border radius
  Object.entries(borderRadius).forEach(([key, value]) => {
    const keyStr = key === 'DEFAULT' ? '' : `-${key}`;
    lines.push(`  --radius${keyStr}: ${value};`);
  });

  // Border width
  Object.entries(borderWidth).forEach(([key, value]) => {
    const keyStr = key === 'DEFAULT' ? '' : `-${key}`;
    lines.push(`  --border-width${keyStr}: ${value};`);
  });

  // Shadows
  Object.entries(shadows).forEach(([key, value]) => {
    const keyStr = key === 'DEFAULT' ? '' : `-${key}`;
    lines.push(`  --shadow${keyStr}: ${value};`);
  });

  // Z-index
  Object.entries(zIndex).forEach(([key, value]) => {
    lines.push(`  --z-${key}: ${value};`);
  });

  // Breakpoints (as @media query references)
  Object.entries(breakpoints).forEach(([key, value]) => {
    lines.push(`  --breakpoint-${key}: ${value};`);
  });

  lines.push('}');

  return lines.join('\n');
}

// ============================================
// CSS VARIABLE OUTPUT FOR DARK MODE
// ============================================

/**
 * Generate dark mode CSS variables
 */
export function generateDarkModeCss(): string {
  const lines: string[] = ['.dark {'];

  // Dark mode shadows
  Object.entries(shadowsDark).forEach(([key, value]) => {
    const keyStr = key === 'DEFAULT' ? '' : `-${key}`;
    lines.push(`  --shadow${keyStr}: ${value};`);
  });

  lines.push('}');

  return lines.join('\n');
}

// ============================================
// TYPE EXPORTS
// ============================================

export type PrimaryColors = typeof primaryColors;
export type GrayColors = typeof grayColors;
export type SemanticColors = typeof semanticColors;
export type FontFamilies = typeof fontFamilies;
export type TypeScale = typeof typeScale;
export type FontWeights = typeof fontWeights;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type BorderWidth = typeof borderWidth;
export type Shadows = typeof shadows;
export type Duration = typeof duration;
export type Easing = typeof easing;
export type Transitions = typeof transitions;
export type ZIndex = typeof zIndex;
export type Breakpoints = typeof breakpoints;
export type ContainerSizes = typeof containerSizes;
export type Opacity = typeof opacity;
export type AspectRatios = typeof aspectRatios;

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
  colors: {
    primary: primaryColors,
    gray: grayColors,
    ...semanticColors,
  },
  fontFamilies,
  typeScale,
  fontWeights,
  spacing,
  borderRadius,
  borderWidth,
  shadows,
  shadowsDark,
  duration,
  easing,
  transitions,
  zIndex,
  breakpoints,
  containerSizes,
  opacity,
  aspectRatios,
};
