// service-worker.js

const CACHE_NAME = "portfolio-cache-v1";
const urlsToCache = [
  "/",               // homepage
  "/index.html",     // main HTML
  "/myphoto.jpg",    // your profile image
  "/styles.css",     // your CSS (update with real filename if different)
  "/script.js",      // your JS (update with real filename if different)
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap",
];

// Install service worker and cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate and remove old caches
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
});

// Fetch requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Serve from cache, or fetch from network
      return (
        response ||
        fetch(event.request).catch(() =>
          caches.match("/index.html") // fallback to homepage if offline
        )
      );
    })
  );
});
