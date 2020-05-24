// Use a cacheName for cache versioning
var cacheName = "v1:static";
const API_ENDPOINT = "https://exhange-rate-notifier.netlify.app";

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
  try {
    const SERVER_URL = `${API_ENDPOINT}/save-subscription`;
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });
    return response.json();
  } catch (e) {
    console.error("[SW-Error]", e);
  }
};

// During the installation phase, you'll usually want to cache static assets.
self.addEventListener("install", async function (e) {
  console.log("INSTALLING...");
  // Once the service worker is installed, go ahead and fetch the resources to make this work offline.
  //   e.waitUntil(
  //     caches.open(cacheName).then(function (cache) {
  //       return cache.addAll(assets).then(function () {
  //         self.skipWaiting();
  //       });
  //     })
  //   );
});

self.addEventListener("activate", async () => {
  console.log("ACTIVATING...");
  // This will be called only once when the service worker is activated.
  try {
    const applicationServerKey = urlB64ToUint8Array(
      "BBq5VuBvjv0KiDTvB4vmPu8y2LfjCOw8hFjldGw9FGj7X1lG5C0h1eMtf7o_GoBqCKYV0Y_-azSmnEPi1NQZ440"
    );
    const options = { applicationServerKey, userVisibleOnly: true };
    const subscription = await self.registration.pushManager.subscribe(options);
    const response = await saveSubscription(subscription);
    console.log(response);
  } catch (err) {
    console.log("Error", err);
  }
});

self.addEventListener("push", function (event) {
  if (event.data) {
    console.log("Push event!! ", event.data.text());
    showLocalNotification("Yolo", event.data.text(), self.registration);
  } else {
    console.log("Push event but no data");
  }
});

const showLocalNotification = (title, body, swRegistration) => {
  const options = {
    body,
    // here you can add more properties like icon, image, vibrate, etc.
  };
  swRegistration.showNotification(title, options);
};

// when the browser fetches a URL…
self.addEventListener("fetch", function (event) {
  console.log("FETCHING", event);
  // … either respond with the cached object or go ahead and fetch the actual URL
  //   event.respondWith(
  //     caches.match(event.request).then(function (response) {
  //       if (response) {
  //         // retrieve from cache
  //         return response;
  //       }
  //       // fetch as normal
  //       return fetch(event.request);
  //     })
  //   );
});
