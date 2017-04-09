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
