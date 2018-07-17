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
    this.dbInvestors().on("value", this.parseInvestors);
  },

  // reparse all transactions when a new one occurs
  registerTransactionListener: function() {
    this.dbTransactions().on("child_added", this.parseTransaction);
  },

  // manually trigger parsing transactions
  triggerParseTransactions: function() {
    this.dbTransactions().once("value", this.parseTransactions);
  },

  parseInvestors: function(investorsSnapshot) {
    console.log("parsing investors");
    State.setInvestors(investorsSnapshot.val());
    var newIds = [];
    investorsSnapshot.forEach(function(investorRef) {
      var investor = investorRef.val();
      var investorId = investorRef.key;

      // our data
      if (Session.isCurrentUser(investorId)) {
        if (investor.kycDone) {
          State.setKYCDone();
        }
        State.setInvestorInitialized();
      }

      // other investor
      else {
        if (Session.isCurrentUser(investor.referrer)) {
          newIds.push(investorId);
        }
      }
    });

    // suppose an investor had been registered but the referral id
    // only catches on later. then the investor list changes,
    // but we need to rescan transactions to count referrals
    if (State.updateReferralInvestorIds(newIds)) {
      this.triggerParseTransactions();
    }
  },

  // parse transactiosn given a snapshot
  parseTransaction: function(transactionSnapshot) {
    console.log("parsing transaction ", transactionSnapshot.toJSON());
    var tx = transactionSnapshot.val();
    var timestamp = parseInt(tx.timestamp);
    var euroAmount = parseInt(tx.euroAmount);
    var userId = tx.investorId;
    var paymentMethod = tx.method;
    State.processTx(userId, euroAmount, timestamp, tx);
    UI.update();
  },

  // parse transactiosn given a snapshot
  parseTransactions: function(transactionsSnapshot) {
    console.log("parsing transactions");
    State.reset();
    State.setTransactions(transactionsSnapshot.val());
    transactionsSnapshot.forEach(parseTransaction);
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
      kycDone: false
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
