const CACHE_NAME = "portfolio-cache-v1";
const urlsToCache = [
  "/",              // homepage
  "/index.html",
  "/styles.css",    // your CSS file (update with your actual filename if different)
  "/script.js",     // your JS file (update if different)
  "/myphoto.jpg",   // example image (add your actual images if needed)
];

// Install: cache assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate: clear old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// Fetch: try cache first, fallback to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
