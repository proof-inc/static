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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/dashboard/components/balance.js":
/*!*********************************************!*\
  !*** ./src/dashboard/components/balance.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ \"./src/dashboard/state.js\");\n/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui */ \"./src/dashboard/ui.js\");\n\n\n\nvar tokenShareBarUI = null;\n\nfunction init() {\n  tokenShareBarUI = createTokenShareBarUI();\n}\n\nfunction update() {\n  updateTokenBalanceUI();\n  updateTokenBonusBalanceUI();\n  updateSupplyShareUI();\n}\n\nfunction updateTokenBalanceUI() {\n  updateTokenStatBalanceUI('#balance-total', _state__WEBPACK_IMPORTED_MODULE_0__[\"default\"].numTokenBalance());\n}\n\nfunction updateTokenBonusBalanceUI() {\n  updateTokenStatBalanceUI('#bonus-total', _state__WEBPACK_IMPORTED_MODULE_0__[\"default\"].numTokenBonusBalance());\n}\n\nfunction updateSupplyShareUI() {\n  var shareModifier = _state__WEBPACK_IMPORTED_MODULE_0__[\"default\"].percentSoldSupply(_state__WEBPACK_IMPORTED_MODULE_0__[\"default\"].numTokenBalance()) / 100;\n  tokenShareBarUI.animate(shareModifier || 0);\n}\n\nfunction createTokenShareBarUI() {\n  return new ProgressBar.SemiCircle('#progress-share-percentage', deepmerge(_ui__WEBPACK_IMPORTED_MODULE_1__[\"default\"].BASE_BAR_CONFIG, {\n    color: '#333',\n    text: {\n      value: '',\n      alignToBottom: true,\n      className: \"dashboard-token-share-text\",\n      style: {\n        // textAlign: 'center',\n        transform: null\n      }\n    },\n    from: {color: _ui__WEBPACK_IMPORTED_MODULE_1__[\"default\"].BAR_PROPERTIES.emptyColor},\n    to: {color: _ui__WEBPACK_IMPORTED_MODULE_1__[\"default\"].BAR_PROPERTIES.fullColor},\n\n    // Set default step function for all animate calls\n    step: (state, bar) => {\n      bar.path.setAttribute('stroke', state.color);\n      var value = Math.round(bar.value() * 100);\n      if (value > 1) {\n        bar.setText(value + '%');\n      }\n      else {\n        bar.setText(\"0%\");\n      }\n\n      bar.text.style.color = state.color;\n    }\n  }));\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({init, update});\n\n\n//# sourceURL=webpack:///./src/dashboard/components/balance.js?");

/***/ }),

/***/ "./src/dashboard/components/calculator.js":
/*!************************************************!*\
  !*** ./src/dashboard/components/calculator.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ \"./src/dashboard/state.js\");\n\n\n// TODO: capitalise?\nvar sliderMinInvestment = 1000;\nvar sliderSalePhase = 0;\n\nfunction init() {\n  createInvestmentCalcSliderUI();\n  createSaleProgressCalcSliderUI();\n  registerManualInvestmentAmountListener();\n  update();\n}\n\nfunction update() {\n  $(\".investment-token-result\").text(\"\" + calcTokenResult());\n  $(\"#investment-manual-amount\").val(sliderMinInvestment);\n}\n\nfunction calcTokenResult() {\n  var baseTokenCount = _state__WEBPACK_IMPORTED_MODULE_0__[\"default\"].euroToTokenAmount(sliderMinInvestment);\n  var totalTokensSold = (sliderSalePhase / 100) * BASE_TOKEN_AMOUNT;\n  var tokenCount = baseTokenCount + _state__WEBPACK_IMPORTED_MODULE_0__[\"default\"].tokenBonusAmount(baseTokenCount, totalTokensSold);\n  return tokenCount;\n}\n\nfunction registerManualInvestmentAmountListener() {\n  $(\"#investment-manual-amount\").change(function(){\n    sliderMinInvestment = $(this).val();\n    $(\"#investment-slider\")\n      .data(\"ionRangeSlider\")\n      .update({from: sliderMinInvestment});\n    update();\n  });\n}\n\nfunction createSaleProgressCalcSliderUI() {\n  $(\"#sale-phase-slider\").ionRangeSlider({\n    min: 0,\n    max: 100,\n    from: sliderSalePhase,\n\n    onChange: function (data) {\n      sliderSalePhase = data.from;\n      update();\n    },\n  });\n}\n\nfunction createInvestmentCalcSliderUI() {\n  $(\"#investment-slider\").ionRangeSlider({\n    min: 1000,\n    step: 5000,\n    grid: true,\n    max: tokensSaleAvailable()/4,\n    from: sliderMinInvestment,\n    prefix: '€',\n\n    onChange: function (data) {\n      sliderMinInvestment = data.from;\n      update();\n    },\n  });\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({init, update});\n\n\n//# sourceURL=webpack:///./src/dashboard/components/calculator.js?");

/***/ }),

