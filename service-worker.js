'use strict';

const CACHE_NAME = 'vibrant-academy-v1.8.0';
const RUNTIME_CACHE = 'vibrant-academy-runtime';

// Application code files that should always be fetched from network first
const NETWORK_FIRST_URLS = [
    './index.html',
    './styles.css',
    './config.js',
    './data.js',
    './app.js',
    './music-data.js',
    './music-app.js',
    './manifest.json'
];

// Static assets that can be cached (images, fonts, etc.)
const CACHE_FIRST_ASSETS = [
    './',
    './icon/logo.png'
];

/**
 * Install event - cache static assets only
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(CACHE_FIRST_ASSETS);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

/**
 * Check if URL should use network-first strategy
 */
function shouldUseNetworkFirst(url) {
    return NETWORK_FIRST_URLS.some(pattern => url.includes(pattern));
}

/**
 * Network-first strategy with cache fallback
 */
function networkFirstStrategy(request) {
    return fetch(request)
        .then((response) => {
            // Only cache valid responses
            if (response && response.status === 200 && response.type !== 'opaque') {
                const responseToCache = response.clone();
                caches.open(RUNTIME_CACHE)
                    .then((cache) => {
                        cache.put(request, responseToCache);
                    })
                    .catch(() => {
                        // Silently fail cache write
                    });
            }
            return response;
        })
        .catch(() => {
            // Network failed, try cache as fallback
            return caches.match(request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // No cache available, return offline response
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
        });
}

/**
 * Cache-first strategy with network fallback
 */
function cacheFirstStrategy(request) {
    return caches.match(request)
        .then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request)
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
                            // Silently fail cache write
                        });

                    return response;
                })
                .catch(() => {
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
        });
}

/**
 * Fetch event - network-first for app code, cache-first for static assets
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip non-http(s) requests
    if (!request.url.startsWith('http')) {
        return;
    }

    // Skip cross-origin requests (except fonts and external resources we want to cache)
    const url = new URL(request.url);
    const isOwnOrigin = url.origin === self.location.origin;
    const isFontOrResource = request.url.includes('fonts.googleapis.com') ||
                             request.url.includes('fonts.gstatic.com');

    if (!isOwnOrigin && !isFontOrResource) {
        return;
    }

    // Use network-first strategy for application code
    if (shouldUseNetworkFirst(request.url)) {
        event.respondWith(networkFirstStrategy(request));
    } else {
        // Use cache-first strategy for static assets
        event.respondWith(cacheFirstStrategy(request));
    }
});

/**
 * Message event - handle messages from clients
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
