// service-worker.js

const CACHE_NAME = "portfolio-cache-v1";
const urlsToCache = [
  "/",               // homepage
  "/index.html",     // main HTML
  "/styles.css",     // update with your actual CSS file
  "/script.js",      // update with your actual JS file
  "/myphoto.jpg",    // profile image
  "/favicon.ico",    // favicon if you have one
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap",
];

// Install: cache important files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
