import Session from '../../session';
import State from '../state';

var investorList = $("#referral-user-list");
var txList = $("#referral-tx-list");

function init() {
  bindReferralButtonUrl();
  bindReferralLink();
  bindReferralStats();
}

function update() {
  bindReferralStats();
}

// one-time
function bindReferralButtonUrl() {
  $("#referral-button").attr("href", "/privatesale/" + Session.getUserId());
}

// one-time
function bindReferralLink() {
  var url = AUTH0_CALLBACK_URL + '/' + Session.getUserId();
  $(".referral-link")
    .text(url)
    .attr("href", url);
}

// one-time
function clearReferralLists() {
  investorList.empty();
  txList.empty();
}

function registerInvestorReferral(investorId, registrationTimestamp, totalAmount) {

}

function registerTransactionReferral(investorId, registrationTimestamp, totalAmount) {

}

// dynamic
function bindReferralStats() {
  $("#dashboard-ref-count").text(State.numReferralSignups());
  $("#dashboard-ref-commission").text(State.numReferralCommissionAmount());
}

export default {init, update};
