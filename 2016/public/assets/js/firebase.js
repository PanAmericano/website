var config = {
  apiKey: "AIzaSyDO1ErT22W91V2BZ_Ko-OIfbt-iJ0AR1ak",
  authDomain: "panamericano-5ac9a.firebaseapp.com",
  databaseURL: "https://panamericano-5ac9a.firebaseio.com/",
  storageBucket: "gs://panamericano-5ac9a.appspot.com/"
};
firebase.initializeApp(config);
// Login Variables
var user = firebase.auth().currentUser;
if (user) {
  window.location.href = '/';
} else {
  // No user is signed in.
}
