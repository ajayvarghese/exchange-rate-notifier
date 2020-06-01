import { URLS } from "./constants";
import { fetchData } from "./request";
import registerServiceWorker from "./serviceWorker";
import "./model";

async function init() {
  const response = await fetchData(URLS.FOREX);
  document.getElementById("inr").textContent = response.EUR_INR;
  const date = new Date();
  document.getElementById("date").textContent =
    date.getDate() + "." + date.getMonth() + "." + date.getFullYear();
}

registerServiceWorker();

window.onload = init;