/***/ "./src/dashboard/components/dialogs.js":
/*!*********************************************!*\
  !*** ./src/dashboard/components/dialogs.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction hideLoginUI() {\n  $(\"#dashboard-loading-overlay\").hide();\n  $(\"#protected-content-container\").show();\n}\n\nfunction showLoginUI() {\n  $(\"#dashboard-loading-overlay\").show();\n  $(\"#protected-content-container\").hide();\n}\n\nfunction showError(code, message) {\n  $(\"#dashboard-overlay-error-code\").text(code);\n  $(\"#dashboard-overlay-error-message\").text(message);\n  $(\"#dashboard-error-overlay\").removeClass(\"hidden\");\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({hideLoginUI, showLoginUI, showError});\n\n\n//# sourceURL=webpack:///./src/dashboard/components/dialogs.js?");

/***/ }),

/***/ "./src/dashboard/components/supply.js":
/*!********************************************!*\
  !*** ./src/dashboard/components/supply.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state */ \"./src/dashboard/state.js\");\n/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ui */ \"./src/dashboard/ui.js\");\n\n\n\nvar tokenSupplyBarUI = null;\n\nfunction init() {\n  tokenSupplyBarUI = createTokenSupplyBarUI();\n}\n\nfunction update() {\n  updateSupplyBarUI();\n}\n\nfunction updateSupplyBarUI() {\n  tokenSupplyBarUI.animate(1 - _state__WEBPACK_IMPORTED_MODULE_0__[\"default\"].modifierSoldSupply());\n}\n\nfunction createTokenSupplyBarUI() {\n  return new ProgressBar.Circle('#token-supply-left-progress', deepmerge(_ui__WEBPACK_IMPORTED_MODULE_1__[\"default\"].BASE_BAR_CONFIG, {\n    color: '#F8BC3F',\n    strokeWidth: 10,\n    trailWidth: 10,\n    easing: 'easeInOut',\n    duration: 1400,\n    text: {\n      autoStyleContainer: true,\n      alignToBottom: false,\n      className: \"dashboard-token-supply-text\",\n      style: {\n        // fontFamily: barTextFont,\n        fontSize: '50px',\n        fontWeight: \"bold\",\n        color: '#333',\n        // textAlign: 'center',\n        // transform: null\n      }\n    },\n    from: { color: _ui__WEBPACK_IMPORTED_MODULE_1__[\"default\"].BAR_PROPERTIES.emptyColor, width: 10 },\n    to: { color: _ui__WEBPACK_IMPORTED_MODULE_1__[\"default\"].BAR_PROPERTIES.fullColor, width: 10 },\n\n    // Set default step function for all animate calls\n    step: function(state, circle) {\n      circle.path.setAttribute('stroke', state.color);\n      circle.path.setAttribute('stroke-width', state.width);\n      var value = Math.round(circle.value() * 100);\n      circle.setText(value + '%');\n    }\n  }));\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({init, update});\n\n\n//# sourceURL=webpack:///./src/dashboard/components/supply.js?");

/***/ }),

/***/ "./src/dashboard/components/template.js":
/*!**********************************************!*\
  !*** ./src/dashboard/components/template.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ \"./src/dashboard/index.js\");\n/* harmony import */ var _session__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../session */ \"./src/session.js\");\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../state */ \"./src/dashboard/state.js\");\n\n\n\n\nfunction bindReferralButtonUrl() {\n  $(\"#referral-button\").attr(\"href\", \"/privatesale/\" + _session__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getUserId());\n}\n\nfunction bindReferralLink() {\n  var url = AUTH0_CALLBACK_URL + '/' + _session__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getUserId();\n  $(\".referral-link\")\n    .text(url)\n    .attr(\"href\", url);\n}\n\nfunction registerLogoutListener() {\n  $(\"#log-out\").click(_index__WEBPACK_IMPORTED_MODULE_0__[\"default\"].logoutAndPrompt);\n}\n\nfunction bindWelcomeName() {\n  $('#welcome-name').html(_session__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getName());\n}\n\nfunction bindKYCFormEmail() {\n  var kycLink = $('#kyc-notice a');\n  kycLink.attr('href', kycLink\n    .attr('href')\n    .replace(\"{{USER_ID}}\", _session__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getUserId())\n    .replace(\"{{USER_EMAIL}}\", _session__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getEmail())\n  );\n}\n\nfunction bindReferralStats() {\n  $(\"#dashboard-ref-count\").text(_state__WEBPACK_IMPORTED_MODULE_2__[\"default\"].numReferralSignups());\n  $(\"#dashboard-ref-commission\").text(_state__WEBPACK_IMPORTED_MODULE_2__[\"default\"].numReferralCommissionAmount());\n}\n\nfunction bindTemplateData() {\n  registerLogoutListener();\n  bindWelcomeName();\n  bindReferralButtonUrl();\n  bindReferralLink();\n  bindReferralStats();\n  bindKYCFormEmail();\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({bindTemplateData});\n\n\n//# sourceURL=webpack:///./src/dashboard/components/template.js?");

