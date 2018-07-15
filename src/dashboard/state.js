import Util from '../util';

// constants
const BASE_TOKEN_AMOUNT = 120 * 1000000;

// the total sum of contributions
var TOTAL_EURO_RAISED = 0;

// the amont this user account invested
var EURO_INVESTED = 0;

// whether a registration was done for this user account
var INITIALIZED = false;

// whether we detected the KYC form to have been completed
var KYC_FILLED = false;

// the investor ids of people referred by this account
var REFERRAL_INVESTOR_IDS = [];

// transactions done by people referred by this account
var REFERRAL_TRANSACTIONS = [];

// timestamp of last investment done
var LAST_INVESTMENT_TIMESTAMP = null;

export default {

  reset: function() {
    TOTAL_EURO_RAISED = 0;
    EURO_INVESTED = 0;
    REFERRAL_INVESTOR_IDS = [];
    REFERRAL_TRANSACTIONS = [];
  },

  numTokensSold: function() {
    return euroToTokenAmount(Math.max(0, TOTAL_EURO_RAISED))
  },

  numTokenBalance: function() {
    return euroToTokenAmount(Math.max(0, EURO_INVESTED));
  },

  numTokenBonusBalance: function() {
    return tokenBonusAmount(numTokenBalance());
  },

  numReferralSignups: function() {
    return REFERRAL_INVESTOR_IDS.length;
  },

  numReferralCommissionAmount: function() {
    var commission = 0;
    REFERRAL_TRANSACTIONS.forEach(function(tx) {
      commission += (tx.euroAmount * 0.02).toFixed(2);
    });
    return commission;
  },

  totalInvestorTokenAmount: function() {
    return numTokenBalance() + numTokenBonusBalance();
  },

  setKYCDone: function() {
    KYC_FILLED = true;
  },

  setInvestorInitialized: function() {
    INITIALIZED = true;
  },

  getReferralInvestorIds: function() {
    return REFERRAL_INVESTOR_IDS;
  },

  setReferralInvestorIds: function(newIds) {
    REFERRAL_INVESTOR_IDS = newIds;
  },

  updateReferralInvestorIds: function(newIds) {
    if (!Util.arrayEqual(newIds, getReferralInvestorIds())) {
      setReferralInvestorIds(newIds);
      return true;
    }
    return false;
  },

  isInvestorOurReferral: function(id) {
    return getReferralInvestorIds().includes(id);
  },

  tokensSaleAvailable: function() {
    return BASE_TOKEN_AMOUNT - numTokensSold();
  },

  processTx: function(investorId, amount, timestamp, tx) {
    // TODO: make sure it doesnt go below 0
    TOTAL_EURO_RAISED += amount;

    // one of our transactions
    if (Session.isCurrentUser(investorId)) {
      EURO_INVESTED += amount;
    }

    // transaction for someone else. however,
    // if we did refer them we get 2%
    else if (State.isInvestorOurReferral(investorId)) {
      REFERRAL_TRANSACTIONS.push(tx);
    }

    // mark time of last investment
    if (LAST_INVESTMENT_TIMESTAMP == null || timestamp > LAST_INVESTMENT_TIMESTAMP) {
      LAST_INVESTMENT_TIMESTAMP = timestamp;
    }
  },

  percentTotalSupply: function(tokenAmount) {
    return percentageOf(tokenAmount, BASE_TOKEN_AMOUNT);
  },

  // what the amoutn of tokens is relative to total supply
  // expressed in fraction from 0-1
  modifierSoldSupply() {
    return percentTotalSupply(numTokensSold()) / 100;
  },

  percentSoldSupply: function(tokenAmount) {
    return percentageOf(tokenAmount, numTokensSold());
  },

  tokenBonusAmount: function(tokenAmount, totalTokensSold) {
    var tokenAmountModifier = getBonusModifier(totalTokensSold);
    var bonusModifier = ((tokenAmountModifier * 1000) - 1000) / 1000; // due to strange rounding error
    return Math.round(tokenAmount * bonusModifier);
  },

  getBonusModifier: function(totalTokensSold) {
    var bonusModifier = 1.0;
    var salePhase = percentTotalSupply(totalTokensSold);
    if (salePhase < 2){

    }
    else if (salePhase < 10){
      bonusModifier = 1.1;
    }
    else if (salePhase < 25){
      bonusModifier = 1.2;
    }
    else if (salePhase < 50){
      bonusModifier = 1.3;
    }
    else if (salePhase < 95){
      bonusModifier = 1.4;
    }
    else {
      bonusModifier = 1.5;
    }
    return bonusModifier;
  },

  euroToTokenAmount: function(euroAmount) {
    return euroAmount * 4;
  }
};