//
// CONFIG & INIT
//

// TODO
// - KYC welcome name var
// - psp callbacks
// - investor parser rework
// - referral stats
// - kyc callback
// - token number formatting
// - anonymous chat?
// - anonymous recent transaction list
// - auth domain (https://stackoverflow.com/questions/44815580/how-to-replace-the-myapp-123-firebaseapp-com-with-my-custom-domain-myapp-com)

// TODO: capitalise?
var sliderMinInvestment = 1000;
var sliderSalePhase = 0;

// UI variables
const strokeWidth = 25;
const emptyColor = '#cc0000';
const fullColor = '#26CA7B';
const trailColor = '#CCC';
const barTextFont = '"Raleway", Helvetica, sans-serif';

// variables filled by firebase
var TOTAL_EURO_RAISED = 0;
var EURO_INVESTED = 0;
var INITIALIZED = false;
var KYC_FILLED = false;
var REFERRAL_EURO_RAISE = 0;
var REFERRAL_INVESTOR_IDS = [];
var LAST_INVESTMENT_TIMESTAMP = null;

// constants
const REFERRER_STORAGE_KEY = "referrer";
const REFERRER_URL_KEY = "ref";
const BASE_TOKEN_AMOUNT = 120 * 1000000;

//
// CREATE UI
//
var tokenShareBarUI = createTokenShareBarUI();
var tokenSupplyBarUI = createTokenSupplyBarUI();

// TODO: max aanpassen wanneer nieuwe investeringen gedaan worden
createInvestmentCalcSliderUI();
createSaleProgressCalcSliderUI();

// init procedure dependent on site-wide init
// only register
$(window).on("load", function() {

  // parse referrer and store in local storage ASAP
  parseReferrer();

  // callback to run when a login is detected
  onLogin(bootstrapDashboard);

  // callback to run when logout is detected
  onLogout(showLoginUI);

  // The start method will wait until the DOM is loaded.
  login('#dashboard-loading-overlay', AUTH0_CALLBACK_URL);
});

// whenever any investor data changes, reparse
function registerInvestorListener() {
  dbInvestors().on("value", parseInvestors);
}

// reparse all transactions when a new one occurs
function registerTransactionListener() {
  dbTransactions().on("child_added", parseTransactions);
}

// manually trigger parsing transactions
function triggerParseTransactions() {
  dbTransactions().once("value", parseTransactions);
}

function parseInvestors(investorsSnapshot) {
  REFERRAL_INVESTOR_IDS = [];
  investorsSnapshot.forEach(function(investorRef) {
    var investor = investorsRef.val();
    var investorId = investorsRef.key;

    // our data
    if (investorId == getUserId()) {
      KYC_FILLED = investor.kycDone;
      INITIALIZED = true;
    }

    // other investor
    else {
      if (investor.referrer == getUserId()) {
        REFERRAL_INVESTOR_IDS.push(investorId);
      }
    }

    // TODO: trigger rewalking transactions if we find out about a
    // new referral we made?
  });
}

// parse transactiosn given a snapshot
function parseTransactions(transactionsSnapshot) {
  var tx = transactionsSnapshot.val();
  var timestamp = parseInt(tx.timestamp);
  var euroAmount = parseInt(tx.euroAmount);
  var userId = tx.userId;
  var paymentMethod = tx.method;

  // TODO: make sure it doesnt go below 0
  TOTAL_EURO_RAISED += euroAmount;

  // one of our transactions
  if (userId == getUserId()) {
    EURO_INVESTED += euroAmount;
    updateInvestorEuroInvested();
  }

  // transaction for someone else. however,
  // if we did refer them we get 2%
  else if (isInvestorOurReferral(userId)) {
    REFERRAL_EURO_RAISE += (euroAmount * 0.02).toFixed(2);
    updateReferralStats();
  }

  // mark time of last investment
  if (LAST_INVESTMENT_TIMESTAMP == null || timestamp > LAST_INVESTMENT_TIMESTAMP) {
    LAST_INVESTMENT_TIMESTAMP = timestamp;
  }

  updateTotalEuroInvested();
}

