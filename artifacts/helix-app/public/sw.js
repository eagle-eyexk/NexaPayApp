// NEXA Service Worker — Push Notifications + Offline Cache
const CACHE_NAME = 'nexa-v1';
const NEXA_LOGO = '/nexa-logo.png';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([NEXA_LOGO, '/manifest.json']))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Handle push events from the NEXA server
self.addEventListener('push', (event) => {
  let data = { title: 'NEXA', body: 'You have a new notification', url: '/', type: 'info' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch (_) {}

  const iconMap = {
    payment: NEXA_LOGO,
    transaction: NEXA_LOGO,
    security: NEXA_LOGO,
    info: NEXA_LOGO,
  };

  const options = {
    body: data.body,
    icon: iconMap[data.type] ?? NEXA_LOGO,
    badge: NEXA_LOGO,
    image: data.type === 'payment' ? NEXA_LOGO : undefined,
    data: { url: data.url ?? '/' },
    vibrate: [200, 100, 200],
    requireInteraction: data.type === 'security',
    actions: data.type === 'payment'
      ? [
          { action: 'view', title: '👀 View Transaction' },
          { action: 'dismiss', title: 'Dismiss' },
        ]
      : [{ action: 'open', title: 'Open NEXA' }],
    tag: data.type,
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/dashboard';

  if (event.action === 'dismiss') return;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(self.location.origin));
      if (existing) {
        existing.focus();
        existing.navigate(url);
      } else {
        self.clients.openWindow(url);
      }
    })
  );
});

// Periodic background sync for balance updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'nexa-balance-check') {
    event.waitUntil(
      fetch('/api/user/wallets', { credentials: 'include' })
        .then((r) => r.json())
        .then((wallets) => {
          const nexa = wallets.find((w) => w.currency === 'NEXA');
          if (nexa) {
            self.registration.showNotification('NEXA Balance Update', {
              body: `Your NEXA balance: ${parseFloat(nexa.balance).toFixed(4)} NEXA`,
              icon: NEXA_LOGO,
              badge: NEXA_LOGO,
              tag: 'balance-update',
              silent: true,
            });
          }
        })
        .catch(() => {})
    );
  }
});
