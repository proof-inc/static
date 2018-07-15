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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/dashboard/business.js":
/*!***********************************!*\
  !*** ./src/dashboard/business.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function numTokensSold() {\n  return euroToTokenAmount(Math.max(0, TOTAL_EURO_RAISED))\n}\n\nfunction numTokenBalance() {\n  return euroToTokenAmount(Math.max(0, EURO_INVESTED));\n}\n\nfunction numTokenBonusBalance() {\n  return tokenBonusAmount(numTokenBalance());\n}\n\nfunction numReferralSignups() {\n  return REFERRAL_INVESTOR_IDS.length;\n}\n\nfunction numReferralCommissionAmount() {\n  var commission = 0;\n  REFERRAL_TRANSACTIONS.forEach(function(tx) {\n    commission += (tx.euroAmount * 0.02).toFixed(2);\n  });\n  return commission;\n}\n\nfunction totalInvestorTokenAmount() {\n  return numTokenBalance() + numTokenBonusBalance();\n}\n\nfunction tokensSaleAvailable() {\n  return BASE_TOKEN_AMOUNT - numTokensSold();\n}\n\nfunction percentTotalSupply(tokenAmount) {\n  return percentageOf(tokenAmount, BASE_TOKEN_AMOUNT);\n}\n\nfunction percentSoldSupply(tokenAmount) {\n  return percentageOf(tokenAmount, numTokensSold());\n}\n\nfunction tokenBonusAmount(tokenAmount, totalTokensSold) {\n  var tokenAmountModifier = getBonusModifier(totalTokensSold);\n  var bonusModifier = ((tokenAmountModifier * 1000) - 1000) / 1000; // due to strange rounding error\n  return Math.round(tokenAmount * bonusModifier);\n}\n\nfunction getBonusModifier(totalTokensSold) {\n  var bonusModifier = 1.0;\n  var salePhase = percentTotalSupply(totalTokensSold);\n  if (salePhase < 2) {\n\n  }\n  else if (salePhase < 10) {\n    bonusModifier = 1.1;\n  }\n  else if (salePhase < 25) {\n    bonusModifier = 1.2;\n  }\n  else if (salePhase < 50) {\n    bonusModifier = 1.3;\n  }\n  else if (salePhase < 95) {\n    bonusModifier = 1.4;\n  }\n  else {\n    bonusModifier = 1.5;\n  }\n  return bonusModifier;\n}\n\nfunction euroToTokenAmount(euroAmount) {\n  return euroAmount * 4;\n}\n\n\n//# sourceURL=webpack:///./src/dashboard/business.js?");

/***/ }),

/***/ "./src/dashboard/components/balance.js":
/*!*********************************************!*\
  !*** ./src/dashboard/components/balance.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var tokenShareBarUI = createTokenShareBarUI();\n\nfunction updateTokenBalanceUI() {\n  updateTokenStatBalanceUI('#balance-total', numTokenBalance());\n}\n\nfunction updateTokenBonusBalanceUI() {\n  updateTokenStatBalanceUI('#bonus-total', numTokenBonusBalance());\n}\n\nfunction updateSupplyShareUI() {\n  var shareModifier = percentSoldSupply(numTokenBalance()) / 100;\n  tokenShareBarUI.animate(shareModifier || 0);\n}\n\nfunction createTokenShareBarUI() {\n  return new ProgressBar.SemiCircle('#progress-share-percentage', deepmerge(barBaseUIOptions(), {\n    color: '#333',\n    text: {\n      value: '',\n      alignToBottom: true,\n      className: \"dashboard-token-share-text\",\n      style: {\n        // textAlign: 'center',\n        transform: null\n      }\n    },\n    from: {color: emptyColor},\n    to: {color: fullColor},\n\n    // Set default step function for all animate calls\n    step: (state, bar) => {\n      bar.path.setAttribute('stroke', state.color);\n      var value = Math.round(bar.value() * 100);\n      if (value > 1) {\n        bar.setText(value + '%');\n      }\n      else {\n        bar.setText(\"0%\");\n      }\n\n      bar.text.style.color = state.color;\n    }\n  }));\n}\n\n\n//# sourceURL=webpack:///./src/dashboard/components/balance.js?");

/***/ }),