/***/ }),

/***/ "./src/dashboard/db.js":
/*!*****************************!*\
  !*** ./src/dashboard/db.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui */ \"./src/dashboard/ui.js\");\n/* harmony import */ var _session__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../session */ \"./src/session.js\");\n/* harmony import */ var _referrer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./referrer */ \"./src/dashboard/referrer.js\");\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util */ \"./src/util.js\");\n\n\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n\n  init: function() {\n    registerInvestorLoggedIn();\n    registerInvestorListener();\n    registerTransactionListener();\n  },\n\n  // whenever any investor data changes, reparse\n  registerInvestorListener: function() {\n    dbInvestors().on(\"value\", parseInvestors);\n  },\n\n  // reparse all transactions when a new one occurs\n  registerTransactionListener: function() {\n    dbTransactions().on(\"child_added\", parseTransaction);\n  },\n\n  // manually trigger parsing transactions\n  triggerParseTransactions: function() {\n    dbTransactions().once(\"value\", parseTransactions);\n  },\n\n  parseInvestors: function(investorsSnapshot) {\n    console.log(\"parsing investors\");\n    newIds = [];\n    investorsSnapshot.forEach(function(investorRef) {\n      var investor = investorRef.val();\n      var investorId = investorRef.key;\n\n      // our data\n      if (_session__WEBPACK_IMPORTED_MODULE_1__[\"default\"].isCurrentUser(investorId)) {\n        if (investor.kycDone) {\n          State.setKYCDone();\n        }\n        State.setInvestorInitialized();\n      }\n\n      // other investor\n      else {\n        if (_session__WEBPACK_IMPORTED_MODULE_1__[\"default\"].isCurrentUser(investor.referrer)) {\n          newIds.push(investorId);\n        }\n      }\n    });\n\n    // suppose an investor had been registered but the referral id\n    // only catches on later. then the investor list changes,\n    // but we need to rescan transactions to count referrals\n    if (State.updateReferralInvestorIds(newIds)) {\n      triggerParseTransactions();\n    }\n  },\n\n  // parse transactiosn given a snapshot\n  parseTransaction: function(transactionSnapshot) {\n    console.log(\"parsing transaction \", transactionSnapshot.toJSON());\n    var tx = transactionSnapshot.val();\n    var timestamp = parseInt(tx.timestamp);\n    var euroAmount = parseInt(tx.euroAmount);\n    var userId = tx.investorId;\n    var paymentMethod = tx.method;\n    State.processTx(userId, euroAmount, timestamp, tx);\n    _ui__WEBPACK_IMPORTED_MODULE_0__[\"default\"].update();\n  },\n\n  // parse transactiosn given a snapshot\n  parseTransactions: function(transactionsSnapshot) {\n    console.log(\"parsing transactions\");\n    State.reset();\n    transactionsSnapshot.forEach(parseTransaction);\n  },\n\n  registerInvestorLoggedIn: function() {\n    dbThisInvestor().once('value', function(snapshot) {\n      var exists = (snapshot.val() !== null);\n      if (exists) {\n        registerInvestorMeta();\n      }\n      else {\n        initInvestorMeta();\n      }\n    });\n\n    // // update login timestamps and/or referrer\n    // if (INITIALIZED) {\n    //   registerInvestorLastSeenTimestamp();\n    //   registerReferrer();\n    // }\n    //\n    // // init data repo\n    // else {\n    //   initInvestorData();\n    // }\n  },\n\n  initInvestorMeta: function() {\n    console.log(\"initialized entry for investor: \", _session__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getUserId());\n    dbThisInvestorUserData().set({\n      referrer: _referrer__WEBPACK_IMPORTED_MODULE_2__[\"default\"].get()\n    });\n    registerInvestorLastSeenTimestamp();\n  },\n\n  registerInvestorMeta: function() {\n    registerInvestorLastSeenTimestamp();\n    registerReferrer();\n  },\n\n  registerInvestorLastSeenTimestamp: function() {\n    dbEnv()\n      .child(\"logins\")\n      .push({\n        timestamp: _util__WEBPACK_IMPORTED_MODULE_3__[\"default\"].now(),\n        investor: _session__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getUserId()\n      });\n  },\n\n  // extra chance of registering the referrer if we already had been authenticated\n  // and therefore the registration is not run\n  registerReferrer: function() {\n    if (hasReferrer()) {\n      dbThisInvestorReferrer().setValue(_referrer__WEBPACK_IMPORTED_MODULE_2__[\"default\"].get());\n    }\n  },\n\n  //\n  // DB paths\n  //\n\n  dbEnv: function() {\n    return _session__WEBPACK_IMPORTED_MODULE_1__[\"default\"].dbEnv();\n  },\n\n  dbTransactions: function() {\n    return dbEnv().child('transactions');\n  },\n\n  dbInvestors: function() {\n    return dbEnv().child('investors');\n  },\n\n  dbThisInvestor: function() {\n    return dbInvestors().child(_session__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getUserId());\n  },\n\n  dbThisInvestorUserData: function() {\n    return dbThisInvestor().child(\"userData\");\n  },\n\n  dbThisInvestorReferrer: function() {\n    return dbThisInvestorUserData().child(\"referrer\");\n  },\n\n  dbThisInvestorDeposits: function() {\n    return dbThisInvestor().child(\"deposits\");\n  },\n});\n\n\n//# sourceURL=webpack:///./src/dashboard/db.js?");

