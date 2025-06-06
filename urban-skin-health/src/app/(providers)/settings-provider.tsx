'use client';
import React, { createContext, useContext, useEffect } from 'react';
import { atom, useAtom } from 'jotai';

export type SkinTone = 'light' | 'medium' | 'dark' | 'deep';
export type Gender   = 'male' | 'female' | 'other' | 'na';

interface SettingsState {
  skinTone: SkinTone;
  gender: Gender;
  location?: { lat: number; lon: number; city?: string };
  darkMode: boolean;
  set: (patch: Partial<Omit<SettingsState, 'set'>>) => void;
}

/* ---------- atoms ---------- */
const skinToneAtom = atom<SkinTone>('medium');
const genderAtom   = atom<Gender>('na');
const locAtom      = atom<SettingsState['location']>(undefined);
const darkAtom     = atom<boolean>(false);

/* Persist & hydrate from localStorage */
[s​kinToneAtom, genderAtom, locAtom, darkAtom].forEach(a => {
  a.onMount = set => {
    const key = a.toString();
    try {
      const raw = localStorage.getItem(key);
      if (raw) set(JSON.parse(raw));
    } catch {}
    return v => localStorage.setItem(key, JSON.stringify(v));
  };
});

/* ---------- context ---------- */
const SettingsContext = createContext<SettingsState | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [skinTone, setSkinTone] = useAtom(skinToneAtom);
  const [gender, setGender]     = useAtom(genderAtom);
  const [location, setLocation] = useAtom(locAtom);
  const [darkMode, setDark]     = useAtom(darkAtom);

  /* Optional: auto-get geolocation on first mount */
  useEffect(() => {
    if (!location && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        p => setLocation({ lat: p.coords.latitude, lon: p.coords.longitude }),
        () => {/* ignore user denial */}
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (patch: Partial<Omit<SettingsState, 'set'>>) => {
    patch.skinTone !== undefined && setSkinTone(patch.skinTone);
    patch.gender   !== undefined && setGender(patch.gender);
    patch.location !== undefined && setLocation(patch.location);
    patch.darkMode !== undefined && setDark(patch.darkMode);
  };

  return (
    <SettingsContext.Provider value={{ skinTone, gender, location, darkMode, set }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be inside SettingsProvider');
  return ctx;
};