/***/ "./src/dashboard/components/calculator.js":
/*!************************************************!*\
  !*** ./src/dashboard/components/calculator.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// TODO: capitalise?\nvar sliderMinInvestment = 1000;\nvar sliderSalePhase = 0;\n\nfunction updateTokensToReceive() {\n  var baseTokenCount = euroToTokenAmount(sliderMinInvestment);\n  var totalTokensSold = (sliderSalePhase / 100) * BASE_TOKEN_AMOUNT;\n  var tokenCount = baseTokenCount + tokenBonusAmount(baseTokenCount, totalTokensSold);\n  $(\".investment-token-result\").text(\"\" + tokenCount);\n  $(\"#investment-manual-amount\").val(sliderMinInvestment);\n}\n\nfunction registerManualInvestmentAmountListener() {\n  $(\"#investment-manual-amount\").change(function(){\n    sliderMinInvestment = $(this).val();\n    $(\"#investment-slider\")\n      .data(\"ionRangeSlider\")\n      .update({from: sliderMinInvestment});\n    updateTokensToReceive();\n  });\n}\n\nfunction createSaleProgressCalcSliderUI() {\n  $(\"#sale-phase-slider\").ionRangeSlider({\n    min: 0,\n    max: 100,\n    from: sliderSalePhase,\n\n    onChange: function (data) {\n      sliderSalePhase = data.from;\n      updateTokensToReceive();\n    },\n  });\n}\n\nfunction createInvestmentCalcSliderUI() {\n  $(\"#investment-slider\").ionRangeSlider({\n    min: 1000,\n    step: 5000,\n    grid: true,\n    max: tokensSaleAvailable()/4,\n    from: sliderMinInvestment,\n    prefix: '€',\n\n    onChange: function (data) {\n      sliderMinInvestment = data.from;\n      updateTokensToReceive();\n    },\n  });\n}\n\n\n//# sourceURL=webpack:///./src/dashboard/components/calculator.js?");

/***/ }),

/***/ "./src/dashboard/components/dialogs.js":
/*!*********************************************!*\
  !*** ./src/dashboard/components/dialogs.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function hideLoginUI() {\n  $(\"#dashboard-loading-overlay\").hide();\n  $(\"#protected-content-container\").show();\n}\n\nfunction showLoginUI() {\n  $(\"#dashboard-loading-overlay\").show();\n  $(\"#protected-content-container\").hide();\n}\n\nfunction showError(code, message) {\n  $(\"#dashboard-overlay-error-code\").text(code);\n  $(\"#dashboard-overlay-error-message\").text(message);\n  $(\"#dashboard-error-overlay\").removeClass(\"hidden\");\n}\n\n\n//# sourceURL=webpack:///./src/dashboard/components/dialogs.js?");

/***/ }),

/***/ "./src/dashboard/components/supply.js":
/*!********************************************!*\
  !*** ./src/dashboard/components/supply.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var tokenSupplyBarUI = createTokenSupplyBarUI();\n\nfunction updateSupplyBarUI() {\n  var modifier = percentTotalSupply(numTokensSold()) / 100;\n  tokenSupplyBarUI.animate(1 - modifier);\n}\n\nfunction createTokenSupplyBarUI() {\n  return new ProgressBar.Circle('#token-supply-left-progress', deepmerge(barBaseUIOptions(), {\n    color: '#F8BC3F',\n    strokeWidth: 10,\n    trailWidth: 10,\n    easing: 'easeInOut',\n    duration: 1400,\n    text: {\n      autoStyleContainer: true,\n      alignToBottom: false,\n      className: \"dashboard-token-supply-text\",\n      style: {\n        // fontFamily: barTextFont,\n        fontSize: '50px',\n        fontWeight: \"bold\",\n        color: '#333',\n        // textAlign: 'center',\n        // transform: null\n      }\n    },\n    from: { color: emptyColor, width: 10 },\n    to: { color: fullColor, width: 10 },\n\n    // Set default step function for all animate calls\n    step: function(state, circle) {\n      circle.path.setAttribute('stroke', state.color);\n      circle.path.setAttribute('stroke-width', state.width);\n      var value = Math.round(circle.value() * 100);\n      circle.setText(value + '%');\n    }\n  }));\n}\n\n\n//# sourceURL=webpack:///./src/dashboard/components/supply.js?");

/***/ }),