/***/ }),

/***/ "./src/dashboard/index.js":
/*!********************************!*\
  !*** ./src/dashboard/index.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui */ \"./src/dashboard/ui.js\");\n/* harmony import */ var _referrer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./referrer */ \"./src/dashboard/referrer.js\");\n/* harmony import */ var _session__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../session */ \"./src/session.js\");\n/* harmony import */ var _components_dialogs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/dialogs */ \"./src/dashboard/components/dialogs.js\");\n/* harmony import */ var _components_template__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/template */ \"./src/dashboard/components/template.js\");\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./db */ \"./src/dashboard/db.js\");\n\n\n\n\n\n\n\n//\n// CONFIG & INIT\n//\n\n// TODO\n// - KYC welcome name var\n// - psp callbacks\n// - investor parser rework\n// - referral stats\n// - kyc callback\n// - token number formatting\n// - anonymous chat?\n// - anonymous recent transaction list\n// - auth domain (https://stackoverflow.com/questions/44815580/how-to-replace-the-myapp-123-firebaseapp-com-with-my-custom-domain-myapp-com)\n\n//\n// CREATE UI\n//\n_ui__WEBPACK_IMPORTED_MODULE_0__[\"default\"].initComponents();\n\n// init procedure dependent on site-wide init\n// only register\n$(window).on(\"load\", function() {\n\n  // parse referrer and store in local storage ASAP\n  _referrer__WEBPACK_IMPORTED_MODULE_1__[\"default\"].parse();\n\n  // callback to run when a login is detected\n  _session__WEBPACK_IMPORTED_MODULE_2__[\"default\"].onLogin(function()\n  {\n    // set url to our own referrer for dummy sharing\n    _referrer__WEBPACK_IMPORTED_MODULE_1__[\"default\"].setReferrerUrl();\n\n    // bind some template vars based on authentication\n    _components_template__WEBPACK_IMPORTED_MODULE_4__[\"default\"].bindTemplateData();\n\n    // init investor entry\n    _db__WEBPACK_IMPORTED_MODULE_5__[\"default\"].init();\n\n    // reset meters\n    _ui__WEBPACK_IMPORTED_MODULE_0__[\"default\"].updateEuroInvested();\n\n    // hide loading screen\n    _components_dialogs__WEBPACK_IMPORTED_MODULE_3__[\"default\"].hideLoginUI();\n  });\n\n  // callback to run when logout is detected\n  _session__WEBPACK_IMPORTED_MODULE_2__[\"default\"].onLogout(_components_dialogs__WEBPACK_IMPORTED_MODULE_3__[\"default\"].showLoginUI);\n\n  // The start method will wait until the DOM is loaded.\n  _session__WEBPACK_IMPORTED_MODULE_2__[\"default\"].login('#dashboard-loading-overlay', AUTH0_CALLBACK_URL);\n});\n\nfunction logoutAndPrompt() {\n  _session__WEBPACK_IMPORTED_MODULE_2__[\"default\"].logout(_components_dialogs__WEBPACK_IMPORTED_MODULE_3__[\"default\"].showLoginUI); // side-wide function of clearing session\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({logoutAndPrompt});\n\n\n//# sourceURL=webpack:///./src/dashboard/index.js?");

/***/ }),

