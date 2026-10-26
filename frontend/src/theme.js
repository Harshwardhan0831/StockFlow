import { createTheme } from '@mui/material/styles';

// Upstox Inspired Palette
export const UPSTOX_COLORS = {
  purpleDark: '#4A1D96',
  purplePrimary: '#6D28D9',
  purpleVibrant: '#7C3AED',
  purpleLight: '#8B5CF6',
  purpleSubtle: '#F5F3FF',
  greenSuccess: '#00D09C',
  greenSubtle: '#ECFDF5',
  redDanger: '#F43F5E',
  redSubtle: '#FFF1F2',
  darkBg: '#0B0F19',
  darkCard: '#131B2E',
  lightBg: '#F8FAFC',
  slateText: '#0F172A',
  slateMuted: '#64748B',
};

export const theme = createTheme({
  palette: {
    primary: {
      main: UPSTOX_COLORS.purplePrimary,
      light: UPSTOX_COLORS.purpleLight,
      dark: UPSTOX_COLORS.purpleDark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: UPSTOX_COLORS.greenSuccess,
      light: '#34D399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    success: {
      main: UPSTOX_COLORS.greenSuccess,
      contrastText: '#ffffff',
    },
    error: {
      main: UPSTOX_COLORS.redDanger,
      contrastText: '#ffffff',
    },
    background: {
      default: UPSTOX_COLORS.lightBg,
      paper: '#ffffff',
    },
    text: {
      primary: UPSTOX_COLORS.slateText,
      secondary: UPSTOX_COLORS.slateMuted,
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontWeight: 800, letterSpacing: '-0.025em' },
    h3: { fontWeight: 800, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.015em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    subtitle1: { fontSize: '1.1rem', lineHeight: 1.6 },
    subtitle2: { fontSize: '0.95rem', fontWeight: 600 },
    button: {
      fontWeight: 700,
      textTransform: 'none',
      fontSize: '1rem',
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 700,
          textTransform: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #8B5CF6 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(109, 40, 217, 0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5B21B6 0%, #6D28D9 50%, #7C3AED 100%)',
            boxShadow: '0 6px 20px rgba(109, 40, 217, 0.45)',
            transform: 'translateY(-1px)',
          },
        },
        outlinedPrimary: {
          borderWidth: 2,
          borderColor: '#7C3AED',
          color: '#6D28D9',
          '&:hover': {
            borderWidth: 2,
            borderColor: '#6D28D9',
            backgroundColor: 'rgba(109, 40, 217, 0.05)',
            transform: 'translateY(-1px)',
          },
        },
        sizeLarge: {
          padding: '14px 32px',
          fontSize: '1.125rem',
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          transition: 'all 0.25s ease',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});
