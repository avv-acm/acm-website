/* ACM Portal — Service Worker v2
 * Handles real browser push notifications + background sync
 * No external server required — uses Web Push + BroadcastChannel
 */

const CACHE_NAME = 'acm-portal-v2';
const SW_VERSION = '2.0.0';

// Install event — cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker v2 installed');
  self.skipWaiting();
});

// Activate event — clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker v2 activated');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Push event — fires real OS notification from any source
self.addEventListener('push', (event) => {
  let data = { title: 'ACM Portal', body: 'New activity on your club portal.', type: 'info' };
  
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const iconMap = {
    success: '/acm-logo.png',
    error:   '/acm-logo.png',
    warning: '/acm-logo.png',
    info:    '/acm-logo.png'
  };

  const options = {
    body: data.body,
    icon: iconMap[data.type] || '/acm-logo.png',
    badge: '/acm-logo.png',
    tag: 'acm-portal-' + (data.tag || data.type || 'default'),
    renotify: true,
    requireInteraction: data.type === 'error' || data.type === 'warning',
    data: { url: data.url || '/', type: data.type },
    actions: [
      { action: 'open', title: 'Open Portal' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(`ACM Portal — ${data.title}`, options)
  );
});

// Notification click — open/focus the portal tab
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // If portal already open, focus it
      const existing = clientList.find(c => c.url.includes(self.location.origin) && 'focus' in c);
      if (existing) return existing.focus();
      // Otherwise open new tab
      return clients.openWindow(urlToOpen);
    })
  );
});

// BroadcastChannel — lets the app trigger notifications directly through SW
// This enables REAL OS popups without needing a push server
const bc = new BroadcastChannel('acm-notifications');
bc.onmessage = (event) => {
  const { title, body, type, tag } = event.data || {};
  if (!title) return;

  const options = {
    body: body || '',
    icon: '/acm-logo.png',
    badge: '/acm-logo.png',
    tag: 'acm-' + (tag || type || 'info'),
    renotify: true,
    data: { url: '/', type: type || 'info' }
  };

  self.registration.showNotification(`ACM Portal — ${title}`, options);
};