// main init procedure
function bootstrapDashboard()
{
  // set url to our own referrer for dummy sharing
  setReferrerUrl();

  // bind some template vars based on authentication
  bindTemplateData();

  // manual input field for investment calc
  registerManualInvestmentAmountListener();

  // init ui
  updateTokensToReceive();

  // back to login prompt
  registerLogoutListener();

  // init investor entry
  registerInvestorLoggedIn();

  // listen to all changes and additions of investors
  registerInvestorListener();

  // listen to all additions of transactions
  registerTransactionListener();

  // reset meters
  updateEuroInvested();

  // hide loading screen
  hideLoginUI();
}

function logoutAndPrompt() {
  logout(showLoginUI); // side-wide function of clearing session
}

function registerInvestorLoggedIn() {
  dbThisInvestor().once('value', function(snapshot) {
    var exists = (snapshot.val() !== null);
    if (exists) {
      registerInvestorMeta();
    }
    else {
      initInvestorMeta();
    }
  });

  // // update login timestamps and/or referrer
  // if (INITIALIZED) {
  //   registerInvestorLastSeenTimestamp();
  //   registerReferrer();
  // }
  //
  // // init data repo
  // else {
  //   initInvestorData();
  // }
}

function initInvestorMeta() {
  console.log("initialized entry for investor: " + getUserId());
  dbThisInvestorUserData().set({
    referrer: getReferrer()
  });
  registerInvestorLastSeenTimestamp();
}

function registerInvestorMeta() {
  registerInvestorLastSeenTimestamp();
  registerReferrer();
}

function registerInvestorLastSeenTimestamp() {
  dbEnv()
    .child("logins")
    .push({
      timestamp: now(),
      investor: getUserId()
    });
}

// extra chance of registering the referrer if we already had been authenticated
// and therefore the registration is not run
function registerReferrer() {
  if (hasReferrer()) {
    dbThisInvestorReferrer().setValue(getReferrer());
  }
}

function now() {
  return (+ new Date());
}

//
// REFERRALS
//

function bindReferralButtonUrl() {
  $("#referral-button").attr("href", "/privatesale/" + getUserId());
}

function bindReferralLink() {
  var url = AUTH0_CALLBACK_URL + '/' + getUserId();
  $(".referral-link")
    .text(url)
    .attr("href", url);
}

function parseReferrer() {
  if ('URLSearchParams' in window) {
    if (hasReferrerUrl() && !isReferrerUrlOwn()) {
      setReferrer(getReferrerUrl());
      deleteReferrerUrl();
    }
  }
}

function hasReferrerUrl() {
  return getReferrerUrl() && getReferrerUrl() !== "";
}

function hasReferrer() {
  var r = getReferrer();
  return r != "" && r != null && r != undefined && r != "null" && r != getUserId();
}

function deleteReferrerUrl() {
  window.history.replaceState(null, null, window.location.pathname); // delete referral trace
}

function resetReferrer() {
  return setReferrer("");
}

function setReferrer(ref) {
  localStorage.setItem(REFERRER_STORAGE_KEY, (ref != getUserId()) ? ref : "");
  console.info("Referrer set: " + ref);
  return getReferrer();
}

function setReferrerUrl() {
  if ('URLSearchParams' in window) {
    var searchParams = new URLSearchParams(window.location.search)
    searchParams.set(REFERRER_URL_KEY, getUserId());
    var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
    history.pushState(null, '', newRelativePathQuery);
  }
}

function getReferrerUrl() {
  return (new URLSearchParams(window.location.search)).get(REFERRER_URL_KEY);
}

function isReferrerUrlOwn() {
  return hasReferrerUrl() && (getReferrerUrl() == getUserId());
}

function getReferrer() {
  var ref = localStorage.getItem(REFERRER_STORAGE_KEY);
  return (ref == getUserId()) ? resetReferrer() : ref;
}

//
// LISTENERS
//

function registerLogoutListener() {
  $("#log-out").click(logoutAndPrompt);
}

function registerManualInvestmentAmountListener() {
  $("#investment-manual-amount").change(function(){
    sliderMinInvestment = $(this).val();
    $("#investment-slider")
      .data("ionRangeSlider")
      .update({from: sliderMinInvestment});
    updateTokensToReceive();
  });
}

//
// UI factories
//

function createSaleProgressCalcSliderUI() {
  $("#sale-phase-slider").ionRangeSlider({
    min: 0,
    max: 100,
    from: sliderSalePhase,

    onChange: function (data) {
      sliderSalePhase = data.from;
      updateTokensToReceive();
    },
  });
}

