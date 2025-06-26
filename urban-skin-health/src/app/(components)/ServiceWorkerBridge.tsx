'use client';
import { useEffect } from 'react';
import { useSettings } from '../(providers)/settings-provider';

/* map UI tone names → integers required by backend */
const TONE_MAP: Record<string, number> = {
  light: 1,
  medium: 2,
  dark: 3,
  deep: 4
};

/* this component has NO UI; it just registers the SW and streams profile */
export default function ServiceWorkerBridge() {
  const settings = useSettings();      // inside <SettingsProvider/>

  /* 1) register sw.js once */
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  /* 2) push latest profile to SW whenever it changes */
  useEffect(() => {
    if (!('serviceWorker' in navigator) || !settings.location) return;

    const toneNum = TONE_MAP[settings.skinTone] ?? 3;
    const payload = {
      lat:    settings.location.lat.toString(),
      lon:    settings.location.lon.toString(),
      tone:   toneNum,
      gender: settings.gender
    };

    navigator.serviceWorker.ready.then(reg => {
      reg.active?.postMessage({ type: 'SET_PROFILE', payload });
    });
  }, [settings]);

  /* 3) ask for notification permission once */
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return null;   // renders nothing
}