/***/ "./src/dashboard/referrer.js":
/*!***********************************!*\
  !*** ./src/dashboard/referrer.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _session__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../session */ \"./src/session.js\");\n\n\nconst REFERRER_STORAGE_KEY = \"referrer\";\nconst REFERRER_URL_KEY = \"ref\";\n\nfunction parse() {\n  if ('URLSearchParams' in window) {\n    if (hasReferrerUrl() && !isReferrerUrlOwn()) {\n      setReferrer(getReferrerUrl());\n      deleteReferrerUrl();\n    }\n  }\n}\n\nfunction hasReferrerUrl() {\n  return getReferrerUrl() && getReferrerUrl() !== \"\";\n}\n\nfunction hasReferrer() {\n  var r = getReferrer();\n  return r != \"\" && r != null && r != undefined && r != \"null\" && r != getUserId();\n}\n\nfunction deleteReferrerUrl() {\n  window.history.replaceState(null, null, window.location.pathname); // delete referral trace\n}\n\nfunction resetReferrer() {\n  return setReferrer(\"\");\n}\n\nfunction setReferrer(ref) {\n  localStorage.setItem(REFERRER_STORAGE_KEY, (ref != _session__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getUserId()) ? ref : \"\");\n  console.info(\"Referrer set: \", ref);\n  return getReferrer();\n}\n\nfunction setReferrerUrl() {\n  if ('URLSearchParams' in window) {\n    var searchParams = new URLSearchParams(window.location.search)\n    searchParams.set(REFERRER_URL_KEY, _session__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getUserId());\n    var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();\n    history.pushState(null, '', newRelativePathQuery);\n  }\n}\n\nfunction getReferrerUrl() {\n  return (new URLSearchParams(window.location.search)).get(REFERRER_URL_KEY);\n}\n\nfunction isReferrerUrlOwn() {\n  return hasReferrerUrl() && (getReferrerUrl() == getUserId());\n}\n\nfunction getReferrer() {\n  var ref = localStorage.getItem(REFERRER_STORAGE_KEY);\n  return (ref == _session__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getUserId()) ? resetReferrer() : ref;\n}\n\nfunction get() {\n  return getReferrer();\n}\n\nfunction isInvestorOurReferral(id) {\n  return State.isInvestorOurReferral(id);\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({isInvestorOurReferral, getReferrer, get, isReferrerUrlOwn, getReferrerUrl,\n  setReferrerUrl, setReferrer, resetReferrer, deleteReferrerUrl,\n  hasReferrer, hasReferrerUrl, parse});\n\n\n//# sourceURL=webpack:///./src/dashboard/referrer.js?");

/***/ }),

/***/ "./src/dashboard/state.js":
/*!********************************!*\
  !*** ./src/dashboard/state.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ \"./src/util.js\");\n\n\n// constants\nconst BASE_TOKEN_AMOUNT = 120 * 1000000;\n\n// the total sum of contributions\nvar TOTAL_EURO_RAISED = 0;\n\n// the amont this user account invested\nvar EURO_INVESTED = 0;\n\n// whether a registration was done for this user account\nvar INITIALIZED = false;\n\n// whether we detected the KYC form to have been completed\nvar KYC_FILLED = false;\n\n// the investor ids of people referred by this account\nvar REFERRAL_INVESTOR_IDS = [];\n\n// transactions done by people referred by this account\nvar REFERRAL_TRANSACTIONS = [];\n\n// timestamp of last investment done\nvar LAST_INVESTMENT_TIMESTAMP = null;\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n\n  reset: function() {\n    TOTAL_EURO_RAISED = 0;\n    EURO_INVESTED = 0;\n    REFERRAL_INVESTOR_IDS = [];\n    REFERRAL_TRANSACTIONS = [];\n  },\n\n  numTokensSold: function() {\n    return euroToTokenAmount(Math.max(0, TOTAL_EURO_RAISED))\n  },\n\n  numTokenBalance: function() {\n    return euroToTokenAmount(Math.max(0, EURO_INVESTED));\n  },\n\n  numTokenBonusBalance: function() {\n    return tokenBonusAmount(numTokenBalance());\n  },\n\n  numReferralSignups: function() {\n    return REFERRAL_INVESTOR_IDS.length;\n  },\n\n  numReferralCommissionAmount: function() {\n    var commission = 0;\n    REFERRAL_TRANSACTIONS.forEach(function(tx) {\n      commission += (tx.euroAmount * 0.02).toFixed(2);\n    });\n    return commission;\n  },\n\n  totalInvestorTokenAmount: function() {\n    return numTokenBalance() + numTokenBonusBalance();\n  },\n\n  setKYCDone: function() {\n    KYC_FILLED = true;\n  },\n\n  setInvestorInitialized: function() {\n    INITIALIZED = true;\n  },\n\n  getReferralInvestorIds: function() {\n    return REFERRAL_INVESTOR_IDS;\n  },\n\n  setReferralInvestorIds: function(newIds) {\n    REFERRAL_INVESTOR_IDS = newIds;\n  },\n\n  updateReferralInvestorIds: function(newIds) {\n    if (!_util__WEBPACK_IMPORTED_MODULE_0__[\"default\"].arrayEqual(newIds, getReferralInvestorIds())) {\n      setReferralInvestorIds(newIds);\n      return true;\n    }\n    return false;\n  },\n\n  isInvestorOurReferral: function(id) {\n    return getReferralInvestorIds().includes(id);\n  },\n\n  tokensSaleAvailable: function() {\n    return BASE_TOKEN_AMOUNT - numTokensSold();\n  },\n\n  processTx: function(investorId, amount, timestamp, tx) {\n    // TODO: make sure it doesnt go below 0\n    TOTAL_EURO_RAISED += amount;\n\n    // one of our transactions\n    if (Session.isCurrentUser(investorId)) {\n      EURO_INVESTED += amount;\n    }\n\n    // transaction for someone else. however,\n    // if we did refer them we get 2%\n    else if (State.isInvestorOurReferral(investorId)) {\n      REFERRAL_TRANSACTIONS.push(tx);\n    }\n\n    // mark time of last investment\n    if (LAST_INVESTMENT_TIMESTAMP == null || timestamp > LAST_INVESTMENT_TIMESTAMP) {\n      LAST_INVESTMENT_TIMESTAMP = timestamp;\n    }\n  },\n\n  percentTotalSupply: function(tokenAmount) {\n    return percentageOf(tokenAmount, BASE_TOKEN_AMOUNT);\n  },\n\n  // what the amoutn of tokens is relative to total supply\n  // expressed in fraction from 0-1\n  modifierSoldSupply() {\n    return percentTotalSupply(numTokensSold()) / 100;\n  },\n\n  percentSoldSupply: function(tokenAmount) {\n    return percentageOf(tokenAmount, numTokensSold());\n  },\n\n  tokenBonusAmount: function(tokenAmount, totalTokensSold) {\n    var tokenAmountModifier = getBonusModifier(totalTokensSold);\n    var bonusModifier = ((tokenAmountModifier * 1000) - 1000) / 1000; // due to strange rounding error\n    return Math.round(tokenAmount * bonusModifier);\n  },\n\n  getBonusModifier: function(totalTokensSold) {\n    var bonusModifier = 1.0;\n    var salePhase = percentTotalSupply(totalTokensSold);\n    if (salePhase < 2){\n\n    }\n    else if (salePhase < 10){\n      bonusModifier = 1.1;\n    }\n    else if (salePhase < 25){\n      bonusModifier = 1.2;\n    }\n    else if (salePhase < 50){\n      bonusModifier = 1.3;\n    }\n    else if (salePhase < 95){\n      bonusModifier = 1.4;\n    }\n    else {\n      bonusModifier = 1.5;\n    }\n    return bonusModifier;\n  },\n\n  euroToTokenAmount: function(euroAmount) {\n    return euroAmount * 4;\n  }\n});\n\n\n//# sourceURL=webpack:///./src/dashboard/state.js?");

/***/ }),

