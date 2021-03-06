// prod.js - production keys here!!
module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  sendGridKey: process.env.SEND_GRID_KEY,
  redirectDomain: process.env.REDIRECT_DOMAIN,
  mailchimpListUniqueId: process.env.MAILCHIMP_LIST_ID,
  mailchimpApiKey: process.env.MAILCHIMP_API_KEY,
  aolEmail: process.env.AOL_EMAIL,
  aolPassword: process.env.AOL_PASSWORD
};
