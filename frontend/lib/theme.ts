import { createTheme } from '@mui/material/styles';

/**
 * Single source of truth for theme colors.
 * - Injected as :root CSS variables (see `getRootCssVariablesStyle`) for Tailwind, inline styles, and `sx` using `var(--...)`.
 * - MUI `theme.palette` references the same variables so defaults stay in sync.
 *
 * To change the look app-wide later: edit the values in `CSS_VARIABLES` below (or swap this object for a different theme export).
 */
export const CSS_VARIABLES = {
  '--color-page-bg': '#FAF3E0',
  '--color-page-bg-dark': '#e8e0c8',
  '--color-text-primary': '#2D3436',
  '--color-text-secondary': '#636E72',
  '--color-text-muted': '#b2bec3',
  '--color-text-light': '#b2bec3',
  '--color-text-white': '#ffffff',
  '--color-text-black': '#2D3436',
  '--color-surface': '#FFF8EE',
  '--color-surface-alt': '#FAF3E0',
  '--color-surface-hover': '#636E72',
  '--color-border': '#e0d5c0',
  '--color-divider': '#e0d5c0',

  '--color-cream': '#FAF3E0',
  '--color-cream-light': '#e8e0c8',
  '--color-cream-dark': '#f5f0dc',
  '--color-cream-darker': '#e8e0c8',
  '--color-cream-hover': '#f0e6d3',
  '--color-cream-border': '#e8e0c8',
  '--color-cream-border-dark': '#e8dcc8',
  '--color-cream-input-hover': '#FF69B4',
  '--color-cream-input-active': '#e8dfc5',

  '--color-warm-brown': '#2D3436',
  '--color-warm-brown-dark': '#3a4144',
  '--color-warm-brown-border': '#e0d5c0',
  '--color-warm-brown-border-hover': '#c9b98a',
  '--color-warm-brown-disabled': '#b2bec3',
  '--color-warm-brown-muted': '#636E72',

  '--color-accent-teal': '#4ECDC4',
  '--color-accent-teal-hover': '#3dbdb5',
  '--color-accent-teal-dark': '#3a4144',
  '--color-accent-coral': '#FF6B6B',
  '--color-accent-coral-hover': '#ee5a5a',
  '--color-accent-purple': '#6C5CE7',
  '--color-accent-purple-hover': '#5a4bd6',
  '--color-kiosk-text': '#2D3436',
  '--color-kiosk-muted': '#636E72',
  '--color-kiosk-light-gray': '#b2bec3',
  '--color-kiosk-lighter-gray': '#B2BEC3',
  '--color-kiosk-border-light': '#DFE6E9',

  '--color-dark-bg': '#1a1a2e',
  '--color-dark-surface': '#16213e',
  '--color-dark-accent': '#0f3460',
  '--color-dark-highlight': '#FF6B6B',
  '--color-dark-success': '#4ECDC4',
  '--color-dark-success-bg': '#1a3a3e',
  '--color-dark-overlay': '#0a0a1a',
  '--color-dark-border': '#333333',
  '--color-dark-muted': '#aaaaaa',
  '--color-dark-btn-disabled': '#555555',
  '--color-dark-text-muted': '#666666',
  '--color-dark-card-border': '#3a4144',
  '--color-dark-error-bg': '#3a1a2e',
  '--color-dark-loading-bg': '#0f0f23',
  '--color-dark-text-dim': '#444444',
  '--color-dark-text-subtle': '#555555',

  '--color-status-green-bg': '#e8f5e9',
  '--color-status-green-border': '#4caf50',
  '--color-status-green-accent': '#2e7d32',
  '--color-status-yellow-bg': '#fff8e1',
  '--color-status-yellow-border': '#fbc02d',
  '--color-status-yellow-accent': '#f9a825',
  '--color-status-orange-bg': '#fff3e0',
  '--color-status-orange-border': '#ff9800',
  '--color-status-orange-accent': '#e65100',
  '--color-status-red-bg': '#ffebee',
  '--color-status-red-border': '#f44336',
  '--color-status-red-accent': '#c62828',

  '--color-tag-dinein-bg': '#e3f2fd',
  '--color-tag-dinein-text': '#1565c0',
  '--color-tag-takeout-bg': '#fce4ec',
  '--color-tag-takeout-text': '#c62828',
  '--color-tag-category-bg': '#e8eaf6',
  '--color-tag-category-text': '#3949ab',
  '--color-tag-topping-bg': '#f3e5f5',
  '--color-tag-topping-text': '#7b1fa2',

  '--color-stat-blue': '#64b5f6',
  '--color-stat-green': '#66bb6a',
  '--color-stat-purple': '#ce93d8',

  '--color-manager-orders': '#4ECDC4',
  '--color-manager-employees': '#4ECDC4',
  '--color-manager-inventory': '#FF6B6B',
  '--color-manager-menu': '#6C5CE7',

  '--color-editor-green': '#4ECDC4',
  '--color-editor-green-dark': '#3dbdb5',
  '--color-editor-terracotta': '#FF6B6B',
  '--color-editor-terracotta-dark': '#ee5a5a',
  '--color-editor-brown': '#636E72',
  '--color-editor-brown-light': '#636E72',
  '--color-editor-brown-lighter': '#636E72',
  '--color-editor-brown-dark': '#2D3436',
  '--color-editor-brown-muted': '#636E72',
  '--color-editor-brown-dim': '#636E72',
  '--color-editor-brown-text': '#2D3436',
  '--color-editor-brown-heading': '#2D3436',
  '--color-editor-search': '#636E72',
  '--color-editor-photo': '#b2bec3',
  '--color-editor-photo-text': '#636E72',
  '--color-editor-surface': '#FFF8EE',
  '--color-editor-surface-alt': '#FFF8EE',
  '--color-editor-surface-card': '#FFF8EE',
  '--color-editor-surface-unavail': '#FAF3E0',
  '--color-editor-cream-light': '#FFF8EE',
  /* Chips: dark text on tinted fills (pastel teal/coral text on pastel bg failed WCAG) */
  '--color-editor-chip-avail-bg': '#B2DFDB',
  '--color-editor-chip-avail-fg': '#063932',
  '--color-editor-chip-hidden-bg': '#FFCDD2',
  '--color-editor-chip-hidden-fg': '#8B1010',
  '--color-editor-chip-hidden-text': '#FF6B6B',
  '--color-editor-chip-shown-bg': '#E8DCC8',
  '--color-editor-chip-shown-text': '#3D3830',
  '--color-editor-chip-uncat-bg': '#FFCDD2',
  '--color-editor-chip-uncat-text': '#8B1010',
  '--color-editor-chip-price-bg': '#FFCDD2',
  '--color-editor-chip-price-text': '#8B1010',
  '--color-editor-toggle-avail-bg': '#B2DFDB',
  '--color-editor-toggle-hidden-bg': '#FFCDD2',
  '--color-editor-img-bg': '#f0e6d3',
  '--color-editor-gradient-start': '#FFF8EE',
  '--color-editor-gradient-mid': '#FAF3E0',
  '--color-editor-gradient-end': '#FAF3E0',
  '--color-editor-gradient-create-end': '#FAF3E0',
  /* Filled controls on white/off-white editor panels */
  '--color-editor-field-bg': '#E4DDD2',
  '--color-editor-field-outline': '#9A9185',
  '--color-editor-field-outline-hover': '#7A7268',
  '--color-editor-outlined-button-bg': '#C9BFB0',
  '--color-editor-outlined-button-hover': '#B8AE9E',
  /* Solid CTAs: dark enough for white label text */
  '--color-editor-contained-teal': '#0F766E',
  '--color-editor-contained-teal-hover': '#0D5C56',
  '--color-editor-contained-coral': '#C62828',
  '--color-editor-contained-coral-hover': '#AD1414',
  /* Outlined “Ingredients” (teal) + delete — text/border read against neutral fill */
  '--color-editor-outlined-teal-fg': '#064E48',
  '--color-editor-outlined-teal-border': '#0F766E',
  '--color-editor-delete-fill': '#FFEBEE',
  '--color-editor-delete-fill-hover': '#FFCDD2',

  '--color-success': '#4caf50',
  '--color-warning': '#ffa726',
  '--color-warning-alt': '#ff9800',
  '--color-error': '#f44336',
  '--color-error-dark': '#d32f2f',
  '--color-error-text': '#a00000',
  '--color-info': '#5c6bc0',
  '--color-active-green': '#117a00',
  '--color-active-green-alt': '#2e7d32',

  '--color-overlay-heavy': 'rgba(0, 0, 0, 0.8)',
  '--color-overlay-medium': 'rgba(0, 0, 0, 0.7)',

  '--color-order-row-bg': '#FFF8EE',
} as const satisfies Record<string, string>;

