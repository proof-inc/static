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

// Initialize Firebase
firebase.initializeApp({
  apiKey: DASHBOARD_API_KEY,
  authDomain: DASHBOARD_AUTH_DOMAIN,
  databaseURL: DASHBOARD_DB_URL,
  projectId: DASHBOARD_PROJECT_ID,
  storageBucket: DASHBOARD_STORAGE_BUCKET,
  messagingSenderId: DASHBOARD_MESSAGING_SENDER_ID
});

// when all scripts have loaded
$(window).on("load", function() {

  // do the following only if we are logged in using Auth0
	handleAuthentication(login, function() {

    // hide loading screen
    $("#dashboard-loading-overlay").remove();

    //
    // IDENTITY INFO
    //
  	var userId = getUserId();
    var userIdHash = getUserIdHash();
    var name = localStorage.getItem('name');
    var email = localStorage.getItem('email'); // not every account comes with email...
    var loginTimestamp = (+ new Date());

    //
    // MANUALLY BIND TEMPLATE
    //

    var kycNoticeSrc = $('#kyc-notice a')
    	.attr('href')
      .replace("{{USER_ID}}", userIdHash)
      .replace("{{USER_EMAIL}}", email)
      ;

  	$('#welcome-name').html(name);
    $('#kyc-notice a').attr('href', kycNoticeSrc);

    //
    // DB HANDLERS
    //

    var db = firebase.database();
    var investors = db.ref('investors');
  	var thisInvestor = db.ref('investors').child(userIdHash);

  	// init investor entry
  	thisInvestor.once('value', function(snapshot) {
      var exists = (snapshot.val() !== null);

      // TODO: move to private webhook
      if (!exists) {
      	console.log("initialized entry for investor: " + userIdHash);
      	thisInvestor.set({
        	kycDone: false,
          euroInvested: 0,
          logins: [loginTimestamp]
        });
      }

      // register last seen
      else {
        thisInvestor.child("logins").push(loginTimestamp);
      }
    });

  	// listen to changes on the euro invested field
  	db.ref('investors/' + userIdHash + '/euroInvested').on('value', function(snapshot) {
      updateInvestorEuroInvested(snapshot.val());
    });

    // listen to changes on the euro invested field
  	// db.ref('stats/euroInvested').on('value', function(snapshot) {
    // 	TOTAL_TOKENS_SOLD = euroToTokenAmount(snapshot.val());
    //   updateTotalEuroInvested(snapshot.val());
    // }, function(error) {console.error(error)});

    // listen to changes on the euro invested field
  	db.ref('investors').on('value', function(snapshot) {
      var totalEuroInvested = 0;
      snapshot.forEach(function(snapshot){
        var investor = snapshot.val();
        totalEuroInvested += euroToTokenAmount(investor.euroInvested);
      });
      updateTotalEuroInvested(totalEuroInvested);
    }, function(error) {console.error(error)});

    //
    // CREATE UI ELEMENTS
    //

  	//
    var tokenShareBar = new ProgressBar.SemiCircle('#progress-share-percentage', {
      strokeWidth: strokeWidth,
      color: '#FFEA82',
      trailColor: backgroundColor,
      trailWidth: 25,
      easing: 'easeInOut',
      duration: 1400,
      svgStyle: null,
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
    });
    tokenShareBar.text.style.fontFamily = barTextFont;
    tokenShareBar.text.style.fontSize = '2rem';

    // token supply stats
    var tokenSupplyBar = new ProgressBar.Line('#token-supply-left-progress', {
      strokeWidth: strokeWidth,
      easing: 'easeInOut',
      duration: 1400,
      color: '#F8BC3F',
      trailColor: '#eee',
      trailWidth: 1,
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
          transform: null
        },
        autoStyleContainer: false
      },
      from: {color: emptyColor},
      to: {color: fullColor},
      step: (state, bar) => {
        bar.setText(Math.round(bar.value() * 100) + ' %');
        bar.path.setAttribute('stroke', state.color);
      }
    });

    tokenSupplyBar.text.style.fontFamily = barTextFont;

    //
    // CALCULATE THE TOKEN RETURN FOR A SPECIFIC DONATION HEIGHT
    //

    // TODO: max aanpassen wanneer nieuwe investeringen gedaan worden
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

    $("#sale-phase-slider").ionRangeSlider({
      min: 0,
      max: 100,
      from: sliderSalePhase,

      onChange: function (data) {
        sliderSalePhase = data.from;
        updateTokensToReceive();
      },
    });

    //
		$("#investment-manual-amount").change(function(){
    	sliderMinInvestment = $(this).val();
      $("#investment-slider")
      	.data("ionRangeSlider")
        .update({from: sliderMinInvestment});
      updateTokensToReceive();
    });

    // back to login prompt
		$("#log-out").click(logoutAndPrompt);

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
      $('#balance-total').text(tokenAmount);
      $('#bonus-total').text(tokenBonus);
    }

    function updateTotalEuroInvested(amount) {
    	TOTAL_TOKENS_SOLD = euroToTokenAmount(amount);
    	var modifier = percentSold(TOTAL_TOKENS_SOLD) / 100;
      tokenSupplyBar.animate(1 - modifier);
    }

		function euroToTokenAmount(euroAmount) {
    	return euroAmount * 4;
    }

		// init states
		//tokenShareBar.animate(0.01);
    //tokenSupplyBar.animate(1.0);
    updateTokensToReceive();
  });

});

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