/***/ "./src/dashboard/components/template.js":
/*!**********************************************!*\
  !*** ./src/dashboard/components/template.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function bindReferralButtonUrl() {\n  $(\"#referral-button\").attr(\"href\", \"/privatesale/\" + getUserId());\n}\n\nfunction bindReferralLink() {\n  var url = AUTH0_CALLBACK_URL + '/' + getUserId();\n  $(\".referral-link\")\n    .text(url)\n    .attr(\"href\", url);\n}\n\nfunction registerLogoutListener() {\n  $(\"#log-out\").click(logoutAndPrompt);\n}\n\nfunction bindWelcomeName() {\n  $('#welcome-name').html(getName());\n}\n\nfunction bindKYCFormEmail() {\n  var kycLink = $('#kyc-notice a');\n  kycLink.attr('href', kycLink\n    .attr('href')\n    .replace(\"{{USER_ID}}\", getUserId())\n    .replace(\"{{USER_EMAIL}}\", getEmail())\n  );\n}\n\nfunction bindReferralStats() {\n  $(\"#dashboard-ref-count\").text(numReferralSignups());\n  $(\"#dashboard-ref-commission\").text(numReferralCommissionAmount());\n}\n\nfunction bindTemplateData() {\n  bindWelcomeName();\n  bindReferralButtonUrl();\n  bindReferralLink();\n  bindReferralStats();\n  bindKYCFormEmail();\n}\n\n\n//# sourceURL=webpack:///./src/dashboard/components/template.js?");

/***/ }),

/***/ "./src/dashboard/db.js":
/*!*****************************!*\
  !*** ./src/dashboard/db.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// whenever any investor data changes, reparse\nfunction registerInvestorListener() {\n  dbInvestors().on(\"value\", parseInvestors);\n}\n\n// reparse all transactions when a new one occurs\nfunction registerTransactionListener() {\n  dbTransactions().on(\"child_added\", parseTransaction);\n}\n\n// manually trigger parsing transactions\nfunction triggerParseTransactions() {\n  dbTransactions().once(\"value\", parseTransactions);\n}\n\nfunction parseInvestors(investorsSnapshot) {\n  console.log(\"parsing investors\");\n  NEW_REFERRAL_INVESTOR_IDS = [];\n  investorsSnapshot.forEach(function(investorRef) {\n    var investor = investorRef.val();\n    var investorId = investorRef.key;\n\n    // our data\n    if (investorId == getUserId()) {\n      KYC_FILLED = investor.kycDone;\n      INITIALIZED = true;\n    }\n\n    // other investor\n    else {\n      if (investor.referrer == getUserId()) {\n        NEW_REFERRAL_INVESTOR_IDS.push(investorId);\n      }\n    }\n  });\n\n  // suppose an investor had been registered but the referral id\n  // only catches on later. then the investor list changes,\n  // but we need to rescan transactions to count referrals\n  if (!arrayEqual(NEW_REFERRAL_INVESTOR_IDS, REFERRAL_INVESTOR_IDS)) {\n    REFERRAL_INVESTOR_IDS = NEW_REFERRAL_INVESTOR_IDS;\n    triggerParseTransactions();\n  }\n}\n\n// parse transactiosn given a snapshot\nfunction parseTransaction(transactionSnapshot) {\n  console.log(\"parsing transaction \", transactionSnapshot.toJSON());\n\n  var tx = transactionSnapshot.val();\n  var timestamp = parseInt(tx.timestamp);\n  var euroAmount = parseInt(tx.euroAmount);\n  var userId = tx.investorId;\n  var paymentMethod = tx.method;\n\n  // TODO: make sure it doesnt go below 0\n  TOTAL_EURO_RAISED += euroAmount;\n\n  // one of our transactions\n  if (userId == getUserId()) {\n    EURO_INVESTED += euroAmount;\n    updateInvestorEuroInvested();\n  }\n\n  // transaction for someone else. however,\n  // if we did refer them we get 2%\n  else if (isInvestorOurReferral(userId)) {\n    REFERRAL_TRANSACTIONS.push(tx);\n    updateReferralStats();\n  }\n\n  // mark time of last investment\n  if (LAST_INVESTMENT_TIMESTAMP == null || timestamp > LAST_INVESTMENT_TIMESTAMP) {\n    LAST_INVESTMENT_TIMESTAMP = timestamp;\n  }\n\n  updateTotalEuroInvested();\n}\n\n// parse transactiosn given a snapshot\nfunction parseTransactions(transactionsSnapshot) {\n  console.log(\"parsing transactions\");\n  TOTAL_EURO_RAISED = 0;\n  EURO_INVESTED = 0;\n  REFERRAL_TRANSACTIONS = [];\n  transactionsSnapshot.forEach(parseTransaction);\n}\n\nfunction registerInvestorLoggedIn() {\n  dbThisInvestor().once('value', function(snapshot) {\n    var exists = (snapshot.val() !== null);\n    if (exists) {\n      registerInvestorMeta();\n    }\n    else {\n      initInvestorMeta();\n    }\n  });\n\n  // // update login timestamps and/or referrer\n  // if (INITIALIZED) {\n  //   registerInvestorLastSeenTimestamp();\n  //   registerReferrer();\n  // }\n  //\n  // // init data repo\n  // else {\n  //   initInvestorData();\n  // }\n}\n\nfunction initInvestorMeta() {\n  console.log(\"initialized entry for investor: \", getUserId());\n  dbThisInvestorUserData().set({\n    referrer: getReferrer()\n  });\n  registerInvestorLastSeenTimestamp();\n}\n\nfunction registerInvestorMeta() {\n  registerInvestorLastSeenTimestamp();\n  registerReferrer();\n}\n\nfunction registerInvestorLastSeenTimestamp() {\n  dbEnv()\n    .child(\"logins\")\n    .push({\n      timestamp: now(),\n      investor: getUserId()\n    });\n}\n\n// extra chance of registering the referrer if we already had been authenticated\n// and therefore the registration is not run\nfunction registerReferrer() {\n  if (hasReferrer()) {\n    dbThisInvestorReferrer().setValue(getReferrer());\n  }\n}\n\n//\n// DB paths\n//\n\nfunction dbEnv() {\n  return db().ref(ENV);\n}\n\nfunction dbTransactions() {\n  return dbEnv().child('transactions');\n}\n\nfunction dbInvestors() {\n  return dbEnv().child('investors');\n}\n\nfunction dbThisInvestor() {\n  return dbInvestors().child(getUserId());\n}\n\nfunction dbThisInvestorUserData() {\n  return dbThisInvestor().child(\"userData\");\n}\n\nfunction dbThisInvestorReferrer() {\n  return dbThisInvestorUserData().child(\"referrer\");\n}\n\nfunction dbThisInvestorDeposits() {\n  return dbThisInvestor().child(\"deposits\");\n}\n\n\n//# sourceURL=webpack:///./src/dashboard/db.js?");

/***/ }),

