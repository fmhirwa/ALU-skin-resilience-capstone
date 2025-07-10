'use client';
import React, {
  createContext, useContext, useEffect, useState, useCallback,
} from 'react';
import { useSettings } from './settings-provider';

/* ---------- UI → model tone map ---------- */
const TONE_MAP = { light: 1, medium: 2, dark: 3, deep: 4 } as const;

/* ---------- where to reach the backend ----------
   • If NEXT_PUBLIC_BACKEND_URL is defined it is called directly.
   • Otherwise it falls back to the Next.js edge-proxy (/api).           */
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

type Weather = { temp: number | null; uv: number | null };

type DataState = {
  risk: number | null;
  recommendation: string | null;
  lastUpdated: Date | null;
  weather: Weather | null;
  loading: boolean;
  error: string | null;
  backendReady: boolean;
  fetchNow: () => Promise<void>;
};

const DataContext = createContext<DataState | null>(null);

/* ===================================================================== */
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const settings = useSettings();

  const [state, setState] = useState<Omit<DataState, 'fetchNow'>>({
    risk: null,
    recommendation: null,
    lastUpdated: null,
    weather: null,
    loading: false,
    error: null,
    backendReady: false,
  });

  /* ---------- keep pinging /healthz until the dyno wakes up ----------- */
  useEffect(() => {
    if (state.backendReady) return;

    let cancelled = false;
    const ping = async () => {
      try {
        const r = await fetch(`${API_BASE || '/api'}/healthz`, { cache: 'no-store' });
        if (!cancelled && r.ok) setState(p => ({ ...p, backendReady: true }));
      } catch { /* ignore – retry */ }

      if (!cancelled && !state.backendReady) setTimeout(ping, 5_000);
    };
    ping();
    return () => { cancelled = true; };
  }, [state.backendReady]);

  /* ---------- main fetch  -------------------------------------------- */
  const fetchNow = useCallback(async () => {
    if (!settings.location) return;          // wait until we have geo-coords
    try {
      setState(p => ({ ...p, loading: true, error: null }));

      const { lat, lon } = settings.location;
      const qs = new URLSearchParams({
        lat: String(lat),
        lon: String(lon),
        tone: String(TONE_MAP[settings.skinTone] ?? 3),
        gender: settings.gender,
      });

      const res = await fetch(`${API_BASE || '/api'}/risk?${qs}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(await res.text());

      const { score, advice, temp_c, uv_wm2 } = await res.json();

      setState(p => ({
        ...p,
        risk: score ?? null,
        recommendation: advice ?? null,
        weather: { temp: temp_c ?? null, uv: uv_wm2 ?? null },
        lastUpdated: new Date(),
        loading: false,
        backendReady: true,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setState(p => ({ ...p, loading: false, error: message }));
    }
  }, [settings]);

  /* auto-fetch whenever user settings change (tone, gender, location) */
  useEffect(() => { fetchNow(); }, [fetchNow]);

  return (
    <DataContext.Provider value={{ ...state, fetchNow }}>
      {children}
    </DataContext.Provider>
  );
};

/* little helper so consumers don’t need to null-check */
export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside <DataProvider>');
  return ctx;
};
