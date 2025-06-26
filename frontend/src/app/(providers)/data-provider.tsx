'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSettings } from './settings-provider';

/* ---------- map UI skin-tone strings -> integer expected by backend ---------- */
const TONE_MAP: Record<string, number> = {
  light: 1,
  medium: 2,
  dark: 3,
  deep: 4
};

/* ---------- types ---------- */
type DataState = {
  risk: number | null;            // gauge 0–100
  recommendation: string | null;
  lastUpdated: Date | null;
  loading: boolean;
  error: string | null;
  fetchNow: () => Promise<void>;
};

const DataContext = createContext<DataState | null>(null);

/* ---------- provider ---------- */
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const settings = useSettings();

  const [{ risk, recommendation, lastUpdated, loading, error }, setState] =
    useState<Omit<DataState, 'fetchNow'>>({
      risk: null,
      recommendation: null,
      lastUpdated: null,
      loading: false,
      error: null
    });

  const fetchNow = async () => {
    if (!settings.location) return;

    try {
      setState(s => ({ ...s, loading: true, error: null }));

      const { lat, lon } = settings.location;
      const toneNum = TONE_MAP[settings.skinTone] ?? 3;      // default to 3 = dark

      const params = new URLSearchParams({
        lat:    lat.toString(),
        lon:    lon.toString(),
        tone:   toneNum.toString(),
        gender: settings.gender
      });

      const res = await fetch(`/api/risk?${params.toString()}`);
      if (!res.ok) throw new Error(await res.text());

      const json: { score: number; advice: string } = await res.json();
      setState({
        risk: json.score,
        recommendation: json.advice,
        lastUpdated: new Date(),
        loading: false,
        error: null
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setState(s => ({ ...s, loading: false, error: msg }));
    }
  };

  /* refetch whenever location, tone, or gender change */
  useEffect(() => {
    fetchNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.location, settings.skinTone, settings.gender]);

  return (
    <DataContext.Provider
      value={{ risk, recommendation, lastUpdated, loading, error, fetchNow }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be inside DataProvider');
  return ctx;
};
