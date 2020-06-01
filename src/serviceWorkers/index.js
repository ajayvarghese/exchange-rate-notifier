import { serviceWorkers } from "./../constants";

const checkSupport = () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("No Service Worker support!");
  }
  if (!("PushManager" in window)) {
    throw new Error("No Push API Support!");
  }
};

const registerServiceWorker = async () => {
  try {
    const swRegistration = await navigator.serviceWorker.register(
      serviceWorker.PUSH_NOTIFICATION_WORKER
    );
    console.log("Successfully registered push service worker", swRegistration);
    return swRegistration;
  } catch (e) {
    console.error(e);
    throw new Error("Error whilst registering Push Service worker ");
  }
};

const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission(); // 'granted' | 'default' | 'denied'
  if (permission !== "granted") {
    console.error(
      "[Error]: Permission not granted for Notification, State: ",
      permission
    );
  }
};

const registerWorkboxWorker = () => {
  try {
    navigator.serviceWorker.register("/" + serviceWorker.WORKBOX_WORKER);
    console.log("Successfully registered Workbox worker", swRegistration);
  } catch (e) {
    console.error(e);
    throw new Error("Error whilst registering Workbox worker ");
  }
};

const registerServiceWorkers = () => {
  if ("serviceWorker" in navigator) {
    checkSupport();
    window.addEventListener("load", async () => {
      registerWorkboxWorker();
      const swRegistration = await registerServiceWorker();
      const permission = await requestNotificationPermission();
    });
  } else {
    console.error("Service Worker not supported");
  }
};

export default registerServiceWorkers;
