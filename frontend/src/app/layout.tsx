// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

import { SettingsProvider } from './(providers)/settings-provider';
import MuiProvider from './(providers)/mui-provider';
import { DataProvider } from './(providers)/data-provider';
import ServiceWorkerBridge from './(components)/ServiceWorkerBridge';
import ClientAppBar from './(components)/ClientAppBar';
//import HeaderLoader from './(components)/HeaderLoader';

export const metadata: Metadata = {
  title: 'Urban Skin Health',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SettingsProvider>
          <MuiProvider>
            <DataProvider>
              <ServiceWorkerBridge />
              {/* Client-only header */}
              <ClientAppBar />
              {children}
            </DataProvider>
          </MuiProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
