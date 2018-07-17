import Dashboard from '../index';
import Session from '../../session';
import State from '../state';
import Referrals from './referrals';

function bindTemplateData() {
  registerLogoutListener();
  bindWelcomeName();
  bindKYCFormEmail();
  Referrals.init();
}

function updateReferrals() {
  Referrals.update();
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

export default {bindTemplateData, updateReferrals};
