import Util from '../util';
import Session from '../session';
import UI from "./ui";
import DB from './db';
import merge from 'deepmerge';

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

const TRANSACTIONS_STORE_KEY = "_transactions";
const INVESTORS_STORE_KEY = "_investors";

export default {

  reset: function() {
    this.resetInvestors();
    this.resetTransactions();
  },

  resetInvestors: function() {
    REFERRAL_INVESTOR_IDS = [];
    INVESTOR_BALANCES = {};
    // this._storeObject(INVESTORS_STORE_KEY, {});
  },

  resetTransactions: function() {
    INVESTOR_BALANCES = {};
    REFERRAL_TRANSACTIONS = [];
    // this._storeObject(TRANSACTIONS_STORE_KEY, {});
  },

  _clearStorage: function() {
    [TRANSACTIONS_STORE_KEY, INVESTORS_STORE_KEY].forEach(function(key) {
      this._storeObject(key, {});
    }, this);
  },

  _storeObject: function(key, value, _default) {
    localStorage.setItem(key, JSON.stringify(value || _default));
  },

  _retrieveObject: function(key) {
    return JSON.parse(localStorage.getItem(key));
  },

  setTransactions: function(tx) {
    this._storeObject(TRANSACTIONS_STORE_KEY, tx, {});
    this.parseTransactions();
  },

  addTransaction: function(tx, txId) {
    var oldTx = this.getTransactions();
    var newTx = {}; newTx[txId] = tx;
    this._storeObject(TRANSACTIONS_STORE_KEY, merge(oldTx, newTx), {});
    this.parseSingleTransaction(tx);
  },

  getTransactions: function() {
    return this._retrieveObject(TRANSACTIONS_STORE_KEY) || {};
  },

  setInvestors: function(investors) {
    this._storeObject(INVESTORS_STORE_KEY, investors, {});
    this.resetInvestors();
    this.parseInvestors();
  },

  getInvestors: function() {
    return this._retrieveObject(INVESTORS_STORE_KEY) || {};
  },

  getInvestor: function(id) {
    return this.getInvestors()[id];
  },

  parseInvestors: function() {
    console.log("parsing investors");
    var refIds = [], that = this;
    $.each(this.getInvestors(), function(investorId, investor) {
      if (that.parseInvestor(investorId, investor)) { // if this investor is a referral
        console.log("referral investor found: ", investorId);
        refIds.push(investorId);
      }
    });

    // suppose an investor had been registered but the referral id
    // only catches on later. then the investor list changes,
    // but we need to rescan transactions to count referrals
    if (this.updateReferralInvestorIds(refIds)) {
      console.log("rescanning transactions after discovering new referral investors");
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
    var investorId = tx.investorId;
    var paymentMethod = tx.method;

    this.adjustInvestorBalanceEntry(investorId, euroAmount);

    // transaction for someone else. however,
    // if we did refer them we get 2%
    if (this.isInvestorOurReferral(investorId)) {
      this.getReferralTransactions().push(tx);
      console.log("found referral transaction")
    }

    // mark time of last investment
    if (LAST_INVESTMENT_TIMESTAMP == null || timestamp > LAST_INVESTMENT_TIMESTAMP) {
      LAST_INVESTMENT_TIMESTAMP = timestamp;
    }
  },

  parseSingleTransaction: function(tx, txId) {
    this.parseTransaction(tx);
    UI.update();
  },

  // parse transactiosn given a snapshot
  parseTransactions: function() {
    console.log("parsing transactions");
    this.resetTransactions();
    var that = this;
    $.each(this.getTransactions(), function(key, tx){
      that.parseTransaction(tx);
    });
    UI.update();
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
    return this.tokenBonusAmount(this.numTokenBalance(), this.numTokensSold());
  },

  numReferralSignups: function() {
    return REFERRAL_INVESTOR_IDS.length;
  },

  numReferralTransactions: function() {
    return this.getReferralTransactions().length;
  },

  hasReferralSignups: function() {
    return this.numReferralSignups() > 0;
  },

  hasReferralTransactions: function() {
    return this.numReferralTransactions() > 0;
  },

  numReferralCommissionAmount: function() {
    var commission = 0, that = this;
    this.getReferralTransactions().forEach(function(tx) {
      commission += parseInt(that.getEuroReferralCommission(tx.euroAmount));
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

  getEuroReferralCommission: function(euroAmount) {
    return (parseInt(euroAmount) * this.referralFeeModifier()).toFixed(2);
  },

  getReferralTransactions: function() {
    return REFERRAL_TRANSACTIONS;
  },

  getInvestorBalances: function() {
    return INVESTOR_BALANCES;
  },

  getInvestorBalance: function(investorId) {
    this.initInvestorBalanceEntry(investorId);
    return this.getInvestorBalances()[investorId];
  },

  getReferralInvestorIds: function() {
    return REFERRAL_INVESTOR_IDS;
  },

  getReferralInvestorBalances: function() {
    return this.getReferralInvestorIds().map(function(investorId){
      return jQuery.extend(true, {
        id: investorId,
        euroAmount: this.getInvestorBalance(investorId)
      }, this.getInvestor(investorId));
    }, this);
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

  isInvestorInvested: function() {
    return this.numInvestorEuroRaised() > 0;
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
