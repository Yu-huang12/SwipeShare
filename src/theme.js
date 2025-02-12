import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#B8860B', // Rich Gold
      light: '#DAA520',
      dark: '#996515',
    },
    secondary: {
      main: '#1B365D', // Deep Navy
      light: '#234B8A',
      dark: '#0F2544',
    },
    background: {
      default: '#FAFAFA', // Modern Light
      paper: '#FFFFFF', // Pure White
    },
    text: {
      primary: '#1A1A1A', // Almost Black
      secondary: '#666666', // Sophisticated Gray
    },
    accent: {
      gold: '#D4AF37', // Metallic Gold
      silver: '#C0C0C0', // Modern Silver
      bronze: '#CD7F32', // Rich Bronze
    },
  },
  shape: {
    borderRadius: 2, // More modern, sharp edges
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
          fontFamily: "'Montserrat', sans-serif",
          letterSpacing: '0.5px',
        },
        contained: {
          background: 'linear-gradient(45deg, #B8860B 30%, #DAA520 90%)',
          color: '#FFFFFF',
          boxShadow: '0 4px 14px rgba(184, 134, 11, 0.25)',
          '&:hover': {
            background: 'linear-gradient(45deg, #996515 30%, #B8860B 90%)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: '#B8860B',
          color: '#B8860B',
          '&:hover': {
            borderColor: '#996515',
            background: 'rgba(184, 134, 11, 0.05)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(184, 134, 11, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#B8860B',
            },
          },
        },
      },
    },
  },
  typography: {
    fontFamily: "'Montserrat', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h3: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h4: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h5: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h6: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    button: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 500,
      letterSpacing: '0.5px',
    },
    body1: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '1rem',
      lineHeight: 1.7,
      letterSpacing: '0.1px',
    },
    body2: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '0.875rem',
      lineHeight: 1.7,
      letterSpacing: '0.1px',
    },
  },
}); 