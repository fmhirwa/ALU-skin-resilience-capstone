// app/(providers)/data-provider.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSettings } from './settings-provider';

/* ---------- map UI skin-tone strings -> int expected by backend ---------- */
const TONE_MAP: Record<string, number> = { light: 1, medium: 2, dark: 3, deep: 4 };

/* ---------- env ---------- */
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';      // «https://…onrender.com»

/* ---------- types ---------- */
type DataState = {
  /* payload ---------------------------------------------------------------- */
  risk:            number | null;
  recommendation:  string | null;
  lastUpdated:     Date   | null;

  /* ui flags --------------------------------------------------------------- */
  loading:        boolean;
  error:          string | null;
  backendReady:   boolean;

  /* actions ---------------------------------------------------------------- */
  fetchNow: () => Promise<void>;
};

const DataContext = createContext<DataState | null>(null);

/* ---------- provider ---------- */
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const settings = useSettings();

  const [state, setState] = useState<Omit<DataState, 'fetchNow'>>({
    risk: null,
    recommendation: null,
    lastUpdated: null,
    loading: false,
    error: null,
    backendReady: false
  });

  /* -------- ping Render backend until it wakes up -------- */
  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        /* any cheap endpoint you expose; 200 when ready */
        const r = await fetch(`${API_BASE}/healthz`, { cache: 'no-store' });
        if (!cancelled && r.ok) setState(s => ({ ...s, backendReady: true }));
      } catch { /* ignore until next attempt */ }

      if (!cancelled && !state.backendReady) setTimeout(poll, 5_000);
    };

    poll();
    return () => { cancelled = true; };
  }, [state.backendReady]);

  /* -------- main fetch -------- */
  const fetchNow = async () => {
    if (!settings.location) return;               // wait for user location

    try {
      setState(s => ({ ...s, loading: true, error: null }));

      const { lat, lon } = settings.location;
      const params     = new URLSearchParams({
        lat:    lat.toString(),
        lon:    lon.toString(),
        tone:   TONE_MAP[settings.skinTone]?.toString() ?? '3',
        gender: settings.gender
      });

      const res  = await fetch(`/api/risk?${params}`);
      if (!res.ok) throw new Error(await res.text());

      const { score, advice } = await res.json() as { score: number; advice: string };

      setState({
        risk: score,
        recommendation: advice,
        lastUpdated: new Date(),
        loading: false,
        error: null,
        backendReady: true             // mark ready on first success
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setState(s => ({ ...s, loading: false, error: msg }));
    }
  };

  /* refetch whenever inputs change */
  useEffect(() => { fetchNow(); },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings.location, settings.skinTone, settings.gender]);

  return (
    <DataContext.Provider value={{ ...state, fetchNow }}>
      {children}
    </DataContext.Provider>
  );
};

/* ---------- hook ---------- */
export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside <DataProvider>');
  return ctx;
};
