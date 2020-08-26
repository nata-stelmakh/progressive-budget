console.log("Hi from your service-worker.js file!")

const FILES_TO_CACHE = [
    '/',
    '/all',
    '/index.html',
    '/styles.css',
    '/index.js',
    '/db.js',
    '/manifest.webmanifest',
    '../models/transaction.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
]
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";
//install
self.addEventListener('install', function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Your files were pre-cached successfully!");
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});


self.addEventListener("activate", function (evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

self.addEventListener('fetch', function (evt) {

    evt.respondWith(
        caches.match(evt.request).then(function (response) {
            return response || fetch(evt.request);


        })
    );
});