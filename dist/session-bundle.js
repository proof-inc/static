/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/session.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/session.js":
/*!************************!*\
  !*** ./src/session.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// Initialize Firebase\n// TODO: pull\nfirebase.initializeApp({\n  apiKey: DASHBOARD_API_KEY,\n  authDomain: DASHBOARD_AUTH_DOMAIN,\n  databaseURL: DASHBOARD_DB_URL,\n  projectId: DASHBOARD_PROJECT_ID,\n  storageBucket: DASHBOARD_STORAGE_BUCKET,\n  messagingSenderId: DASHBOARD_MESSAGING_SENDER_ID\n});\n\n// Initialize the FirebaseUI Widget using Firebase.\nvar firebaseUI = new firebaseui.auth.AuthUI(firebase.auth());\n\n// to be set by individual page\nvar AUTH_ERROR_CALLBACK = null;\n\n// to be set by firebase\nvar IS_AUTHENTICATED = false;\n\n// what to do when we notice that firebase has logged in\nvar LOGIN_CALLBACK = null;\n\n// what to do when we notice that firebase has logged out\nvar LOGOUT_CALLBACK = null;\n\n// only register\n$(window).on(\"load\", function()\n{\n  // try to login and catch errors\n  registerAuthenticationErrorListener();\n\n  // listen to event of being (anonymously) authenticated\n  // as soon as we are, we register ourselves\n  registerAuthenticationStatusListener();\n});\n\nfunction onLogin(fn) {\n  LOGIN_CALLBACK = fn;\n}\n\nfunction onLogout(fn) {\n  LOGOUT_CALLBACK = fn;\n}\n\nfunction login(htmlLoginContainer, loginUrl) {\n  if (!isAuthenticated()) {\n    firebaseUI.start(htmlLoginContainer, getFirebaseUiConfig(loginUrl));\n  }\n}\n\nfunction setSession(userObj) {\n  setFirebaseSession(userObj);\n  IS_AUTHENTICATED = true;\n  console.info(\"user logged in: \" + userObj);\n  if (LOGIN_CALLBACK) {\n    LOGIN_CALLBACK();\n  }\n}\n\nfunction registerAuthenticationStatusListener() {\n  dbAuth().onAuthStateChanged(function(user) {\n    if (user) {\n      console.info(\"received login callback from server\");\n      setSession(user);\n    } else {\n      console.info(\"received logout callback from server\");\n      clientLogout();\n    }\n  });\n}\n\nfunction registerAuthenticationErrorListener() {\n  // dbAuth().signInAnonymously().catch(function(error) {\n  //   showError(error.code, error.message);\n  // });\n}\n\nfunction db() {\n  return firebase.database();\n}\n\nfunction dbAuth() {\n  return firebase.auth();\n}\n\nfunction dbEnv() {\n  return db().ref(ENV);\n}\n\nfunction getFirebaseUiConfig(signInUrl) {\n  return {\n    signInSuccessUrl: signInUrl,\n    signInOptions: [\n      // Leave the lines as is for the providers you want to offer your users.\n      firebase.auth.GoogleAuthProvider.PROVIDER_ID,\n      firebase.auth.FacebookAuthProvider.PROVIDER_ID,\n      firebase.auth.TwitterAuthProvider.PROVIDER_ID,\n      // firebase.auth.GithubAuthProvider.PROVIDER_ID,\n      // firebase.auth.EmailAuthProvider.PROVIDER_ID,\n      // firebase.auth.PhoneAuthProvider.PROVIDER_ID\n    ],\n    // Terms of service url.\n    tosUrl: 'https://uploads-ssl.webflow.com/5a9ea4e89cbfbc000183c1ee/5b42770de9a7887ffb405748_Privacy%20Policy%20-%20Proof%20Inc.pdf'\n  };\n}\n\nfunction setFirebaseSession(userObj) {\n  // localStorage.setItem('access_token', userObj);\n  // localStorage.setItem('id_token', userObj);\n  // localStorage.setItem('expires_at', expiresAt);\n  localStorage.setItem('email', userObj.email);\n  localStorage.setItem('name', userObj.displayName);\n  // localStorage.setItem('locale', authResult.idTokenPayload.locale);\n  localStorage.setItem('avatar', userObj.photoURL);\n  localStorage.setItem('user_id', userObj.uid);\n}\n\nfunction isCurrentUser(id) {\n  return id == getUserId();\n}\n\nfunction getUserId() {\n  return localStorage.getItem('user_id');\n}\n\nfunction getUserIdHash() {\n  return getUserId().hashCode();\n}\n\nfunction getEmail() {\n  return localStorage.getItem('email');\n}\n\nfunction getName() {\n  return localStorage.getItem('name');\n}\n\nfunction getAvatar() {\n  return localStorage.getItem('avatar');\n}\n\nfunction isAuthenticated() {\n  return IS_AUTHENTICATED;\n}\n\nfunction clientLogout(fn) {\n  IS_AUTHENTICATED = false;\n  [\"user_id\", \"email\", \"name\", \"avatar\"].forEach(function(item){\n    localStorage.removeItem(item);\n  });\n  console.info(\"user logged out\");\n  if (fn) {\n    fn();\n  }\n  else if (LOGOUT_CALLBACK) {\n    LOGOUT_CALLBACK();\n  }\n}\n\nfunction serverLogout() {\n  dbAuth().signOut();\n}\n\nfunction logout(fn) {\n  serverLogout();\n}\n\nfunction redirectToDashboard() {\n\tlocation.href = '/dashboard/overview';\n}\n\nfunction redirectToHome() {\n\tlocation.href = '/';\n}\n\nfunction redirectToDashboardOnLogout() {\n  onLogout(redirectToDashboard);\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  onLogin, onLogout, login, logout, redirectToDashboardOnLogout,\n  db, isAuthenticated,\n  getUserId, getUserIdHash, getEmail, getName, getAvatar\n});\n\n\n//# sourceURL=webpack:///./src/session.js?");

/***/ })

/******/ });