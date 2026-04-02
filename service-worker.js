'use strict';

const CACHE_NAME = 'vibrant-academy-v2.0.0';
const RUNTIME_CACHE = 'vibrant-academy-runtime';

/**
 * Install event - skip caching, activate immediately
 */
self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
});

/**
 * Activate event - clean up all old caches
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

/**
 * Fetch event - network-first strategy, cache only as fallback for offline
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') {
        return;
    }

    if (!request.url.startsWith('http')) {
        return;
    }

    const url = new URL(request.url);
    const isOwnOrigin = url.origin === self.location.origin;
    const isFontOrResource = request.url.includes('fonts.googleapis.com') ||
                             request.url.includes('fonts.gstatic.com');

    if (!isOwnOrigin && !isFontOrResource) {
        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                if (!response || response.status !== 200 || response.type === 'opaque') {
                    return response;
                }

                const responseToCache = response.clone();

                caches.open(RUNTIME_CACHE)
                    .then((cache) => {
                        cache.put(request, responseToCache);
                    })
                    .catch(() => {
                        // Cache write failed, continue without caching
                    });

                return response;
            })
            .catch(() => {
                return caches.match(request)
                    .then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        
                        return new Response(
                            JSON.stringify({
                                error: 'Offline',
                                message: 'You are offline and this content is not cached'
                            }),
                            {
                                status: 503,
                                statusText: 'Service Unavailable',
                                headers: new Headers({
                                    'Content-Type': 'application/json'
                                })
                            }
                        );
                    });
            })
    );
});

/**
 * Message event - handle cache clearing
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});