/***/ "./src/dashboard/index.js":
/*!********************************!*\
  !*** ./src/dashboard/index.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("//\n// CONFIG & INIT\n//\n\n// TODO\n// - KYC welcome name var\n// - psp callbacks\n// - investor parser rework\n// - referral stats\n// - kyc callback\n// - token number formatting\n// - anonymous chat?\n// - anonymous recent transaction list\n// - auth domain (https://stackoverflow.com/questions/44815580/how-to-replace-the-myapp-123-firebaseapp-com-with-my-custom-domain-myapp-com)\n\n// the total sum of contributions\nvar TOTAL_EURO_RAISED = 0;\n\n// the amont this user account invested\nvar EURO_INVESTED = 0;\n\n// whether a registration was done for this user account\nvar INITIALIZED = false;\n\n// whether we detected the KYC form to have been completed\nvar KYC_FILLED = false;\n\n// the investor ids of people referred by this account\nvar REFERRAL_INVESTOR_IDS = [];\n\n// transactions done by people referred by this account\nvar REFERRAL_TRANSACTIONS = [];\n\n// timestamp of last investment done\nvar LAST_INVESTMENT_TIMESTAMP = null;\n\n// constants\nconst REFERRER_STORAGE_KEY = \"referrer\";\nconst REFERRER_URL_KEY = \"ref\";\nconst BASE_TOKEN_AMOUNT = 120 * 1000000;\n\n//\n// CREATE UI\n//\ninitUIComponents();\n\n// init procedure dependent on site-wide init\n// only register\n$(window).on(\"load\", function() {\n\n  // parse referrer and store in local storage ASAP\n  parseReferrer();\n\n  // callback to run when a login is detected\n  onLogin(bootstrapDashboard);\n\n  // callback to run when logout is detected\n  onLogout(showLoginUI);\n\n  // The start method will wait until the DOM is loaded.\n  login('#dashboard-loading-overlay', AUTH0_CALLBACK_URL);\n});\n\n// main init procedure\nfunction bootstrapDashboard()\n{\n  // set url to our own referrer for dummy sharing\n  setReferrerUrl();\n\n  // bind some template vars based on authentication\n  bindTemplateData();\n\n  // manual input field for investment calc\n  registerManualInvestmentAmountListener();\n\n  // init ui\n  updateTokensToReceive();\n\n  // back to login prompt\n  registerLogoutListener();\n\n  // init investor entry\n  registerInvestorLoggedIn();\n\n  // listen to all changes and additions of investors\n  registerInvestorListener();\n\n  // listen to all additions of transactions\n  registerTransactionListener();\n\n  // reset meters\n  updateEuroInvested();\n\n  // hide loading screen\n  hideLoginUI();\n}\n\nfunction logoutAndPrompt() {\n  logout(showLoginUI); // side-wide function of clearing session\n}\n\n\n//# sourceURL=webpack:///./src/dashboard/index.js?");

/***/ }),

