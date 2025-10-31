import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    // Burnt orange primary for header / filter pop
    primary: {
      main: '#BF5700',
      contrastText: '#ffffff',
    },
    // secondary as a softer accent
    secondary: {
      main: '#FF6B6B',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0F1720',
      paper: '#171A1D',
    },
    text: {
      primary: '#E6EEF3',
      secondary: '#AAB7C2',
    },
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 3,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
