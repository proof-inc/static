import UI from './ui';
import Session from '../session';
import Referrer from './referrer';
import Util from '../util';

module.exports = {

  init: function() {
    registerInvestorLoggedIn();
    registerInvestorListener();
    registerTransactionListener();
  },

  // whenever any investor data changes, reparse
  registerInvestorListener: function() {
    dbInvestors().on("value", parseInvestors);
  },

  // reparse all transactions when a new one occurs
  registerTransactionListener: function() {
    dbTransactions().on("child_added", parseTransaction);
  },

  // manually trigger parsing transactions
  triggerParseTransactions: function() {
    dbTransactions().once("value", parseTransactions);
  },

  parseInvestors: function(investorsSnapshot) {
    console.log("parsing investors");
    newIds = [];
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
      triggerParseTransactions();
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
    transactionsSnapshot.forEach(parseTransaction);
  },

  registerInvestorLoggedIn: function() {
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
  },

  initInvestorMeta: function() {
    console.log("initialized entry for investor: ", Session.getUserId());
    dbThisInvestorUserData().set({
      referrer: Referrer.get()
    });
    registerInvestorLastSeenTimestamp();
  },

  registerInvestorMeta: function() {
    registerInvestorLastSeenTimestamp();
    registerReferrer();
  },

  registerInvestorLastSeenTimestamp: function() {
    dbEnv()
      .child("logins")
      .push({
        timestamp: Util.now(),
        investor: Session.getUserId()
      });
  },

  // extra chance of registering the referrer if we already had been authenticated
  // and therefore the registration is not run
  registerReferrer: function() {
    if (hasReferrer()) {
      dbThisInvestorReferrer().setValue(Referrer.get());
    }
  },

  //
  // DB paths
  //

  dbEnv: function() {
    return Session.dbEnv();
  }

  dbTransactions: function() {
    return dbEnv().child('transactions');
  },

  dbInvestors: function() {
    return dbEnv().child('investors');
  },

  dbThisInvestor: function() {
    return dbInvestors().child(Session.getUserId());
  },

  dbThisInvestorUserData: function() {
    return dbThisInvestor().child("userData");
  },

  dbThisInvestorReferrer: function() {
    return dbThisInvestorUserData().child("referrer");
  },

  dbThisInvestorDeposits: function() {
    return dbThisInvestor().child("deposits");
  },
}
