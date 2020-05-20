// Use a cacheName for cache versioning
var cacheName = "v1:static";

const urlB64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const saveSubscription = async (subscription) => {
  const SERVER_URL = "http://localhost:3000/save-subscription";
  const response = await fetch(SERVER_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return response.json();
};

// During the installation phase, you'll usually want to cache static assets.
self.addEventListener("install", async function (e) {
  // Once the service worker is installed, go ahead and fetch the resources to make this work offline.
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(assets).then(function () {
        self.skipWaiting();
      });
    })
  );
});

self.addEventListener("activate", async () => {
  // This will be called only once when the service worker is activated.
  try {
    const applicationServerKey = urlB64ToUint8Array(
      "BNhheX-eh8f2ZVJ7VhyDyiQ5uMG0F2Uw6CD5FxOP4RW9VSyeSv2OZUwHCRmEjwMoUanntbqpkKVvGI0fP38kQnU"
    );
    const options = { applicationServerKey, userVisibleOnly: true };
    const subscription = await self.registration.pushManager.subscribe(options);
    console.log(JSON.stringify(subscription));
  } catch (err) {
    console.log("Error", err);
  }
});

self.addEventListener("push", function (event) {
  const title = "Get Started With Workbox";
  if (event.data) {
    console.log("Push event!! ", event.data.text());
    const options = {
      body: event.data.text(),
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } else {
    console.log("Push event but no data");
  }
});

// when the browser fetches a URL…
self.addEventListener("fetch", function (event) {
  // … either respond with the cached object or go ahead and fetch the actual URL
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        // retrieve from cache
        return response;
      }
      // fetch as normal
      return fetch(event.request);
    })
  );
});
