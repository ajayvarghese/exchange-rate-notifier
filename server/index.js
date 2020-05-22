const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser"); //used to extract the body from the incoming requests
require("dotenv").config();
const app = express();
const schedule = require("node-schedule");
const { setup } = require("./webpush");

const {
  saveSubscription,
  getEurInrConversionRate,
  sendNotification,
  sayHello,
  getEuroInrConvRate,
  pushNotification,
} = require("./services");

const rule = new schedule.RecurrenceRule();
rule.hour = [9, 12, 14, 16];

var j = schedule.scheduleJob(rule, async function (yo) {
  console.log("Yoooo Schedule works", yo);
  const { EUR_INR } = await getEuroInrConvRate();
  pushNotification(`Current Rate: ${EUR_INR}`);
});

setup();
app.use(cors());

const { PORT } = process.env;

// It extracts the data out of the request headers like the form data, etc,.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const ENDPOINTS = {
  SAVE_SUBSCRIPTION: "/save-subscription",
  EUR_INR: "/eur-to-inr",
  SEND_NOTIFICATION: "/send-notification",
  HOME: "/",
};

const services = {
  SAVE_SUBSCRIPTION: saveSubscription,
  EUR_INR: getEurInrConversionRate,
  SEND_NOTIFICATION: sendNotification,
  HOME: sayHello,
};

app.post(ENDPOINTS.SAVE_SUBSCRIPTION, services.SAVE_SUBSCRIPTION);
app.use(ENDPOINTS.EUR_INR, services.EUR_INR);
app.get(ENDPOINTS.SEND_NOTIFICATION, services.SEND_NOTIFICATION);
app.use(ENDPOINTS.HOME, services.HOME);

// Serve the files on port 3000.
app.listen(PORT, function () {
  console.log(`Server running on port ${PORT}!\n`);
});
