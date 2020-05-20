const URLS = {
  FOREX: "http://localhost:3000/eur-to-inr",
};

const fetchData = async (url, method = "GET", customOptions) => {
  const options = { ...customOptions, method };
  const responsePromise = await fetch(url, options);
  const response = await responsePromise.json();
  return response;
};

const KEYS = {
  LAST_CHECKED_DATE: "lastCheckedDate",
};

async function init() {
  const response = await fetchData(URLS.FOREX);
  document.getElementById("inr").textContent = response.EUR_INR;
  const date = new Date();
  document.getElementById("date").textContent =
    date.getDate() + " / " + date.getMonth() + " / " + date.getFullYear();
}

window.onload = init;

const check = () => {
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
  const permission = await window.Notification.requestPermission();
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.
  if (permission !== "granted") {
    throw new Error("Permission not granted for Notification");
  }
};

if ("serviceWorker" in navigator && PROD) {
  check();
  window.addEventListener("load", async () => {
    const swRegistration = await registerServiceWorker();
    const permission = await requestNotificationPermission();
  });
}
