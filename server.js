const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const cors = require("cors");
var bodyParser = require("body-parser"); //used to extract the body from the incoming requests
const app = express();
const webpush = require("web-push");

app.use(cors());
// const config = require("./webpack.config.js");
// const compiler = webpack(config);
const fetch = require("node-fetch");
require("dotenv").config();
const { env } = process;

const URLS = {
  CURR_CONV: `https://free.currconv.com/api/v7/convert?q=EUR_INR&compact=ultra&apiKey=${env.API_KEY}`,
};

// It extracts the data out of the request headers like the form data, etc,.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
// app.use(
//   webpackDevMiddleware(compiler, {
//     publicPath: config.output.publicPath,
//   })
// );
const dummyDb = { subscription: null }; //dummy in memory store

const saveToDatabase = async (subscription) => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  dummyDb.subscription = subscription;
};

const vapidKeys = {
  publicKey: env.VAPID_PUBLIC_KEY,
  privateKey: env.VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  `mailto:${env.EMAIL}`,
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend = "") => {
  webpush.sendNotification(subscription, dataToSend);
};

app.post("/save-subscription", async (req, res) => {
  const subscription = req.body;
  console.log("subscription", subscription);
  await saveToDatabase(subscription); //Method to save the subscription to Database
  res.json({ message: "success", subscription });
});

app.use("/eur-to-inr", async function (req, res) {
  const response = await fetch(URLS.CURR_CONV);
  const data = await response.json();
  res.json(data);
});

app.get("/send-notification", (req, res) => {
  const subscription = dummyDb.subscription; //get subscription from your databse here.
  const message = "Hello World";
  sendNotification(subscription, message);
  res.json({ message: "message sent" });
});

app.use("/", (req, res) => {
  res.json({ message: "Server says Hello" });
});

// Serve the files on port 3000.
app.listen(env.port, function () {
  console.log(`Server running on port ${env.port}!\n`);
});