/***/ "./src/dashboard/referrer.js":
/*!***********************************!*\
  !*** ./src/dashboard/referrer.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function parseReferrer() {\n  if ('URLSearchParams' in window) {\n    if (hasReferrerUrl() && !isReferrerUrlOwn()) {\n      setReferrer(getReferrerUrl());\n      deleteReferrerUrl();\n    }\n  }\n}\n\nfunction hasReferrerUrl() {\n  return getReferrerUrl() && getReferrerUrl() !== \"\";\n}\n\nfunction hasReferrer() {\n  var r = getReferrer();\n  return r != \"\" && r != null && r != undefined && r != \"null\" && r != getUserId();\n}\n\nfunction deleteReferrerUrl() {\n  window.history.replaceState(null, null, window.location.pathname); // delete referral trace\n}\n\nfunction resetReferrer() {\n  return setReferrer(\"\");\n}\n\nfunction setReferrer(ref) {\n  localStorage.setItem(REFERRER_STORAGE_KEY, (ref != getUserId()) ? ref : \"\");\n  console.info(\"Referrer set: \", ref);\n  return getReferrer();\n}\n\nfunction setReferrerUrl() {\n  if ('URLSearchParams' in window) {\n    var searchParams = new URLSearchParams(window.location.search)\n    searchParams.set(REFERRER_URL_KEY, getUserId());\n    var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();\n    history.pushState(null, '', newRelativePathQuery);\n  }\n}\n\nfunction getReferrerUrl() {\n  return (new URLSearchParams(window.location.search)).get(REFERRER_URL_KEY);\n}\n\nfunction isReferrerUrlOwn() {\n  return hasReferrerUrl() && (getReferrerUrl() == getUserId());\n}\n\nfunction getReferrer() {\n  var ref = localStorage.getItem(REFERRER_STORAGE_KEY);\n  return (ref == getUserId()) ? resetReferrer() : ref;\n}\n\nfunction isInvestorOurReferral(id) {\n  return REFERRAL_INVESTOR_IDS.includes(id);\n}\n\n\n//# sourceURL=webpack:///./src/dashboard/referrer.js?");

/***/ }),

/***/ "./src/dashboard/ui.js":
/*!*****************************!*\
  !*** ./src/dashboard/ui.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// UI variables\nconst strokeWidth = 25;\nconst emptyColor = '#cc0000';\nconst fullColor = '#26CA7B';\nconst trailColor = '#CCC';\nconst barTextFont = '\"Raleway\", Helvetica, sans-serif';\n\n// TODO: max aanpassen wanneer nieuwe investeringen gedaan worden\nfunction initUIComponents() {\n  createInvestmentCalcSliderUI();\n  createSaleProgressCalcSliderUI();\n}\n\nfunction updateEuroInvested() {\n  updateInvestorEuroInvested();\n  updateTotalEuroInvested();\n}\n\nfunction updateInvestorEuroInvested() {\n  updateSupplyShareUI();\n  updateTokenBalanceUI();\n  updateTokenBonusBalanceUI();\n}\n\nfunction updateTotalEuroInvested() {\n  updateSupplyBarUI();\n  updateSupplyShareUI();\n}\n\nfunction updateReferralStats() {\n  bindReferralStats();\n}\n\nfunction updateTokenStatBalanceUI(selector, newValue) {\n  $(selector).animateNumber({ number: newValue });\n}\n\n// function updateTokenBarUI(barUI, num, ) {\n//   var shareModifier = percentSoldSupply(numTokenBalance()) / 100;\n//   tokenShareBarUI.animate(shareModifier || 0);\n// }\n\nfunction barBaseUIOptions() {\n  return {\n    strokeWidth: strokeWidth,\n    trailColor: trailColor,\n    trailWidth: 25,\n    easing: 'easeInOut',\n    duration: 1400,\n    svgStyle: {\n      display: 'block',\n      width: '100%'\n    },\n    text: {\n      style: {\n        fontFamily: barTextFont,\n        fontSize: '2rem',\n        transform: null,\n        textAlign: 'center',\n        position: 'absolute'\n      }\n    }\n  }\n}\n\n\n//# sourceURL=webpack:///./src/dashboard/ui.js?");

/***/ }),

