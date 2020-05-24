import { precacheAndRoute } from "workbox-precaching";

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js"
);

precacheAndRoute(self.__WB_MANIFEST);

workbox.routing.registerRoute(
  "https://notifier-app-server.herokuapp.com/eur-to-inr",
  new workbox.strategies.NetworkFirst({
    cacheName: "currencies",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 10 * 60, // 10 minutes
      }),
    ],
  })
);
