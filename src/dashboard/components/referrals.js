import Session from '../../session';
import State from '../state';
import * as moment from 'moment';
import UI from "../ui";

import {BASE_TOKEN_AMOUNT, EURO_PRICE_PER_TOKEN, REFERRAL_PERCENT_FEE} from '../constants';

var investorList = $("#referral-user-list");
var txList = $("#referral-tx-list");

function init() {
  bindReferralButtonUrl();
  bindReferralLink();
  bindReferralStats();
}

function update() {
  bindReferralStats();
  updateReferralLists();
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
  clearReferralInvestors();
  clearReferralTransactions();
}

function clearReferralInvestors() {
  investorList.empty();
}

function clearReferralTransactions() {
  txList.empty();
}

function updateReferralLists() {
  bindReferralStats();
  if (State.hasReferralSignups()) {
    updateInvestorList();
  }
  if (State.hasReferralTransactions()) {
    updateTransactionList();
  }
}

function updateInvestorList() {
  clearReferralInvestors();
  State.getReferralInvestorBalances().forEach(registerInvestorReferral);
}

function updateTransactionList() {
  clearReferralTransactions();
  State.getReferralTransactions().forEach(registerTransactionReferral);
}

function createHtmlItem(investorId, registrationTimestamp, euroAmount) {
  return `<li class="referral-user-item"> \
    <div class="referral-user-id"> \
      <strong>${investorId}</strong> \
    </div> \
    <div class="referral-user-meta"> \
      <div class="referral-meta-item referral-timestamp"> ${moment(registrationTimestamp).fromNow()}</div> \
      <div class="referral-meta-item referral-amount"> €${euroAmount}</div> \
      <div class="referral-meta-item referral-percent"> €${State.getEuroReferralCommission(euroAmount)}</div> \
    </div> \
  </li>`
}

function registerInvestorReferral(investor) {
  investorList.append(createHtmlItem(investor.id, investor.registrationTimestamp, investor.euroAmount));
}

function registerTransactionReferral(tx) {
  txList.append(createHtmlItem(tx.investorId, tx.timestamp, tx.euroAmount));
}

// dynamic
function bindReferralStats() {
  UI.updateTokenStatBalanceUI("#dashboard-ref-count", State.numReferralSignups());
  UI.updateTokenStatBalanceUI("#dashboard-ref-commission", State.numReferralCommissionAmount());
}

export default {init, update};
