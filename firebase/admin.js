const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://order-services-a33dc.firebaseio.com"
});

module.exports = admin;