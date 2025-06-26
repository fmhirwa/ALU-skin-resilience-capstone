/* src/app/(providers)/settings-provider.tsx */
'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { atomWithStorage } from 'jotai/utils';
import { useAtom } from 'jotai';
/*import { atom, useAtom } from 'jotai';*/

export type SkinTone = 'light' | 'medium' | 'dark' | 'deep';
export type Gender   = 'male' | 'female' | 'other' | 'na';

interface SettingsState {
  skinTone: SkinTone;
  gender:   Gender;
  location?: { lat: number; lon: number; city?: string };
  darkMode: boolean;
  set: (patch: Partial<Omit<SettingsState, 'set'>>) => void;
}

/* ─── atoms with localStorage persistence ─── */
const skinToneAtom = atomWithStorage<SkinTone>('skinTone', 'medium');
const genderAtom   = atomWithStorage<Gender>('gender', 'na');
const locAtom      = atomWithStorage<SettingsState['location'] | undefined>(
  'location',
  undefined
);
const darkAtom     = atomWithStorage<boolean>('darkMode', false);

/* ─── context ─── */
const SettingsContext = createContext<SettingsState | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [skinTone, setSkinTone] = useAtom(skinToneAtom);
  const [gender,   setGender]   = useAtom(genderAtom);
  const [location, setLocation] = useAtom(locAtom);
  const [darkMode, setDark]     = useAtom(darkAtom);

  // One‐time geolocation on first mount
  useEffect(() => {
    if (!location && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        ()   => {/* ignore errors */}
      );
    }
  }, [location, setLocation]);

  // high‐level setter
  const set = (patch: Partial<Omit<SettingsState, 'set'>>) => {
    if (patch.skinTone !== undefined) setSkinTone(patch.skinTone);
    if (patch.gender   !== undefined) setGender  (patch.gender);
    if (patch.location !== undefined) setLocation(patch.location);
    if (patch.darkMode !== undefined) setDark    (patch.darkMode);
  };

  return (
    <SettingsContext.Provider value={{ skinTone, gender, location, darkMode, set }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
