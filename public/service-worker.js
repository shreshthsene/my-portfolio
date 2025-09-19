// service-worker.js

const CACHE_NAME = "portfolio-cache-v3"; // bump version when updating
const urlsToCache = [
  "/",                 
  "/index.html",       
  "/styles.css",       // replace with your actual CSS filename
  "/myphoto.jpg",      
  "/images/hero.avif", // hero image (modern format)
  "/images/hero.webp", // hero fallback
  "/images/hero.jpg",  // hero fallback
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap",
  // Add real font .woff2 files (check DevTools → Network → filter by "font")
  "https://fonts.gstatic.com/s/inter/v12/abcdef12345.woff2"
];

// Install: pre-cache important files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate: clean old caches
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

// Fetch handler
self.addEventListener("fetch", (event) => {
  // Special handling for Google Fonts
  if (
    event.request.url.includes("fonts.googleapis.com") ||
    event.request.url.includes("fonts.gstatic.com")
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((res) => {
            cache.put(event.request, res.clone());
            return res;
          })
          .catch(() => caches.match(event.request));
      })
    );
    return;
  }

  // Default: Cache-first strategy
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