/***/ "./src/dashboard/ui.js":
/*!*****************************!*\
  !*** ./src/dashboard/ui.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _components_calculator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/calculator */ \"./src/dashboard/components/calculator.js\");\n/* harmony import */ var _components_template__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/template */ \"./src/dashboard/components/template.js\");\n/* harmony import */ var _components_balance__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/balance */ \"./src/dashboard/components/balance.js\");\n/* harmony import */ var _components_supply__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/supply */ \"./src/dashboard/components/supply.js\");\n\n\n\n\n\n// UI variables\nconst BAR_PROPERTIES = {\n  strokeWidth: 25,\n  emptyColor: '#cc0000',\n  fullColor: '#26CA7B',\n  trailColor: '#CCC',\n  barTextFont: '\"Raleway\", Helvetica, sans-serif'\n};\n\n// TODO: max aanpassen wanneer nieuwe investeringen gedaan worden\nfunction initComponents() {\n  _components_balance__WEBPACK_IMPORTED_MODULE_2__[\"default\"].init();\n  _components_calculator__WEBPACK_IMPORTED_MODULE_0__[\"default\"].init();\n}\n\nfunction update() {\n  updateEuroInvested();\n  updateReferralStats();\n}\n\nfunction updateEuroInvested() {\n  _components_supply__WEBPACK_IMPORTED_MODULE_3__[\"default\"].update();\n  _components_balance__WEBPACK_IMPORTED_MODULE_2__[\"default\"].update();\n}\n\nfunction updateReferralStats() {\n  _components_template__WEBPACK_IMPORTED_MODULE_1__[\"default\"].bindReferralStats();\n}\n\nfunction updateTokenStatBalanceUI(selector, newValue) {\n  $(selector).animateNumber({ number: newValue });\n}\n\n// function updateTokenBarUI(barUI, num, ) {\n//   var shareModifier = percentSoldSupply(numTokenBalance()) / 100;\n//   tokenShareBarUI.animate(shareModifier || 0);\n// }\n\nvar BASE_BAR_CONFIG = {\n  strokeWidth: BAR_PROPERTIES.strokeWidth,\n  trailColor: BAR_PROPERTIES.trailColor,\n  trailWidth: 25,\n  easing: 'easeInOut',\n  duration: 1400,\n  svgStyle: {\n    display: 'block',\n    width: '100%'\n  },\n  text: {\n    style: {\n      fontFamily: BAR_PROPERTIES.barTextFont,\n      fontSize: '2rem',\n      transform: null,\n      textAlign: 'center',\n      position: 'absolute'\n    }\n  }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  initUIComponents,\n  update,\n  updateEuroInvested,\n  updateReferralStats,\n  updateTokenStatBalanceUI,\n  BASE_BAR_CONFIG,\n  BAR_PROPERTIES\n});\n\n\n//# sourceURL=webpack:///./src/dashboard/ui.js?");

/***/ }),

