import UI from './ui';
import Session from '../session';
import Referrer from './referrer';
import Util from '../util';
import State from './state';

var functions = {

  init: function() {
    this.registerInvestorLoggedIn();
    this.registerInvestorListener();
    this.registerTransactionListener();
  },

  // whenever any investor data changes, reparse
  registerInvestorListener: function() {
    this.dbInvestors().on("value", function(investorsSnapshot) {
      console.log("investors on value() callback");
      State.setInvestors(investorsSnapshot.val());
    });
  },

  // reparse all transactions when a new one occurs
  registerTransactionListener: function() {
    this.dbTransactions().on("child_added", function(txSnapshot) {
      console.log("transactions on child_added() callback");
      // State.parseSingleTransaction(txSnapshot.val(), txSnapshot.key);
      State.addTransaction(txSnapshot.val(), txSnapshot.key);
    });
  },

  // manually trigger parsing transactions
  refreshTransactions: function() {
    this.dbTransactions().once("value", function(txsSnapshot) {
      console.log("transactions on value() (once) callback");
      State.setTransactions(txsSnapshot.val());
    });
  },

  registerInvestorLoggedIn: function() {
    var that = this;
    this.dbThisInvestor()
      .once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);
        if (exists) {
          that.registerInvestorMeta();
        }
        else {
          that.initInvestorMeta();
        }
      })
      .catch(function(error) {
        console.error('failed to get investor list: ', error);
      });;
  },

  initInvestorMeta: function() {
    this._initInvestorMeta(Session.getUserId(), Referrer.get());
    this.registerInvestorLastSeenTimestamp();
  },

  // useful for debugging
  _initInvestorMeta: function(investorId, referrer) {
    console.log(`initialized entry for investor: ${investorId} with referrer: ${referrer}`);
    this.dbInvestor(investorId).set({
      referrer: referrer,
      kycDone: false,
      registrationTimestamp: this.dbTimestamp()
    })
    .catch(function(error) {
      console.error('failed to register new investor: ', error);
    });
  },

  _initTransaction: function(investorId, euroAmount) {
    console.log(`initialized tx for investor ${investorId} of €${euroAmount}`);
    this.dbTransactions().push({
      timestamp: this.dbTimestamp(),
      investorId: investorId,
      euroAmount: euroAmount
    })
    .catch(function(error) {
      console.error('failed to push new transaction: ', error);
    });
  },

  registerInvestorMeta: function() {
    this.registerInvestorLastSeenTimestamp();
    this.registerReferrer();
  },

  registerInvestorLastSeenTimestamp: function() {
    this.dbEnv()
      .child("logins")
      .push({
        timestamp: this.dbTimestamp(),
        investor: Session.getUserId()
      })
      .catch(function(error) {
        console.error('failed to register last seen timestamp: ', error);
      });
  },

  // extra chance of registering the referrer if we already had been authenticated
  // and therefore the registration is not run
  registerReferrer: function() {
    if (Referrer.hasReferrer()) {
      this.dbThisInvestorReferrer().set(Referrer.get()).catch(function(error) {
        console.error('failed to register referrer: ', error);
      });
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

  dbInvestor: function(id) {
    return this.dbInvestors().child(id);
  },

  dbThisInvestor: function() {
    return this.dbInvestor(Session.getUserId());
  },

  dbThisInvestorUserData: function() {
    return this.dbThisInvestor().child("userData");
  },

  dbThisInvestorReferrer: function() {
    return this.dbThisInvestor().child("referrer");
  },

  dbTimestamp: function() {
    return Session.connection().database.ServerValue.TIMESTAMP;
  },

  // dbThisInvestorDeposits: function() {
  //   return this.dbThisInvestor().child("deposits");
  // },
};

export default functions;