function createInvestmentCalcSliderUI() {
  $("#investment-slider").ionRangeSlider({
    min: 1000,
    step: 5000,
    grid: true,
    max: tokensSaleAvailable()/4,
    from: sliderMinInvestment,
    prefix: '€',

    onChange: function (data) {
      sliderMinInvestment = data.from;
      updateTokensToReceive();
    },
  });
}

function barBaseUIOptions() {
  return {
    strokeWidth: strokeWidth,
    trailColor: trailColor,
    trailWidth: 25,
    easing: 'easeInOut',
    duration: 1400,
    svgStyle: {
      display: 'block',
      width: '100%'
    },
    text: {
      style: {
        fontFamily: barTextFont,
        fontSize: '2rem',
        transform: null,
        textAlign: 'center',
        position: 'absolute'
      }
    }
  }
}

function createTokenShareBarUI() {
  return new ProgressBar.SemiCircle('#progress-share-percentage', deepmerge(barBaseUIOptions(), {
    color: '#333',
    text: {
      value: '',
      alignToBottom: true,
      className: "dashboard-token-share-text",
      style: {
        // textAlign: 'center',
        transform: null
      }
    },
    from: {color: emptyColor},
    to: {color: fullColor},

    // Set default step function for all animate calls
    step: (state, bar) => {
      bar.path.setAttribute('stroke', state.color);
      var value = Math.round(bar.value() * 100);
      if (value > 1) {
        bar.setText(value + '%');
      }
      else {
        bar.setText("0%");
      }

      bar.text.style.color = state.color;
    }
  }));
}

function createTokenSupplyBarUI() {
  return new ProgressBar.Circle('#token-supply-left-progress', deepmerge(barBaseUIOptions(), {
    color: '#F8BC3F',
    strokeWidth: 10,
    trailWidth: 10,
    easing: 'easeInOut',
    duration: 1400,
    text: {
      autoStyleContainer: true,
      alignToBottom: false,
      className: "dashboard-token-supply-text",
      style: {
        // fontFamily: barTextFont,
        fontSize: '50px',
        fontWeight: "bold",
        color: '#333',
        // textAlign: 'center',
        // transform: null
      }
    },
    from: { color: emptyColor, width: 10 },
    to: { color: fullColor, width: 10 },

    // Set default step function for all animate calls
    step: function(state, circle) {
      circle.path.setAttribute('stroke', state.color);
      circle.path.setAttribute('stroke-width', state.width);
      var value = Math.round(circle.value() * 100);
      circle.setText(value + '%');
    }
  }));
}

function bindWelcomeName() {
  $('#welcome-name').html(getName());
}

function bindKYCFormEmail() {
  var kycLink = $('#kyc-notice a');
  kycLink.attr('href', kycLink
    .attr('href')
    .replace("{{USER_ID}}", getUserId())
    .replace("{{USER_EMAIL}}", getEmail())
  );
}

function bindReferralStats() {
  $("#dashboard-ref-count").text(numReferralSignups());
  $("#dashboard-ref-commission").text(REFERRAL_EURO_RAISE);
}

function bindTemplateData() {
  bindWelcomeName();
  bindReferralButtonUrl();
  bindReferralLink();
  bindReferralStats();
  bindKYCFormEmail();
}

function hideLoginUI() {
  $("#dashboard-loading-overlay").hide();
  $("#protected-content-container").show();
}

function showLoginUI() {
  $("#dashboard-loading-overlay").show();
  $("#protected-content-container").hide();
}

function updateTokensToReceive() {
  var baseTokenCount = euroToTokenAmount(sliderMinInvestment);
  var totalTokensSold = (sliderSalePhase / 100) * BASE_TOKEN_AMOUNT;
  var tokenCount = baseTokenCount + tokenBonusAmount(baseTokenCount, totalTokensSold);
  $(".investment-token-result").text("" + tokenCount);
  $("#investment-manual-amount").val(sliderMinInvestment);
};

function numTokensSold() {
  return euroToTokenAmount(Math.max(0, TOTAL_EURO_RAISED))
}

function numTokenBalance() {
  return euroToTokenAmount(Math.max(0, EURO_INVESTED));
}

function numTokenBonusBalance() {
  return tokenBonusAmount(numTokenBalance());
}

function numReferralSignups() {
  return REFERRAL_INVESTOR_IDS.length;
}

function tokensSaleAvailable() {
  return BASE_TOKEN_AMOUNT - numTokensSold();
}

