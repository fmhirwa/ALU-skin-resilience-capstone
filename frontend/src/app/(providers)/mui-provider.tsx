'use client';
import React, { useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useSettings } from './settings-provider';

export default function MuiProvider({ children }: { children: React.ReactNode }) {
  const { darkMode } = useSettings();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary:   { main: '#36454F' },
          secondary: { main: '#FFC107' },
        },
        typography: {
          fontFamily: '"Futura","Trebuchet MS",sans-serif',
          fontWeightRegular: 300,
          h4: { fontWeight: 700, letterSpacing: 0.5 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 500 },
          body1: { fontSize: '1rem', lineHeight: 1.6 },
          body2: { fontSize: '0.875rem', lineHeight: 1.5 },
        },
        shape: { borderRadius: 8 },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                border: '1px solid rgba(0,0,0,0.12)',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.08)',
                padding: '1rem',
              }
            }
          }
        }
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
