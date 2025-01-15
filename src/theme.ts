import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      light: '#4dabf5',
      main: '#1976d2',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      light: '#82b1ff',
      main: '#448aff',
      dark: '#2979ff',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    success: {
      main: '#2196f3',
      dark: '#1976d2',
      light: '#64b5f6',
      contrastText: '#fff',
    },
    error: {
      main: '#ef5350',
      dark: '#d32f2f',
      light: '#e57373',
      contrastText: '#fff',
    },
    text: {
      primary: '#1a237e',
      secondary: '#3949ab',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      color: '#1a237e',
    },
    h2: {
      fontWeight: 600,
      color: '#1a237e',
    },
    h3: {
      fontWeight: 600,
      color: '#1a237e',
    },
    h4: {
      fontWeight: 600,
      color: '#1a237e',
    },
    h5: {
      fontWeight: 600,
      color: '#1a237e',
    },
    h6: {
      fontWeight: 600,
      color: '#1a237e',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 3px 12px rgba(25, 118, 210, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(25, 118, 210, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});
