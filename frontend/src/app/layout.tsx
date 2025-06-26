/* src/app/layout.tsx */
/*'use client';*/

import type { Metadata } from 'next';
import './globals.css';

import { SettingsProvider } from './(providers)/settings-provider';
import { DataProvider }     from './(providers)/data-provider';
import MuiProvider          from './(providers)/mui-provider';
import ServiceWorkerBridge  from './(components)/ServiceWorkerBridge';

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
              {children}
            </DataProvider>
          </MuiProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}