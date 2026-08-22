/* Contemporary Art Hub — keep a fetch handler so Chrome will install the app. */
const CACHE = "art-hub-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const home = self.registration.scope;
      try {
        await cache.add(home);
      } catch {
        /* first visit still works without a precache */
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.headers.has("range")) return;
  if (url.pathname.includes("/api/")) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.ok && url.protocol.startsWith("http")) {
          cache.put(req, fresh.clone());
        }
        return fresh;
      } catch {
        const cached = await cache.match(req);
        if (cached) return cached;
        if (req.mode === "navigate") {
          const shell = await cache.match(self.registration.scope);
          if (shell) return shell;
        }
        throw new Error("offline");
      }
    })(),
  );
});
