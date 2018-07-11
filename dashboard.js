//
// CONFIG & INIT
//

// TODO: capitalise?
var sliderMinInvestment = 1000;
var sliderSalePhase = 0;

const strokeWidth = 25;
const emptyColor = '#cc0000';
const fullColor = '#26CA7B';
const backgroundColor = '#DDD';
const barTextFont = '"Raleway", Helvetica, sans-serif';

const BASE_TOKEN_AMOUNT = 120 * 1000000;
var TOTAL_TOKENS_SOLD = 0;

// init procedure dependent on site-wide init
// only register
$(window).on("load", function() {

  // callback to run when a login is detected
  onLogin(bootstrapDashboard);

  // callback to run when logout is detected
  onLogout(showLoginScreen);

  // The start method will wait until the DOM is loaded.
  login('#dashboard-loading-overlay', isProduction()
      ? 'https://troovebird.com/privatesale'
    	: 'https://staging.troovebird.com/privatesale');

});

//
// CREATE UI
//
var tokenShareBar = createTokenShareBar();
var tokenSupplyBar = createTokenSupplyBar();

// TODO: max aanpassen wanneer nieuwe investeringen gedaan worden
createInvestmentCalcSlider();
createSaleProgressCalcSlider();

// main init procedure
function bootstrapDashboard()
{
  // bind some template vars
  bindTemplateData();

  // manual input field for investment calc
  registerManualInvestmentAmountListener();

  // init ui
  updateTokensToReceive();

  // listen to changes on the euro invested field
  registerTotalInvestmentUpdates();

  // back to login prompt
  registerLogoutListener();

  // init investor entry
  registerInvestorLoggedIn();

  // hide loading screen
  hideLoginScreen();

  // listen to changes on the euro invested field
  registerInvestorInvestmentUpdates();
}

function logoutAndPrompt() {
  logout(showLoginScreen); // side-wide function of clearing session
}

function registerInvestorLoggedIn() {
  dbThisInvestor().once('value', function(snapshot) {
    var exists = (snapshot.val() !== null);
    exists ? initInvestorData() : registerInvestorLastSeenTimestamp();
  });
}

function initInvestorData() {
  console.log("initialized entry for investor: " + getUserId());
  dbThisInvestor().child("userData").set({
    logins: [now()]
  });
}

function registerInvestorLastSeenTimestamp() {
  dbThisInvestor()
    .child("userData")
    .child("logins")
    .push(now());
}

function now() {
  return (+ new Date());
}

//
// DB paths
//

function dbInvestors() {
  return db().ref('investors');
}

function dbThisInvestor() {
  return dbInvestors().child(getUserId());
}

