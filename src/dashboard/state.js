import Util from '../util';
import Session from '../session';
import UI from "./ui";
import DB from './db';

import {BASE_TOKEN_AMOUNT, EURO_PRICE_PER_TOKEN, REFERRAL_PERCENT_FEE} from './constants';

// whether a registration was done for this user account
var INITIALIZED = false;

// whether we detected the KYC form to have been completed
var KYC_FILLED = false;

// the investor ids of people referred by this account
var REFERRAL_INVESTOR_IDS = [];

// hash of investor ids to balances
var INVESTOR_BALANCES = {};

// transactions done by people referred by this account
var REFERRAL_TRANSACTIONS = [];

// timestamp of last investment done
var LAST_INVESTMENT_TIMESTAMP = null;

// cache of total objects
var _transactions = null;
var _investors = null;

export default {

  reset: function() {
    REFERRAL_INVESTOR_IDS = [];
    REFERRAL_TRANSACTIONS = [];
    INVESTOR_BALANCES = {};
  },

  setTransactions: function(tx) {
    this._transactions = tx;
    this.parseTransactions();
  },

  setInvestors: function(investors) {
    this._investors = investors;
    this.parseInvestors();
  },

  parseInvestors: function() {
    console.log("parsing investors");
    var refIds = [], that = this;
    $.each(this._investors, function(investorId, investor) {
      if (that.parseInvestor(investorId, investor)) { // if this investor is a referral
        refIds.push(investorId);
      }
    });

    // suppose an investor had been registered but the referral id
    // only catches on later. then the investor list changes,
    // but we need to rescan transactions to count referrals
    if (this.updateReferralInvestorIds(refIds)) {
      // DB.refreshTransactions();
      this.parseTransactions();
    }

    UI.update();
  },

  parseInvestor: function(id, data) {
    if (Session.isCurrentUser(id)) {
      if (data.kycDone) {
        this.setKYCDone();
      }
      this.setInvestorInitialized();
    }
    return Session.isCurrentUser(data.referrer);
  },

  // parse transactiosn given a snapshot
  parseTransaction: function(tx) {
    console.log("parsing transaction ", tx);
    var timestamp = parseInt(tx.timestamp);
    var euroAmount = parseInt(tx.euroAmount);
    var userId = tx.investorId;
    var paymentMethod = tx.method;
    this.processTx(userId, euroAmount, timestamp, tx);
  },

  parseSingleTransaction: function(tx) {
    this.parseTransaction(tx);
    UI.update();
  },

  // parse transactiosn given a snapshot
  parseTransactions: function() {
    console.log("parsing transactions");
    this.reset();
    var that = this;
    $.each(this._transactions, function(key, tx){
      that.parseTransaction(tx);
    });
    UI.update();
  },

  processTx: function(investorId, amount, timestamp, tx) {

    this.adjustInvestorBalanceEntry(investorId, amount);

    // transaction for someone else. however,
    // if we did refer them we get 2%
    if (this.isInvestorOurReferral(investorId)) {
      REFERRAL_TRANSACTIONS.push(tx);
      console.log("found referral transaction: ", tx)
    }

    // mark time of last investment
    if (LAST_INVESTMENT_TIMESTAMP == null || timestamp > LAST_INVESTMENT_TIMESTAMP) {
      LAST_INVESTMENT_TIMESTAMP = timestamp;
    }
  },

  initInvestorBalanceEntry: function(investorId) {
    if (!INVESTOR_BALANCES[investorId]) {
      INVESTOR_BALANCES[investorId] = 0;
    }
  },

  adjustInvestorBalanceEntry: function(investorId, mutation) {
    this.initInvestorBalanceEntry(investorId);
    INVESTOR_BALANCES[investorId] += mutation;
    return this.getInvestorBalance(investorId);
  },

  numBaseTokenAmount: function() {
    return BASE_TOKEN_AMOUNT;
  },

  numTotalEuroRaised: function() {
    var t = 0, that = this;
    $.each(INVESTOR_BALANCES, function(investorId, balance) {
      t += that.getInvestorBalance(investorId);
    });
    return t;
  },

  numInvestorEuroRaised: function() {
    return this.getInvestorBalance(Session.getUserId());
  },

  numTokensSold: function() {
    return this.euroToTokenAmount(Math.max(0, this.numTotalEuroRaised()))
  },

  numTokenBalance: function() {
    return this.euroToTokenAmount(Math.max(0, this.numInvestorEuroRaised()));
  },

  numTokenBonusBalance: function() {
    return this.tokenBonusAmount(this.numTokenBalance());
  },

  numReferralSignups: function() {
    return REFERRAL_INVESTOR_IDS.length;
  },

  numReferralTransactions: function() {
    return REFERRAL_TRANSACTIONS.length;
  },

  hasReferralSignups: function() {
    return this.numReferralSignups() > 0;
  },

  hasReferralTransactions: function() {
    return this.numReferralTransactions() > 0;
  },

  numReferralCommissionAmount: function() {
    var commission = 0, that = this;
    REFERRAL_TRANSACTIONS.forEach(function(tx) {
      commission += (tx.euroAmount * that.referralFeeModifier()).toFixed(2);
    });
    return commission;
  },

  totalInvestorTokenAmount: function() {
    return this.numTokenBalance() + this.numTokenBonusBalance();
  },

  setKYCDone: function() {
    KYC_FILLED = true;
  },

  setInvestorInitialized: function() {
    INITIALIZED = true;
  },

  getInvestorBalance: function(investorId) {
    this.initInvestorBalanceEntry(investorId);
    return INVESTOR_BALANCES[investorId];
  },

  getReferralInvestorIds: function() {
    return REFERRAL_INVESTOR_IDS;
  },

  setReferralInvestorIds: function(newIds) {
    REFERRAL_INVESTOR_IDS = newIds;
  },

  updateReferralInvestorIds: function(newIds) {
    if (!Util.arrayEqual(newIds, this.getReferralInvestorIds())) {
      this.setReferralInvestorIds(newIds);
      return true;
    }
    return false;
  },

  referralFeeModifier: function() {
    return REFERRAL_PERCENT_FEE / 100;
  },

  isInvestorOurReferral: function(id) {
    return this.getReferralInvestorIds().includes(id);
  },

  tokensSaleAvailable: function() {
    return BASE_TOKEN_AMOUNT - this.numTokensSold();
  },

  euroSaleAvailable: function() {
    return this.tokensSaleAvailable() * EURO_PRICE_PER_TOKEN;
  },

  percentTotalSupply: function(tokenAmount) {
    return Util.percentageOf(tokenAmount, BASE_TOKEN_AMOUNT);
  },

  // what the amoutn of tokens is relative to total supply
  // expressed in fraction from 0-1
  modifierSoldSupply() {
    return this.percentTotalSupply(this.numTokensSold()) / 100;
  },

  percentSoldSupply: function(tokenAmount) {
    return Util.percentageOf(tokenAmount, this.numTokensSold());
  },

  tokenBonusAmount: function(tokenAmount, totalTokensSold) {
    var tokenAmountModifier = this.getBonusModifier(totalTokensSold);
    var bonusModifier = ((tokenAmountModifier * 1000) - 1000) / 1000; // due to strange rounding error
    return Math.round(tokenAmount * bonusModifier);
  },

  getBonusModifier: function(totalTokensSold) {
    var bonusModifier = 1.0;
    var salePhase = this.percentTotalSupply(totalTokensSold);
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
    return euroAmount / EURO_PRICE_PER_TOKEN;
  }
};
