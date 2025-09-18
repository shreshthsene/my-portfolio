// service-worker.js

const CACHE_NAME = "portfolio-cache-v4"; // bump version every update
const urlsToCache = [
  "/",               // root
  "/index.html",     // main HTML
  "/styles.css",     // replace with actual CSS filename
  "/script.js",      // replace with actual JS filename
  "/myphoto.jpg",    // replace with your profile image
  "/favicon.ico",    // favicon if available
  "/offline.html",   // 👈 offline fallback page
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap",
];

// Install service worker & cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate & remove old caches
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

// Fetch requests with offline fallback
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          // if request is for HTML page → fallback to offline.html
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("/offline.html");
          }
        })
      );
    })
  );
});
