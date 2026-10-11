// Lightweight placeholder helper for notifications
const sendNotification = async (to, subject, text) => {
  console.log(`[Notification Alert] To: ${to} | Subject: ${subject} | Message: ${text}`);
  return true;
};

module.exports = { sendNotification };