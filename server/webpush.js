const webpush = require("web-push");
const { env } = process;

function setup() {
  const vapidKeys = {
    publicKey: env.VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY,
  };

  webpush.setVapidDetails(
    `mailto:${env.EMAIL}`,
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  return webpush;
}

const pushNotification = (subscriptions, dataToSend = "") => {
  subscriptions.forEach((subscription) => {
    webpush.sendNotification(subscription, dataToSend);
  });
};

module.exports = {
  setup,
  pushNotification,
};
