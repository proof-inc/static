// Initialize Firebase
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
      setSession(user);
    } else {
      logout();
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

function logout(fn) {
  IS_AUTHENTICATED = false;
  ["user_id", "email", "name", "avatar"].forEach(function(item){
    localStorage.removeItem(item);
  });
  dbAuth().signOut();
  console.info("user logged out");
  if (fn) {
    fn();
  }
  else if (LOGOUT_CALLBACK) {
    LOGOUT_CALLBACK();
  }
}

function toDashboard() {
	location.href = '/dashboard/overview';
}

function toHome() {
	location.href = '/';
}

// TODO: vervangen met veilige hash
String.prototype.hashCode = function(){
  var hash = 0;
  if (this.length == 0) return hash;
  for (i = 0; i < this.length; i++) {
    char = this.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

// function handleAuthentication(onFail, onSuccess) {
//   webAuth.parseHash(function(err, authResult) {
//     if (authResult && authResult.accessToken && authResult.idToken) {
//       window.location.hash = '';
//       setSession(authResult);
//     }
//     else if (err) {
//       console.error("Error trying to log in! (" + err + ")");
//     }
//
//     if (isAuthenticated()) {
//       if (onSuccess && typeof onSuccess === "function")
//     	  onSuccess();
//     }
//     else if (onFail && typeof onFail === "function") {
//     	onFail();
//     }
//   });
// }

// function isAuthenticated() {
//   // Check whether the current time is past the
//   // Access Token's expiry time
//   var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
//   return new Date().getTime() < expiresAt;
// }

// var webAuth = new auth0.WebAuth({
//   domain: AUTH0_DOMAIN,
//   clientID: AUTH0_CLIENT_ID,
//   redirectUri: AUTH0_CALLBACK_URL,
//   audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
//   responseType: 'token id_token',
//   scope: 'openid email profile'
// });

// function setSession(authResult) {
//   // Set the time that the Access Token will expire at
//   var expiresAt = JSON.stringify(
//     authResult.expiresIn * 1000 + new Date().getTime()
//   );
//   localStorage.setItem('access_token', authResult.accessToken);
//   localStorage.setItem('id_token', authResult.idToken);
//   localStorage.setItem('expires_at', expiresAt);
//   localStorage.setItem('email', authResult.idTokenPayload.email);
//   localStorage.setItem('name', authResult.idTokenPayload.name);
//   localStorage.setItem('locale', authResult.idTokenPayload.locale);
//   localStorage.setItem('picture', authResult.idTokenPayload.picture);
//   localStorage.setItem('user_id', authResult.idTokenPayload.sub);
//
//   console.log(authResult.idTokenPayload);
// }
//
// function login() {
// 	webAuth.authorize();
// }
//
// function logoutAndPrompt() {
//   logout(login);
// }
//
// function logout(onLogout) {
//   // Remove tokens and expiry time from localStorage
//   localStorage.removeItem('access_token');
//   localStorage.removeItem('id_token');
//   localStorage.removeItem('expires_at');
//   localStorage.removeItem('user_id');
//   if (onLogout && typeof onLogout === "function") {
//     onLogout();
//   }
// }
