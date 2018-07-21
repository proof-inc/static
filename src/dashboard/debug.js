import State from "./state";
import DB from "./db";
import Session from "../session";
import UI from "./ui";

const DEBUG_PREFIX = "debug_";

window._troovebird = {

  //
  // NEW DEBUG ENTRIES
  //

  _newInvestor: function(referrer) {
    var randomId = Math.random().toString(36).substr(2, 30);
    var id = DEBUG_PREFIX + randomId;
    DB._initInvestorMeta(id, referrer);
    return id;
  },

  _newRefInvestor: function() {
    return this._newInvestor(Session.getUserId());
  },

  _newTx: function(investorId, euroAmount) {
    var randomAmount = Math.floor(Math.random() * Math.floor(300000));
    DB._initTransaction(investorId || this._newInvestor(), euroAmount || randomAmount);
  },

  _newRefTx: function(investorId, euroAmount) {
    this._newTx(investorId || this._newRefInvestor(), euroAmount);
  },

  _newMeTx: function(euroAmount) {
    this._newTx(Session.getUserId(), euroAmount);
  },

  //
  // INSPECT ENV
  //

  _dumpBalances: function() {
    console.log(State.getInvestorBalances());
  },

  _dumpInvestors: function() {
    console.log(State.getInvestors());
  },

  _dumpInvestorReferrals: function() {
    console.log(State.getReferralInvestorIds());
  },

  _dumpTxs: function() {
    console.log(State.getTransactions());
  },

  //
  // CLEAR
  //

  _clearInvestors: function() {
    console.log("clearing investors");
    DB.dbInvestors().remove();
    UI.update();
  },

  _clearTx: function() {
    console.log("clearing transactions");
    DB.dbTransactions().remove();
    State.resetTransactions();
    UI.update();
  },

  _clearAll: function() {
    this._clearTx();
    this._clearInvestors();
    State._clearStorage();
  },

  //
  // UI
  //

  _refresh: function() {
    UI.update();
  }
};