/** Inline `<style>` content for `<html>` or `<body>` — defines all `--color-*` variables from this file. */
export function getRootCssVariablesStyle(): string {
  const lines = Object.entries(CSS_VARIABLES).map(([key, value]) => `  ${key}: ${value};`);
  return `:root {\n${lines.join('\n')}\n}\n`;
}

/** MUI palette must use parseable color strings (not `var(...)`), so values mirror `CSS_VARIABLES`. */
const theme = createTheme({
  palette: {
    primary: {
      main: CSS_VARIABLES['--color-accent-teal'],
      dark: CSS_VARIABLES['--color-accent-teal-hover'],
    },
    secondary: {
      main: CSS_VARIABLES['--color-accent-coral'],
      dark: CSS_VARIABLES['--color-accent-coral-hover'],
    },
    error: { main: CSS_VARIABLES['--color-error'] },
    warning: { main: CSS_VARIABLES['--color-warning'] },
    success: { main: CSS_VARIABLES['--color-success'] },
    info: { main: CSS_VARIABLES['--color-info'] },
    background: {
      default: CSS_VARIABLES['--color-page-bg'],
      paper: CSS_VARIABLES['--color-surface'],
    },
    text: {
      primary: CSS_VARIABLES['--color-text-primary'],
      secondary: CSS_VARIABLES['--color-text-secondary'],
    },
    divider: CSS_VARIABLES['--color-divider'],
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
