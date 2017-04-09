// const firebaseAdmin = require("firebase-admin");
// const serviceAccount = require('../config/firebaseServiceAccountKey.json');
//
// const credential ={
//   credential: firebaseAdmin.credential.cert(serviceAccount),
//   databaseURL: config.firebase.baseUrl
// };
//
// let firebaseConnection = firebaseAdmin.initializeApp(credential);
//
// function getFirebaseConnection() {
//   if(!firebaseConnection) {
//     firebaseConnection = firebase.initializeApp(credential);
//   }
//
//   return firebaseConnection;
// }
//
// module.exports.getConnection = getFirebaseConnection;


const firebase = require("firebase");

const credential = {
  apiKey: "AIzaSyBMhiiS9NRGFLphcI42kMV_6BxXPJPjWnI",
  authDomain: "project-fluency.firebaseapp.com",
  databaseURL: "https://project-fluency.firebaseio.com",
  projectId: "project-fluency",
  storageBucket: "project-fluency.appspot.com",
  messagingSenderId: "1056753113824"
};

firebase.initializeApp(credential);

function getFirebaseConnection() {
  if(!firebase) {
    firebase.initializeApp(credential);
  }

  return firebase;
}

module.exports.getConnection = getFirebaseConnection;
