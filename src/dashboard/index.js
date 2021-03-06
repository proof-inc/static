import UI from './ui';
import Referrer from './referrer';
import Session from '../session';
import Dialogs from './components/dialogs'
import Template from "./components/template";
import DB from './db';
import Debug from "./debug";

//
// CONFIG & INIT
//

// TODO
// - KYC welcome name var
// - psp callbacks
// - kyc callback
// - token number formatting
// - anonymous chat?
// - anonymous recent transaction list
// - push notifications

//
// CREATE UI
//
UI.initComponents();

// init procedure dependent on site-wide init
// only register
$(window).on("load", function() {

  // parse referrer and store in local storage ASAP
  Referrer.parse();

  // callback to run when a login is detected
  Session.onLogin(function()
  {
    // set url to our own referrer for dummy sharing
    Referrer.setReferrerUrl();

    // bind some template vars based on authentication
    Template.bindTemplateData();

    // init investor entry
    DB.init();

    // reset meters
    UI.update();

    // hide loading screen
    Dialogs.hideLoginUI();
  });

  // callback to run when logout is detected
  Session.onLogout(Dialogs.showLoginUI);

  // The start method will wait until the DOM is loaded.
  Session.login('#dashboard-loading-overlay', AUTH0_CALLBACK_URL);
});

function logoutAndPrompt() {
  Session.logout(Dialogs.showLoginUI); // side-wide function of clearing session
}

export default {logoutAndPrompt};
