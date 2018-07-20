import UI from './ui';
import Session from '../session';
import Referrer from './referrer';
import Util from '../util';
import State from './state';

export default {

  init: function() {
    this.registerInvestorLoggedIn();
    this.registerInvestorListener();
    this.registerTransactionListener();
  },

  // whenever any investor data changes, reparse
  registerInvestorListener: function() {
    this.dbInvestors().on("value", function(investorsSnapshot) {
      State.setInvestors(investorsSnapshot.val());
    });
  },

  // reparse all transactions when a new one occurs
  registerTransactionListener: function() {
    this.dbTransactions().on("child_added", function(txSnapshot) {
      State.parseSingleTransaction(txSnapshot.val());
    });
  },

  // manually trigger parsing transactions
  refreshTransactions: function() {
    this.dbTransactions().once("value", function(txsSnapshot) {
      State.setTransactions(txsSnapshot.val());
    });
  },

  registerInvestorLoggedIn: function() {
    var that = this;
    this.dbThisInvestor().once('value', function(snapshot) {
      var exists = (snapshot.val() !== null);
      if (exists) {
        that.registerInvestorMeta();
      }
      else {
        that.initInvestorMeta();
      }
    });
  },

  initInvestorMeta: function() {
    console.log("initialized entry for investor: ", Session.getUserId());
    this.dbThisInvestor().set({
      referrer: Referrer.get(),
      kycDone: false,
      registrationTimestamp: Util.now()
    });
    this.registerInvestorLastSeenTimestamp();
  },

  registerInvestorMeta: function() {
    this.registerInvestorLastSeenTimestamp();
    this.registerReferrer();
  },

  registerInvestorLastSeenTimestamp: function() {
    this.dbEnv()
      .child("logins")
      .push({
        timestamp: Util.now(),
        investor: Session.getUserId()
      });
  },

  // extra chance of registering the referrer if we already had been authenticated
  // and therefore the registration is not run
  registerReferrer: function() {
    if (Referrer.hasReferrer()) {
      this.dbThisInvestorReferrer().set(Referrer.get());
    }
  },

  //
  // DB paths
  //

  dbEnv: function() {
    return Session.dbEnv();
  },

  dbTransactions: function() {
    return this.dbEnv().child('transactions');
  },

  dbInvestors: function() {
    return this.dbEnv().child('investors');
  },

  dbThisInvestor: function() {
    return this.dbInvestors().child(Session.getUserId());
  },

  dbThisInvestorUserData: function() {
    return this.dbThisInvestor().child("userData");
  },

  dbThisInvestorReferrer: function() {
    return this.dbThisInvestor().child("referrer");
  },

  // dbThisInvestorDeposits: function() {
  //   return this.dbThisInvestor().child("deposits");
  // },
}