function percentageOf(fraction, total) {
  var division = total / fraction;
  return (division > 0) ? ((1/division)*100) : 0;
}

function percentTotalSupply(tokenAmount) {
  return percentageOf(tokenAmount, BASE_TOKEN_AMOUNT);
}

function percentSoldSupply(tokenAmount) {
  return percentageOf(tokenAmount, numTokensSold());
}

function tokenBonusAmount(tokenAmount, totalTokensSold) {
  var tokenAmountModifier = getBonusModifier(totalTokensSold);
  var bonusModifier = ((tokenAmountModifier * 1000) - 1000) / 1000; // due to strange rounding error
  return Math.round(tokenAmount * bonusModifier);
}

function getBonusModifier(totalTokensSold) {
  var bonusModifier = 1.0;
  var salePhase = percentTotalSupply(totalTokensSold);
  if (salePhase < 2) {

  }
  else if (salePhase < 10) {
    bonusModifier = 1.1;
  }
  else if (salePhase < 25) {
    bonusModifier = 1.2;
  }
  else if (salePhase < 50) {
    bonusModifier = 1.3;
  }
  else if (salePhase < 95) {
    bonusModifier = 1.4;
  }
  else {
    bonusModifier = 1.5;
  }
  return bonusModifier;
}

function isInvestorOurReferral(id) {
  return REFERRAL_INVESTOR_IDS.includes(id);
}

function euroToTokenAmount(euroAmount) {
  return euroAmount * 4;
}

function updateEuroInvested() {
  updateInvestorEuroInvested();
  updateTotalEuroInvested();
}

function updateInvestorEuroInvested() {
  updateSupplyShareUI();
  updateTokenBalanceUI();
  updateTokenBonusBalanceUI();
}

function updateTotalEuroInvested() {
  updateSupplyBarUI();
  updateSupplyShareUI();
}

function updateReferralStats() {
  bindReferralStats();
}

function updateTokenBalanceUI() {
  updateTokenStatBalanceUI('#balance-total', numTokenBalance());
}

function updateTokenBonusBalanceUI() {
  updateTokenStatBalanceUI('#bonus-total', numTokenBonusBalance());
}

function totalInvestorTokenAmount() {
  return numTokenBalance() + numTokenBonusBalance();
}

function updateTokenStatBalanceUI(selector, newValue) {
  $(selector).animateNumber({ number: newValue });
}

// function updateTokenBarUI(barUI, num, ) {
//   var shareModifier = percentSoldSupply(numTokenBalance()) / 100;
//   tokenShareBarUI.animate(shareModifier || 0);
// }

function updateSupplyShareUI() {
  var shareModifier = percentSoldSupply(numTokenBalance()) / 100;
  tokenShareBarUI.animate(shareModifier || 0);
}

function updateSupplyBarUI() {
  var modifier = percentTotalSupply(numTokensSold()) / 100;
  tokenSupplyBarUI.animate(1 - modifier);
}

function showError(code, message) {
  $("#dashboard-overlay-error-code").text(code);
  $("#dashboard-overlay-error-message").text(message);
  $("#dashboard-error-overlay").removeClass("hidden");
}

//
// DB paths
//

function dbEnv() {
  return db().ref(ENV);
}

function dbTransactions() {
  return dbEnv().child('transactions');
}

function dbInvestors() {
  return dbEnv().child('investors');
}

function dbThisInvestor() {
  return dbInvestors().child(getUserId());
}

function dbThisInvestorUserData() {
  return dbThisInvestor().child("userData");
}

function dbThisInvestorReferrer() {
  return dbThisInvestorUserData().child("referrer");
}

function dbThisInvestorDeposits() {
  return dbThisInvestor().child("deposits");
}

//
// Support
//

var _support = _support || { 'ui': {}, 'user': {} };
_support['account'] = 'troovebird';
_support['ui']['contactMode'] = 'mixed';
_support['ui']['enableKb'] = 'true';
_support['ui']['styles'] = {
  widgetColor: 'rgb(24, 162, 221)',
};
_support['ui']['widget'] = {
  label: {
    text: 'Let us know if you have any questions! 😊',
    mode: "notification",
    delay: 3,
    duration: 30,
    sound: true,
  },
  position: 'bottom-right',
};
_support['apps'] = {
  faq: {"enabled":true},
  recentConversations: {},
  orders: {}
};
