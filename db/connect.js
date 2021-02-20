const firebase = require("firebase-admin");
//const serviceAccount = require("./firebase.json");
require("dotenv").config();
const serviceAccount = {
    "type":process.env.type,
    "project_id":process.env.project_id,
    "private_key":process.env.private_key,
    "private_key_id":process.env.private_key_id,
    "client_email":process.env.client_email,
    "auth_uri":process.env.auth_uri,
    "token_uri":process.env.token_uri,
    "auth_provider_x509_cert_url":process.env.auth_provider_x509_cert_url,
    "client_x509_cert_url": process.env.client_x509_cert_url
}
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});

const db = firebase.firestore();

module.exports = db;