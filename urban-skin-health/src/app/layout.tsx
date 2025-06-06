import type { Metadata } from 'next';
import { SettingsProvider } from './(providers)/settings-provider';
import { DataProvider } from './(providers)/data-provider';
import CssBaseline from '@mui/material/CssBaseline';
import { CssVarsProvider } from '@mui/material/styles';
import theme from './(providers)/mui-theme';   // createTheme(...) with dark toggle
import './globals.css';

export const metadata: Metadata = { title: 'Urban Skin Health' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CssVarsProvider theme={theme}>
          <CssBaseline />
          <SettingsProvider>
            <DataProvider>{children}</DataProvider>
          </SettingsProvider>
        </CssVarsProvider>
      </body>
    </html>
  );
}
