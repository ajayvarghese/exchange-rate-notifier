const ENDPOINT = "https://i-general-purpose-server.herokuapp.com";
// const ENDPOINT = "http://localhost:3000";
export const URLS = {
  FOREX: `${ENDPOINT}/eur-to-inr`,
};

export const serviceWorkers = {
  WORKBOX_WORKER: "workboxWorker.js",
  PUSH_NOTIFICATION_WORKER: "pushNotificationWorker.js",
};
