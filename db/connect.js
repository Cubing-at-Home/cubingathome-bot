const firebase = require("firebase-admin");
require("dotenv").config();

firebase.initializeApp({
    credential: firebase.credential.cert({
      "projectId": process.env.FIREBASE_PROJECT_ID,
      "privateKey": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      "clientEmail": process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });

const db = firebase.firestore();

module.exports = db;