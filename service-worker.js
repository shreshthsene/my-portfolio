// service-worker.js

const CACHE_NAME = "portfolio-cache-v3"; // bump version
const urlsToCache = [
  "/",               // root
  "/index.html",     // main HTML
  "/styles.css",     // replace with actual CSS filename
  "/script.js",      // replace with actual JS filename
  "/myphoto.jpg",    // replace with your profile image
  "/favicon.ico",    // if you have a favicon
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap",
];

// Install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate and clean old caches
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
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
