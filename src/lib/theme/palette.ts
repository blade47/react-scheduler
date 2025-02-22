import { alpha } from '@mui/material/styles';

export function palette() {
  const GREY = {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  };

  const PRIMARY = {
    main: '#2563eb', // Modern blue
    light: '#60a5fa',
    dark: '#1e40af',
    contrastText: '#ffffff',
  };

  const SECONDARY = {
    main: '#7c3aed', // Modern purple
    light: '#a78bfa',
    dark: '#5b21b6',
    contrastText: '#ffffff',
  };

  const INFO = {
    main: '#0ea5e9', // Modern sky blue
    light: '#7dd3fc',
    dark: '#0369a1',
  };

  const SUCCESS = {
    main: '#10b981', // Modern emerald
    light: '#6ee7b7',
    dark: '#047857',
  };

  const WARNING = {
    main: '#f59e0b', // Modern amber
    light: '#fcd34d',
    dark: '#b45309',
  };

  const ERROR = {
    main: '#ef4444', // Modern red
    light: '#fca5a5',
    dark: '#b91c1c',
  };

  const COMMON = {
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
    primary: PRIMARY,
    secondary: SECONDARY,
    info: INFO,
    success: SUCCESS,
    warning: WARNING,
    error: ERROR,
    grey: GREY,
    divider: alpha(GREY[500], 0.2),
    action: {
      hover: alpha(GREY[500], 0.08),
      selected: alpha(GREY[500], 0.16),
      disabled: alpha(GREY[500], 0.8),
      disabledBackground: alpha(GREY[500], 0.24),
      focus: alpha(GREY[500], 0.24),
      hoverOpacity: 0.08,
      disabledOpacity: 0.48,
    },
  };

  return {
    ...COMMON,
    text: {
      primary: GREY[800],
      secondary: GREY[600],
      disabled: GREY[500],
    },
    background: {
      paper: '#FFFFFF',
      default: '#FAF9FA',
      neutral: GREY[200],
    },
    action: {
      ...COMMON.action,
      active: GREY[600],
    },
  };
}