/***/ "./src/reamaze.js":
/*!************************!*\
  !*** ./src/reamaze.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var _support = _support || { 'ui': {}, 'user': {} };\n_support['account'] = 'troovebird';\n_support['ui']['contactMode'] = 'mixed';\n_support['ui']['enableKb'] = 'true';\n_support['ui']['styles'] = {\n  widgetColor: 'rgb(24, 162, 221)',\n};\n_support['ui']['widget'] = {\n  label: {\n    text: 'Let us know if you have any questions! 😊',\n    mode: \"notification\",\n    delay: 3,\n    duration: 30,\n    sound: true,\n  },\n  position: 'bottom-right',\n};\n_support['apps'] = {\n  faq: {\"enabled\":true},\n  recentConversations: {},\n  orders: {}\n};\n\n\n//# sourceURL=webpack:///./src/reamaze.js?");

/***/ }),

/***/ "./src/session.js":
/*!************************!*\
  !*** ./src/session.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// Initialize Firebase\n// TODO: pull\nfirebase.initializeApp({\n  apiKey: DASHBOARD_API_KEY,\n  authDomain: DASHBOARD_AUTH_DOMAIN,\n  databaseURL: DASHBOARD_DB_URL,\n  projectId: DASHBOARD_PROJECT_ID,\n  storageBucket: DASHBOARD_STORAGE_BUCKET,\n  messagingSenderId: DASHBOARD_MESSAGING_SENDER_ID\n});\n\n// Initialize the FirebaseUI Widget using Firebase.\nvar firebaseUI = new firebaseui.auth.AuthUI(firebase.auth());\n\n// to be set by individual page\nvar AUTH_ERROR_CALLBACK = null;\n\n// to be set by firebase\nvar IS_AUTHENTICATED = false;\n\n// what to do when we notice that firebase has logged in\nvar LOGIN_CALLBACK = null;\n\n// what to do when we notice that firebase has logged out\nvar LOGOUT_CALLBACK = null;\n\n// only register\n$(window).on(\"load\", function()\n{\n  // try to login and catch errors\n  registerAuthenticationErrorListener();\n\n  // listen to event of being (anonymously) authenticated\n  // as soon as we are, we register ourselves\n  registerAuthenticationStatusListener();\n});\n\nfunction onLogin(fn) {\n  LOGIN_CALLBACK = fn;\n}\n\nfunction onLogout(fn) {\n  LOGOUT_CALLBACK = fn;\n}\n\nfunction login(htmlLoginContainer, loginUrl) {\n  if (!isAuthenticated()) {\n    firebaseUI.start(htmlLoginContainer, getFirebaseUiConfig(loginUrl));\n  }\n}\n\nfunction setSession(userObj) {\n  setFirebaseSession(userObj);\n  IS_AUTHENTICATED = true;\n  console.info(\"user logged in: \" + userObj);\n  if (LOGIN_CALLBACK) {\n    LOGIN_CALLBACK();\n  }\n}\n\nfunction registerAuthenticationStatusListener() {\n  dbAuth().onAuthStateChanged(function(user) {\n    if (user) {\n      console.info(\"received login callback from server\");\n      setSession(user);\n    } else {\n      console.info(\"received logout callback from server\");\n      clientLogout();\n    }\n  });\n}\n\nfunction registerAuthenticationErrorListener() {\n  // dbAuth().signInAnonymously().catch(function(error) {\n  //   showError(error.code, error.message);\n  // });\n}\n\nfunction db() {\n  return firebase.database();\n}\n\nfunction dbAuth() {\n  return firebase.auth();\n}\n\nfunction dbEnv() {\n  return db().ref(ENV);\n}\n\nfunction getFirebaseUiConfig(signInUrl) {\n  return {\n    signInSuccessUrl: signInUrl,\n    signInOptions: [\n      // Leave the lines as is for the providers you want to offer your users.\n      firebase.auth.GoogleAuthProvider.PROVIDER_ID,\n      firebase.auth.FacebookAuthProvider.PROVIDER_ID,\n      firebase.auth.TwitterAuthProvider.PROVIDER_ID,\n      // firebase.auth.GithubAuthProvider.PROVIDER_ID,\n      // firebase.auth.EmailAuthProvider.PROVIDER_ID,\n      // firebase.auth.PhoneAuthProvider.PROVIDER_ID\n    ],\n    // Terms of service url.\n    tosUrl: 'https://uploads-ssl.webflow.com/5a9ea4e89cbfbc000183c1ee/5b42770de9a7887ffb405748_Privacy%20Policy%20-%20Proof%20Inc.pdf'\n  };\n}\n\nfunction setFirebaseSession(userObj) {\n  // localStorage.setItem('access_token', userObj);\n  // localStorage.setItem('id_token', userObj);\n  // localStorage.setItem('expires_at', expiresAt);\n  localStorage.setItem('email', userObj.email);\n  localStorage.setItem('name', userObj.displayName);\n  // localStorage.setItem('locale', authResult.idTokenPayload.locale);\n  localStorage.setItem('avatar', userObj.photoURL);\n  localStorage.setItem('user_id', userObj.uid);\n}\n\nfunction isCurrentUser(id) {\n  return id == getUserId();\n}\n\nfunction getUserId() {\n  return localStorage.getItem('user_id');\n}\n\nfunction getUserIdHash() {\n  return getUserId().hashCode();\n}\n\nfunction getEmail() {\n  return localStorage.getItem('email');\n}\n\nfunction getName() {\n  return localStorage.getItem('name');\n}\n\nfunction getAvatar() {\n  return localStorage.getItem('avatar');\n}\n\nfunction isAuthenticated() {\n  return IS_AUTHENTICATED;\n}\n\nfunction clientLogout(fn) {\n  IS_AUTHENTICATED = false;\n  [\"user_id\", \"email\", \"name\", \"avatar\"].forEach(function(item){\n    localStorage.removeItem(item);\n  });\n  console.info(\"user logged out\");\n  if (fn) {\n    fn();\n  }\n  else if (LOGOUT_CALLBACK) {\n    LOGOUT_CALLBACK();\n  }\n}\n\nfunction serverLogout() {\n  dbAuth().signOut();\n}\n\nfunction logout(fn) {\n  serverLogout();\n}\n\nfunction redirectToDashboard() {\n\tlocation.href = '/dashboard/overview';\n}\n\nfunction redirectToHome() {\n\tlocation.href = '/';\n}\n\nfunction redirectToDashboardOnLogout() {\n  onLogout(redirectToDashboard);\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  onLogin, onLogout, login, logout, redirectToDashboardOnLogout,\n  db, isAuthenticated,\n  getUserId, getUserIdHash, getEmail, getName, getAvatar\n});\n\n\n//# sourceURL=webpack:///./src/session.js?");

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction now() {\n  return (+ new Date());\n}\n\nfunction arrayEqual(arr1, arr2) {\n  arr1.sort(); arr2.sort();\n  if (arr1.length != arr2.length) return false;\n  for (var i = 0; i < arr1.length; i++) {\n    if (arr1[i] !== arr2[i]) {\n      return false;\n    }\n  }\n  return true;\n}\n\nfunction percentageOf(fraction, total) {\n  var division = total / fraction;\n  return (division > 0) ? ((1/division)*100) : 0;\n}\n\nfunction hashCode(string) {\n  var hash = 0;\n  if (string.length == 0) return hash;\n  for (i = 0; i < string.length; i++) {\n    char = string.charCodeAt(i);\n    hash = ((hash<<5)-hash)+char;\n    hash = hash & hash; // Convert to 32bit integer\n  }\n  return hash;\n}\n\n// TODO: vervangen met veilige hash\nString.prototype.hashCode = function(){\n  return hashCode(this);\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({now, arrayEqual, percentageOf, hashCode});\n\n\n//# sourceURL=webpack:///./src/util.js?");

/***/ }),

