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
    const swRegistration = await navigator.serviceWorker.register("/sw.js");
    console.log("Successfully registered service worker", swRegistration);
    return swRegistration;
  } catch (e) {
    console.error(e);
    throw new Error("Error whilst registering Service worker ");
  }
};

const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission(); // 'granted' | 'default' | 'denied'
  if (permission !== "granted") {
    throw new Error("Permission not granted for Notification");
  }
};

export const register = () => {
  if ("serviceWorker" in navigator) {
    checkSupport();
    window.addEventListener("load", async () => {
      const swRegistration = await registerServiceWorker();
      const permission = await requestNotificationPermission();
    });
  }
};
