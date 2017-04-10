$(document).ready(function() {
  function toggleSignIn() {
    if (firebase.auth().currentUser) {
      // [START signout]
      firebase.auth().signOut();
      // [END signout]
    } else {
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      if (email.length < 4) {
        alert('Please enter a valid email address.');
        return;
      }
      if (password.length < 8) {
        alert('Please enter your 8-character password.');
        return;
      }
      // Sign in with email and pass.
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          window.location = 'index.html'; //After successful login, user will be redirected to home.html
        }
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(
          function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
              alert('Wrong password.');
            } else {
              alert(errorMessage);
            }
            console.log(error);
            document.getElementById('quickstart-sign-in').disabled =
              false;
            // [END_EXCLUDE]
          });

      });
      // [END authwithemail]
    }
    document.getElementById('quickstart-sign-in').disabled = true;
  }
  /**
   * Handles the sign up button press.
   */
  function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 8) {
      alert('Password lenght must be a minimum of 8-characters.');
      return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(
      function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });
    // [END createwithemail]
    firebase.auth().onAuthStateChanged(function(user) {
      user.sendEmailVerification().then(function() {
        alert(
          'Email verifcation has been sent, please check your inbox. Thank you!'
        );
      }, function(error) {
        alert('An error happened. Please contact us!');
      });
    });
  }
  /**
   * Sends an email verification to the user.
   */
  function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
      // Email Verification sent!
      alert('Email Verification Sent!');
    });
    // [END sendemailverification]
  }

  function sendPasswordReset() {
    var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function() {
      // Password Reset Email Sent!
      // [START_EXCLUDE]
      alert('Password Reset Email Sent!');
      // [END_EXCLUDE]
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/invalid-email') {
        alert(errorMessage);
      } else if (errorCode == 'auth/user-not-found') {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
  }
  /**
   * initApp handles setting up UI event listeners and registering Firebase auth listeners:
   *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
   *    out, and that is where we update the UI.
   */
  function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
      // [START_EXCLUDE silent]
      document.getElementById('quickstart-verify-email').disabled =
        true;
      // [END_EXCLUDE]
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        // [START_EXCLUDE]
        document.getElementById('quickstart-sign-in-status').textContent =
          'Signed in';
        document.getElementById('quickstart-sign-in').textContent =
          'Sign out';
        document.getElementById('quickstart-account-details').textContent =
          JSON.stringify(user, null, '  ');
        if (!emailVerified) {
          document.getElementById('quickstart-verify-email').disabled =
            false;
        }
        // [END_EXCLUDE]
      } else {
        // User is signed out.
        // [START_EXCLUDE]
        document.getElementById('quickstart-sign-in-status').textContent =
          'Signed out';
        document.getElementById('quickstart-sign-in').textContent =
          'Sign in';
        document.getElementById('quickstart-account-details').textContent =
          'null';
        // [END_EXCLUDE]
      }
      // [START_EXCLUDE silent]
      document.getElementById('quickstart-sign-in').disabled = false;
      // [END_EXCLUDE]
    });
    // [END authstatelistener]
    document.getElementById('quickstart-sign-in').addEventListener('click',
      toggleSignIn, false);
    document.getElementById('quickstart-sign-up').addEventListener('click',
      handleSignUp, false);
    document.getElementById('quickstart-verify-email').addEventListener(
      'click', sendEmailVerification, false);
    document.getElementById('quickstart-password-reset').addEventListener(
      'click', sendPasswordReset, false);
  }
  window.onload = function() {
    initApp();
  };
});
