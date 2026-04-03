'use strict';

/**
 * Service Worker - Network-First, No Cache Strategy
 * Always fetches fresh content from the server
 * No caching to ensure users always get the latest code
 */

const CACHE_NAME = 'vibrant-academy-no-cache';

/**
 * Install event - skip waiting immediately
 */
self.addEventListener('install', (event) => {
    // Skip waiting to activate immediately
    self.skipWaiting();
});

/**
 * Activate event - clean up all caches and take control
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                // Delete all existing caches
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
            .then(() => {
                // Take control of all clients immediately
                return self.clients.claim();
            })
    );
});

/**
 * Fetch event - always fetch from network, no caching
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

    // Network-first strategy with no caching
    event.respondWith(
        fetch(request, {
            cache: 'no-store', // Don't use browser cache
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        })
        .then((response) => {
            // Return fresh response from network
            return response;
        })
        .catch((error) => {
            // If network fails, return error response
            return new Response(
                JSON.stringify({
                    error: 'Network Error',
                    message: 'Unable to fetch content. Please check your internet connection.'
                }),
                {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate'
                    })
                }
            );
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
