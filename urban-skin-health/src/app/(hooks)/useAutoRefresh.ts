import { useEffect, useRef } from 'react';

/**
 * Schedules fetches at ~06:00, 12:00, 18:00 local time.
 * Falls back to 6-hour intervals if page stayed open across days.
 */
export default function useAutoRefresh(cb: () => void) {
  const saved = useRef(cb);
  useEffect(() => { saved.current = cb; }, [cb]);

  useEffect(() => {
    const timer = () => saved.current();

    const computeDelay = () => {
      const now = new Date();
      const targets = [6, 12, 18].map(h => {
        const t = new Date(now); t.setHours(h, 0, 0, 0);
        if (t <= now) t.setDate(t.getDate() + 1);
        return t.getTime();
      });
      const next = Math.min(...targets);
      return next - now.getTime();
    };

    const id = setTimeout(() => {
      timer();
      /* after first fire, repeat every 6 h */
      const int = setInterval(timer, 6 * 60 * 60 * 1000);
      return () => clearInterval(int);
    }, computeDelay());

    return () => clearTimeout(id);
  }, []);
}
