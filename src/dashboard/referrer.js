import Session from '../session';

const REFERRER_STORAGE_KEY = "referrer";
const REFERRER_URL_KEY = "ref";

function parse() {
  if ('URLSearchParams' in window) {
    if (hasReferrerUrl() && !isReferrerUrlOwn()) {
      setReferrer(getReferrerUrl());
      deleteReferrerUrl();
    }
  }
}

function hasReferrerUrl() {
  return getReferrerUrl() && getReferrerUrl() !== "";
}

function hasReferrer() {
  var r = getReferrer();
  return r != "" && r != null && r != undefined && r != "null" && r != Session.getUserId();
}

function deleteReferrerUrl() {
  window.history.replaceState(null, null, window.location.pathname); // delete referral trace
}

function resetReferrer() {
  return setReferrer("");
}

function setReferrer(ref) {
  localStorage.setItem(REFERRER_STORAGE_KEY, (ref != Session.getUserId()) ? ref : "");
  console.info("Referrer set: ", ref);
  return getReferrer();
}

function setReferrerUrl() {
  if ('URLSearchParams' in window) {
    var searchParams = new URLSearchParams(window.location.search)
    searchParams.set(REFERRER_URL_KEY, Session.getUserId());
    var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
    history.pushState(null, '', newRelativePathQuery);
  }
}

function getReferrerUrl() {
  return (new URLSearchParams(window.location.search)).get(REFERRER_URL_KEY);
}

function isReferrerUrlOwn() {
  return hasReferrerUrl() && (getReferrerUrl() == getUserId());
}

function getReferrer() {
  var ref = localStorage.getItem(REFERRER_STORAGE_KEY);
  return (ref == Session.getUserId()) ? resetReferrer() : ref;
}

function get() {
  return getReferrer();
}

function isInvestorOurReferral(id) {
  return State.isInvestorOurReferral(id);
}

export default {isInvestorOurReferral, getReferrer, get, isReferrerUrlOwn, getReferrerUrl,
  setReferrerUrl, setReferrer, resetReferrer, deleteReferrerUrl,
  hasReferrer, hasReferrerUrl, parse};
