const { env } = process;

const fetch = require("node-fetch");
const dummyDb = { subscriptions: [], rates: [] }; //dummy in memory store

const webpush = require("./webpush");

const URLS = {
  CURR_CONV: `https://free.currconv.com/api/v7/convert?q=EUR_INR&compact=ultra&apiKey=${env.API_KEY}`,
};

const saveToDatabase = async (subscription) => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  dummyDb.subscriptions.push(subscription);
};

//function to send the notification to the subscribed device

const saveSubscription = async (req, res) => {
  const subscription = req.body;
  console.log("subscription", subscription);
  await saveToDatabase(subscription); //Method to save the subscription to Database
  res.json({ message: "success", subscription });
};

const getEuroInrConvRate = async () => {
  try {
    const response = await fetch(URLS.CURR_CONV);
    const data = await response.json();
    return data;
  } catch (e) {
    console.error("Error", e);
  }
};

const getEurInrConversionRate = async function (req, res) {
  const data = await getEuroInrConvRate();
  dummyDb.rates.push(data.EUR_INR);
  res.json({ ...data, dummyDb });
};

const pushNotification = (message) => {
  const subscriptions = dummyDb.subscriptions; //get subscription from your database here.
  webpush.pushNotification(
    subscriptions,
    message + ` | Prev Rate: ${dummyDb.rates[dummyDb.rates.length - 1]}`
  );
};

const sendNotification = (req, res) => {
  pushNotification("Hello World");
  res.json({ message: "message sent" });
};

const sayHello = (req, res) => {
  res.json({ message: "Server says Hello" });
};

module.exports = {
  saveSubscription,
  getEurInrConversionRate,
  getEuroInrConvRate,
  sendNotification,
  sayHello,
  pushNotification,
};
