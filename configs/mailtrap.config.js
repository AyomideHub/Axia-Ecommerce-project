const { MailtrapClient } = require("mailtrap");

const client = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "Market.com",
};

module.exports = {client, sender}