/***/ "./src/reamaze.js":
/*!************************!*\
  !*** ./src/reamaze.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var _support = _support || { 'ui': {}, 'user': {} };\n_support['account'] = 'troovebird';\n_support['ui']['contactMode'] = 'mixed';\n_support['ui']['enableKb'] = 'true';\n_support['ui']['styles'] = {\n  widgetColor: 'rgb(24, 162, 221)',\n};\n_support['ui']['widget'] = {\n  label: {\n    text: 'Let us know if you have any questions! 😊',\n    mode: \"notification\",\n    delay: 3,\n    duration: 30,\n    sound: true,\n  },\n  position: 'bottom-right',\n};\n_support['apps'] = {\n  faq: {\"enabled\":true},\n  recentConversations: {},\n  orders: {}\n};\n\n\n//# sourceURL=webpack:///./src/reamaze.js?");

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function now() {\n  return (+ new Date());\n}\n\nfunction arrayEqual(arr1, arr2) {\n  arr1.sort(); arr2.sort();\n  if (arr1.length != arr2.length) return false;\n  for (var i = 0; i < arr1.length; i++) {\n    if (arr1[i] !== arr2[i]) {\n      return false;\n    }\n  }\n  return true;\n}\n\nfunction percentageOf(fraction, total) {\n  var division = total / fraction;\n  return (division > 0) ? ((1/division)*100) : 0;\n}\n\n\n//# sourceURL=webpack:///./src/util.js?");

/***/ }),

/***/ 0:
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** multi ./src/util.js ./src/dashboard/referrer.js ./src/dashboard/ui.js ./src/dashboard/components/dialogs.js ./src/dashboard/components/template.js ./src/dashboard/components/balance.js ./src/dashboard/components/calculator.js ./src/dashboard/components/supply.js ./src/dashboard/db.js ./src/dashboard/business.js ./src/dashboard/index.js ./src/reamaze.js ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./src/util.js */\"./src/util.js\");\n__webpack_require__(/*! ./src/dashboard/referrer.js */\"./src/dashboard/referrer.js\");\n__webpack_require__(/*! ./src/dashboard/ui.js */\"./src/dashboard/ui.js\");\n__webpack_require__(/*! ./src/dashboard/components/dialogs.js */\"./src/dashboard/components/dialogs.js\");\n__webpack_require__(/*! ./src/dashboard/components/template.js */\"./src/dashboard/components/template.js\");\n__webpack_require__(/*! ./src/dashboard/components/balance.js */\"./src/dashboard/components/balance.js\");\n__webpack_require__(/*! ./src/dashboard/components/calculator.js */\"./src/dashboard/components/calculator.js\");\n__webpack_require__(/*! ./src/dashboard/components/supply.js */\"./src/dashboard/components/supply.js\");\n__webpack_require__(/*! ./src/dashboard/db.js */\"./src/dashboard/db.js\");\n__webpack_require__(/*! ./src/dashboard/business.js */\"./src/dashboard/business.js\");\n__webpack_require__(/*! ./src/dashboard/index.js */\"./src/dashboard/index.js\");\nmodule.exports = __webpack_require__(/*! ./src/reamaze.js */\"./src/reamaze.js\");\n\n\n//# sourceURL=webpack:///multi_./src/util.js_./src/dashboard/referrer.js_./src/dashboard/ui.js_./src/dashboard/components/dialogs.js_./src/dashboard/components/template.js_./src/dashboard/components/balance.js_./src/dashboard/components/calculator.js_./src/dashboard/components/supply.js_./src/dashboard/db.js_./src/dashboard/business.js_./src/dashboard/index.js_./src/reamaze.js?");

/***/ })

/******/ });