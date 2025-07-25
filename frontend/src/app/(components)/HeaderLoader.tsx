// src/app/(components)/HeaderLoader.tsx
'use client';

import dynamic from 'next/dynamic';

// Client-only loader for the header
const HeaderLoader = dynamic(
  () => import('./ClientAppBar'),
  { ssr: false }
);

export default HeaderLoader;