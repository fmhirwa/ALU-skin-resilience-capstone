/* public/sw.js */
const BACKOFF_MINUTES = 30;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', evt => {
  evt.waitUntil(self.clients.claim());
  poll();                                  // kick off first run
});

// ping the API every 30 min
async function poll () {
  try {
    const store = await self.registration.storage.get('settings') || {};
    if (!store.lat) return schedule();     // no profile yet
    const url = `/api/risk?lat=${store.lat}&lon=${store.lon}&tone=${store.tone}&gender=${store.gender}`;
    const r   = await fetch(url);
    if (!r.ok) throw new Error('API error');
    const { level, recommendation } = await r.json();

    // show notification only at Moderate+ (tweak)
    if (['High','Very High','Moderate'].includes(level)) {
      self.registration.showNotification(`UV Risk: ${level}`, {
        body: recommendation,
        icon: '/icon-192.png',             // optional
        tag: 'skin-risk'                   // replaces previous
      });
    }
  } catch (e) {
    console.error('poll error', e);
  }
  schedule();
}
function schedule () {
  setTimeout(poll, BACKOFF_MINUTES * 60 * 1_000);
}
