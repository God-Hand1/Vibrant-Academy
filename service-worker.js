'use strict';

const CACHE_VERSION = 'v1.8.0';
const CACHE_NAME = `vibrant-academy-${CACHE_VERSION}`;

const CORE_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/config.js',
    '/data.js',
    '/manifest.json',
    '/icon/logo.png',
    '/icon/icon-192.png',
    '/icon/icon-512.png'
];

const MAX_CACHE_SIZE = 100;
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(CORE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name.startsWith('vibrant-academy-') && name !== CACHE_NAME)
                        .map((name) => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    if (!request.url.startsWith('http://') && !request.url.startsWith('https://')) {
        return;
    }
    
    if (request.method !== 'GET') {
        return;
    }
    
    event.respondWith(
        fetch(request)
            .then((response) => {
                if (!response || response.status !== 200 || response.type === 'error') {
                    return response;
                }
                
                const responseToCache = response.clone();
                
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, responseToCache);
                    
                    cache.keys().then((keys) => {
                        if (keys.length > MAX_CACHE_SIZE) {
                            cache.delete(keys[0]);
                        }
                    });
                });
                
                return response;
            })
            .catch(() => {
                return caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    if (request.destination === 'document') {
                        return caches.match('./index.html');
                    }
                    
                    return new Response('Offline - Resource not available', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({
                            'Content-Type': 'text/plain'
                        })
                    });
                });
            })
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
