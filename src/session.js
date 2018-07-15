// import firebase from 'firebase';

import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';
import * as firebaseui from 'firebaseui';

// Initialize Firebase
// TODO: pull
firebase.initializeApp({
  apiKey: DASHBOARD_API_KEY,
  authDomain: DASHBOARD_AUTH_DOMAIN,
  databaseURL: DASHBOARD_DB_URL,
  projectId: DASHBOARD_PROJECT_ID,
  storageBucket: DASHBOARD_STORAGE_BUCKET,
  messagingSenderId: DASHBOARD_MESSAGING_SENDER_ID
});

// Initialize the FirebaseUI Widget using Firebase.
var firebaseUI = new firebaseui.auth.AuthUI(firebase.auth());

// to be set by individual page
var AUTH_ERROR_CALLBACK = null;

// to be set by firebase
var IS_AUTHENTICATED = false;

// what to do when we notice that firebase has logged in
var LOGIN_CALLBACK = null;

// what to do when we notice that firebase has logged out
var LOGOUT_CALLBACK = null;

// only register
$(window).on("load", function()
{
  // try to login and catch errors
  registerAuthenticationErrorListener();

  // listen to event of being (anonymously) authenticated
  // as soon as we are, we register ourselves
  registerAuthenticationStatusListener();
});

function onLogin(fn) {
  LOGIN_CALLBACK = fn;
}

function onLogout(fn) {
  LOGOUT_CALLBACK = fn;
}

function login(htmlLoginContainer, loginUrl) {
  if (!isAuthenticated()) {
    firebaseUI.start(htmlLoginContainer, getFirebaseUiConfig(loginUrl));
  }
}

function setSession(userObj) {
  setFirebaseSession(userObj);
  IS_AUTHENTICATED = true;
  console.info("user logged in: " + userObj);
  if (LOGIN_CALLBACK) {
    LOGIN_CALLBACK();
  }
}

function registerAuthenticationStatusListener() {
  dbAuth().onAuthStateChanged(function(user) {
    if (user) {
      console.info("received login callback from server");
      setSession(user);
    } else {
      console.info("received logout callback from server");
      clientLogout();
    }
  });
}

function registerAuthenticationErrorListener() {
  // dbAuth().signInAnonymously().catch(function(error) {
  //   showError(error.code, error.message);
  // });
}

function db() {
  return firebase.database();
}

function dbAuth() {
  return firebase.auth();
}

function dbEnv() {
  return db().ref(ENV);
}

function getFirebaseUiConfig(signInUrl) {
  return {
    signInSuccessUrl: signInUrl,
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      // firebase.auth.EmailAuthProvider.PROVIDER_ID,
      // firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: 'https://uploads-ssl.webflow.com/5a9ea4e89cbfbc000183c1ee/5b42770de9a7887ffb405748_Privacy%20Policy%20-%20Proof%20Inc.pdf'
  };
}

function setFirebaseSession(userObj) {
  // localStorage.setItem('access_token', userObj);
  // localStorage.setItem('id_token', userObj);
  // localStorage.setItem('expires_at', expiresAt);
  localStorage.setItem('email', userObj.email);
  localStorage.setItem('name', userObj.displayName);
  // localStorage.setItem('locale', authResult.idTokenPayload.locale);
  localStorage.setItem('avatar', userObj.photoURL);
  localStorage.setItem('user_id', userObj.uid);
}

function isCurrentUser(id) {
  return id == getUserId();
}

function getUserId() {
  return localStorage.getItem('user_id');
}

function getUserIdHash() {
  return getUserId().hashCode();
}

function getEmail() {
  return localStorage.getItem('email');
}

function getName() {
  return localStorage.getItem('name');
}

function getAvatar() {
  return localStorage.getItem('avatar');
}

function isAuthenticated() {
  return IS_AUTHENTICATED;
}

function clientLogout(fn) {
  IS_AUTHENTICATED = false;
  ["user_id", "email", "name", "avatar"].forEach(function(item){
    localStorage.removeItem(item);
  });
  console.info("user logged out");
  if (fn) {
    fn();
  }
  else if (LOGOUT_CALLBACK) {
    LOGOUT_CALLBACK();
  }
}

function serverLogout() {
  dbAuth().signOut();
}

function logout(fn) {
  serverLogout();
}

function redirectToDashboard() {
	location.href = '/dashboard/overview';
}

function redirectToHome() {
	location.href = '/';
}

function redirectToDashboardOnLogout() {
  onLogout(redirectToDashboard);
}

export default {
  onLogin, onLogout, login, logout, redirectToDashboardOnLogout,
  db, isAuthenticated,
  getUserId, getUserIdHash, getEmail, getName, getAvatar
};
