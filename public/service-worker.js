const cacheName = "appV1";

const urlsToCache = [
    "/",
    "/index.html",
    "/index.css",
    "/manifest.json",
    "/Logo-Small-Light.png",
    "/static/js/main.js",
    "/static/css/main.css",
    "/static/media/banner.mp4",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(urlsToCache)
                .then(() => console.log("Assets cached"))
                .catch((error) => console.error("Error caching assets:", error));
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== cacheName) {
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
    const requestUrl = new URL(event.request.url);

    if (requestUrl.origin === 'https://api.dicebear.com' && requestUrl.pathname === '/5.x/initials/svg') {
        event.respondWith(
            caches.open('user-image-cache').then((cache) => {
                return cache.match(event.request).then((response) => {
                    return response || fetch(event.request).then((networkResponse) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            }).catch(() => {
                return new Response("Offline", {
                    status: 503,
                    statusText: "Service Unavailable",
                    headers: new Headers({
                        "Content-Type": "text/plain",
                    }),
                });
            })
        );
    }
});
