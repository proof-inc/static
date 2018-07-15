import Dashboard from '../index';
import Session from '../../session';
import State from '../business';

function bindReferralButtonUrl() {
  $("#referral-button").attr("href", "/privatesale/" + Session.getUserId());
}

function bindReferralLink() {
  var url = AUTH0_CALLBACK_URL + '/' + Session.getUserId();
  $(".referral-link")
    .text(url)
    .attr("href", url);
}

function registerLogoutListener() {
  $("#log-out").click(Dashboard.logoutAndPrompt);
}

function bindWelcomeName() {
  $('#welcome-name').html(Session.getName());
}

function bindKYCFormEmail() {
  var kycLink = $('#kyc-notice a');
  kycLink.attr('href', kycLink
    .attr('href')
    .replace("{{USER_ID}}", Session.getUserId())
    .replace("{{USER_EMAIL}}", Session.getEmail())
  );
}

function bindReferralStats() {
  $("#dashboard-ref-count").text(State.numReferralSignups());
  $("#dashboard-ref-commission").text(State.numReferralCommissionAmount());
}

function bindTemplateData() {
  registerLogoutListener();
  bindWelcomeName();
  bindReferralButtonUrl();
  bindReferralLink();
  bindReferralStats();
  bindKYCFormEmail();
}

export {bindTemplateData};