function dbThisInvestorDeposits() {
  return dbThisInvestor().child("deposits");
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

// whenever the deposit array of this investor changes,
// tally the deposit value and update stats
function registerInvestorInvestmentUpdates() {
  dbThisInvestorDeposits().on('value', function(deposits) {
    updateInvestorEuroInvested(totalInvestorDeposits(deposits));
  }, function(error) {console.error(error)});
}

// whenever the deposit array of any investor changes,
// tally all deposit value and update stats
function registerTotalInvestmentUpdates() {
  dbInvestors().on('value', function(investors) {
    updateTotalEuroInvested(totalDeposits(investors));
  }, function(error) {console.error(error)});
}

function totalDeposits(investorsSnapshot) {
  var totalEuroInvested = 0;
  investorsSnapshot.forEach(function(investor) {
    totalEuroInvested += totalInvestorDeposits(investor.child('deposits'));
  });
  return totalEuroInvested;
}

function totalInvestorDeposits(depositsSnapshot) {
  var totalEuroInvested = 0;
  depositsSnapshot.forEach(function(deposit){
    totalEuroInvested += deposit.child('euroAmount').val();
  });
  return totalEuroInvested;
}

//
// UI factories
//

function createSaleProgressCalcSlider() {
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

function createInvestmentCalcSlider() {
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

function barBaseOptions() {
  return {
    strokeWidth: strokeWidth,
    trailColor: backgroundColor,
    trailWidth: 25,
    easing: 'easeInOut',
    duration: 1400,
    svgStyle: null,
    text: {
      style: {
        fontFamily: barTextFont,
        fontSize: '2rem',
        transform: null,
      }
    }
  }
}

function createTokenShareBar() {
  return new ProgressBar.SemiCircle('#progress-share-percentage', $.extend(true, barBaseOptions(), {
    color: '#FFEA82',
    text: {
      value: '',
      alignToBottom: false
    },
    from: {color: emptyColor},
    to: {color: fullColor},

    // Set default step function for all animate calls
    step: (state, bar) => {
      bar.path.setAttribute('stroke', state.color);
      var value = Math.round(bar.value() * 100);
      if (value > 1) {
        bar.setText(value);
      }
      else {
        bar.setText(0);
      }

      bar.text.style.color = state.color;
    }
  }));
}

function createTokenSupplyBar() {
  return new ProgressBar.Line('#token-supply-left-progress', $.extend(true, barBaseOptions(), {
    color: '#F8BC3F',
    trailColor: 'fff',
    svgStyle: {width: '100%', height: '100%'},
    text: {
      style: {
        color: '#333',
        //position: 'absolute',
        //right: '0',
        //top: '50px',
        "text-align": "center",
        padding: 0,
        margin: '-25px',
        "font-size": "50px",
        "font-weight": "bold",
        // transform: null,
      },
      autoStyleContainer: false
    },
    from: {color: emptyColor},
    to: {color: fullColor},
    step: (state, bar) => {
      bar.setText(Math.round(bar.value() * 100) + ' %');
      bar.path.setAttribute('stroke', state.color);
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

function bindTemplateData() {
  bindWelcomeName();
  bindKYCFormEmail();
}

function hideLoginScreen() {
  $("#dashboard-loading-overlay").hide();
  $("#protected-content-container").show();
}

function showLoginScreen() {
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

function tokensSaleAvailable() {
  return BASE_TOKEN_AMOUNT - TOTAL_TOKENS_SOLD;
}

function percentSold(tokenAmount) {
  return 1/((BASE_TOKEN_AMOUNT / tokenAmount))*100;
}

function tokenBonusAmount(tokenAmount, totalTokensSold) {
  var tokenAmountModifier = getBonusModifier(totalTokensSold);
  var bonusModifier = ((tokenAmountModifier * 1000) - 1000) / 1000; // due to strange rounding error
  return Math.round(tokenAmount * bonusModifier);
}

function getBonusModifier(totalTokensSold) {
  var bonusModifier = 1.0;
  var salePhase = percentSold(totalTokensSold);
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

function updateInvestorEuroInvested(amount) {
  var tokenAmount = euroToTokenAmount(amount);
  var shareModifier = percentSold(tokenAmount) / 100;
  var tokenBonus = tokenBonusAmount(tokenAmount);
  var totalTokenAmount = tokenAmount + tokenBonus;
  tokenShareBar.animate(shareModifier);
  $('#balance-total').animateNumber({ number: tokenAmount });
  $('#bonus-total').animateNumber({ number: tokenBonus });
}

function updateTotalEuroInvested(amount) {
  TOTAL_TOKENS_SOLD = euroToTokenAmount(amount);
  var modifier = percentSold(TOTAL_TOKENS_SOLD) / 100;
  tokenSupplyBar.animate(1 - modifier);
}

function euroToTokenAmount(euroAmount) {
  return euroAmount * 4;
}

function showError(code, message) {
  $("#dashboard-overlay-error-code").text(code);
  $("#dashboard-overlay-error-message").text(message);
  $("#dashboard-error-overlay").removeClass("hidden");
}

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