/***/ 0:
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** multi ./src/util.js ./src/dashboard/referrer.js ./src/dashboard/ui.js ./src/dashboard/components/dialogs.js ./src/dashboard/components/template.js ./src/dashboard/components/balance.js ./src/dashboard/components/calculator.js ./src/dashboard/components/supply.js ./src/dashboard/db.js ./src/dashboard/index.js ./src/reamaze.js ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./src/util.js */\"./src/util.js\");\n__webpack_require__(/*! ./src/dashboard/referrer.js */\"./src/dashboard/referrer.js\");\n__webpack_require__(/*! ./src/dashboard/ui.js */\"./src/dashboard/ui.js\");\n__webpack_require__(/*! ./src/dashboard/components/dialogs.js */\"./src/dashboard/components/dialogs.js\");\n__webpack_require__(/*! ./src/dashboard/components/template.js */\"./src/dashboard/components/template.js\");\n__webpack_require__(/*! ./src/dashboard/components/balance.js */\"./src/dashboard/components/balance.js\");\n__webpack_require__(/*! ./src/dashboard/components/calculator.js */\"./src/dashboard/components/calculator.js\");\n__webpack_require__(/*! ./src/dashboard/components/supply.js */\"./src/dashboard/components/supply.js\");\n__webpack_require__(/*! ./src/dashboard/db.js */\"./src/dashboard/db.js\");\n__webpack_require__(/*! ./src/dashboard/index.js */\"./src/dashboard/index.js\");\nmodule.exports = __webpack_require__(/*! ./src/reamaze.js */\"./src/reamaze.js\");\n\n\n//# sourceURL=webpack:///multi_./src/util.js_./src/dashboard/referrer.js_./src/dashboard/ui.js_./src/dashboard/components/dialogs.js_./src/dashboard/components/template.js_./src/dashboard/components/balance.js_./src/dashboard/components/calculator.js_./src/dashboard/components/supply.js_./src/dashboard/db.js_./src/dashboard/index.js_./src/reamaze.js?");

/***/ })

/******/ });