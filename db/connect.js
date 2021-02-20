const firebase = require("firebase-admin");
//const serviceAccount = require("./firebase.json");
require("dotenv").config();

const serviceAccount = {
    "type":process.env.type,
    "projectId":process.env.project_id,
    "privateKey":process.env.private_key,
    "privateKeyId":process.env.private_key_id,
    "clientEmail":process.env.client_email,
    "authUri":process.env.auth_uri,
    "tokenUri":process.env.token_uri,
    "authProviderx509CertUrl":process.env.auth_provider_x509_cert_url,
    "clientx509CertUrl": process.env.client_x509_cert_url
}
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});

const db = firebase.firestore();

module.exports = db;