
'use strict';

const CACHE_NAME = 'vibrant-academy-v1.7.1';
const RUNTIME_CACHE = 'vibrant-academy-runtime';

// Core assets to cache on install
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './config.js',
    './data.js',
    './app.js',
    './icon/logo.png',
    './manifest.json'
];

/**
 * Install event - cache core assets
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                return self.skipWaiting();
            })
            .catch(() => {
                // Cache installation failed - will retry on next load
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
 * Fetch event - cache-first strategy with network fallback
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
    
    // Cache-first strategy
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached version
                    return cachedResponse;
                }
                
                // Not in cache, fetch from network
                return fetch(request)
                    .then((response) => {
                        // Check if valid response
                        if (!response || response.status !== 200) {
                            return response;
                        }
                        
                        // Clone the response
                        const responseToCache = response.clone();
                        
                        // Cache the new response
                        caches.open(RUNTIME_CACHE)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            })
                            .catch(() => {
                                // Cache put failed - continue without caching
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // Return offline message
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
