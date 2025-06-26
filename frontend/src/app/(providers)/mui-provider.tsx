/* src/app/(providers)/mui-provider.tsx */
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
          primary: { main: '#1976D2' },
          secondary: { main: '#FFC107' }
        },
        shape: { borderRadius: 4 }
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
