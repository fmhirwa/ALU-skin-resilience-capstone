'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSettings } from './settings-provider';


/* ------------------------------------------------------------------
 *  Map UI‑skin‑tone strings -> numeric codes understood by the API
 * ---------------------------------------------------------------- */
const TONE_MAP: Record<string, number> = {
  light: 1,
  medium: 2,
  dark: 3,
  deep: 4,
};

/* ------------------------------------------------------------------
 *  Types
 * ---------------------------------------------------------------- */
export interface DataState {
  /** 0 – 100 risk score (null = not fetched yet) */
  risk: number | null;
  /** Human‑readable recommendation from the backend */
  recommendation: string | null;
  /** When the above values were last (successfully) refreshed */
  lastUpdated: Date | null;

  /** true while we are waiting for /risk to return */
  loading: boolean;
  /** non‑null if the last fetch errored */
  error: string | null;

  /** Whether the backend has finished waking up */
  backendReady: boolean;

  /** Manually trigger a refresh */
  fetchNow: () => Promise<void>;
}

const DataContext = createContext<DataState | undefined>(undefined);

/* ------------------------------------------------------------------
 *  Provider
 * ---------------------------------------------------------------- */
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const settings = useSettings();

  const [state, setState] = useState<Omit<DataState, 'fetchNow'>>({
    risk: null,
    recommendation: null,
    lastUpdated: null,
    loading: false,
    error: null,
    backendReady: false,
  });

  /* --------------------------------------------------------------
   *  Ping the Render backend (/health) until it responds → ready
   * ------------------------------------------------------------ */
  const probeBackend = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
        cache: 'no-store',
      });
      return res.ok;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // Don’t start a second loop once it is ready.
    if (state.backendReady) return;

    let cancel = false;

    (async () => {
      while (!cancel) {
        const ok = await probeBackend();
        if (ok) {
          setState((s) => ({ ...s, backendReady: true }));
          break;
        }
        await new Promise((r) => setTimeout(r, 2000)); // 2 s back‑off
      }
    })();

    return () => {
      cancel = true;
    };
  }, [probeBackend, state.backendReady]);

  /* --------------------------------------------------------------
   *  Fetch the actual risk data once the backend is awake
   * ------------------------------------------------------------ */
  const fetchNow = useCallback(async () => {
    if (!state.backendReady || !settings.location) return;

    try {
      setState((s) => ({ ...s, loading: true, error: null }));

      const { lat, lon } = settings.location;
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        tone: (TONE_MAP[settings.skinTone] ?? 3).toString(),
        gender: settings.gender,
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/risk?${params.toString()}`,
        { cache: 'no-store' },
      );
      if (!res.ok) throw new Error(await res.text());

      const json: { score: number; advice: string } = await res.json();
      setState((s) => ({
        ...s,
        risk: json.score,
        recommendation: json.advice,
        lastUpdated: new Date(),
        loading: false,
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setState((s) => ({ ...s, loading: false, error: msg }));
    }
  }, [settings, state.backendReady]);

  /* Auto‑refresh every time the user changes location / profile */
  useEffect(() => {
    fetchNow();
  }, [fetchNow]);

  return (
    <DataContext.Provider value={{ ...state, fetchNow }}>
      {children}
    </DataContext.Provider>
  );
};

/* ------------------------------------------------------------------
 *  Hook
 * ---------------------------------------------------------------- */
export const useData = (): DataState => {
  const ctx = useContext(DataContext);
  if (!ctx)
    throw new Error('useData must be used inside a <DataProvider> component');
  return ctx;
};
