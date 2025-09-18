// service-worker.js

const CACHE_NAME = "portfolio-cache-v4"; // bump version when you change files
const urlsToCache = [
  "/",               // root
  "/index.html",     // main page
  "/offline.html",   // fallback when offline
  "/styles.css",     // replace with your actual CSS file if any
  "/script.js",      // replace with your actual JS file if any
  "/myphoto.jpg",    // your profile picture
  "/favicon.ico",    // optional
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap",
];

// Install and cache files
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

// Fetch: serve from cache, fallback to network, fallback to offline.html
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        // if not found in cache, show offline.html for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match("/offline.html");
        }
      });
    })
  );
});
