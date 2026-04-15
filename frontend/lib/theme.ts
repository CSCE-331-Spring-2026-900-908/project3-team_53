import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#4ECDC4' },
    secondary: { main: '#FF6B6B' },
    error: { main: '#f44336' },
    warning: { main: '#ffa726' },
    success: { main: '#4caf50' },
    background: {
      default: '#FAF3E0',
      paper: '#FFF8EE',
    },
    text: {
      primary: '#2D3436',
      secondary: '#636E72',
    },
  },
});

export default theme;
