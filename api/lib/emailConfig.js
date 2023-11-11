module.exports = {
  pool: true,
  service: "hotmail",
  port: 2525,
  auth: {
    user: "pricewizard@outlook.com",
    pass: process.env.EMAIL_PASSWORD,
  },
  maxConnections: 1,
};
