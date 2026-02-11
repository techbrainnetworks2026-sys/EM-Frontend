/**
 * Service Worker for Team Monitoring Application
 * Handles push notifications and background sync
 */

// Listen for push events
self.addEventListener('push', (event) => {
    console.log('Push notification received:', event);

    if (!event.data) {
        console.warn('Push event has no data');
        return;
    }

    try {
        // Parse the push notification payload
        const payload = event.data.json();
        const {
            title = 'Team Monitoring',
            body = 'You have a new notification',
            icon = '/icon.png',
            badge = '/badge.png',
            tag = 'default',
            timestamp = Date.now(),
        } = payload;

        // Show the notification
        event.waitUntil(
            self.registration.showNotification(title, {
                body,
                icon,
                badge,
                tag,
                timestamp,
                requireInteraction: false, // Auto-dismiss after a few seconds
                actions: [
                    {
                        action: 'open',
                        title: 'Open',
                    },
                    {
                        action: 'close',
                        title: 'Close',
                    },
                ],
            })
        );
    } catch (error) {
        console.error('Error processing push notification:', error);

        // Show a fallback notification if JSON parsing fails
        event.waitUntil(
            self.registration.showNotification('Team Monitoring', {
                body: 'You have a new notification',
                icon: '/icon.png',
                badge: '/badge.png',
            })
        );
    }
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event.notification);

    event.notification.close();

    // Open or focus the app window
    event.waitUntil(
        clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if the app is already open
                const appClient = clientList.find(
                    (client) =>
                        client.url === '/' || client.url.includes('localhost') || client.url.includes('team-monitoring')
                );

                if (appClient) {
                    // Focus existing window
                    return appClient.focus();
                } else {
                    // Open a new window
                    return clients.openWindow('/');
                }
            })
    );
});

// Handle notification close events
self.addEventListener('notificationclose', (event) => {
    console.log('Notification closed:', event.notification);
});

// Handle service worker installation
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    // Claim all clients
    event.waitUntil(self.clients.claim());
});

// Handle background sync for offline notifications
self.addEventListener('sync', (event) => {
    console.log('Background sync event:', event.tag);

    if (event.tag === 'sync-notifications') {
        event.waitUntil(
            // Perform any background sync operations here
            Promise.resolve()
        );
    }
});
