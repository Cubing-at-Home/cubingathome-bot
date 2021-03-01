const firebase = require("firebase-admin");
require("dotenv").config();

const serviceAccount = process.env.NODE_ENV === "production" 
?
{
    "projectId": process.env.CAH_FB_ID,
    "privateKey": process.env.CAH_FB_KEY.replace(/\\n/g, '\n'),
    "clientEmail": process.env.CAH_FB_EMAIL
}
:
{
    "projectId": process.env.DEV_CAH_FB_ID,
    "privateKey": process.env.DEV_CAH_FB_KEY.replace(/\\n/g, '\n'),
    "clientEmail": process.env.DEV_CAH_FB_EMAIL
}

firebase.initializeApp({
    credential: firebase.credential.cert({
      "projectId": process.env.FIREBASE_PROJECT_ID,
      "privateKey": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      "clientEmail": process.env.FIREBASE_CLIENT_EMAIL,
    })
});

// const cahFB = firebase.initializeApp({
//   credential: firebase.credential.cert(serviceAccount)
// }, "cahDB");

const defaultDB = firebase.firestore();
//const cahDB = cahFB.firestore();

module.exports = {
  defaultDB: defaultDB//,
  //cahDB: cahDB
};