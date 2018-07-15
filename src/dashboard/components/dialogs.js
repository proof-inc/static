function hideLoginUI() {
  $("#dashboard-loading-overlay").hide();
  $("#protected-content-container").show();
}

function showLoginUI() {
  $("#dashboard-loading-overlay").show();
  $("#protected-content-container").hide();
}

function showError(code, message) {
  $("#dashboard-overlay-error-code").text(code);
  $("#dashboard-overlay-error-message").text(message);
  $("#dashboard-error-overlay").removeClass("hidden");
}

export default {hideLoginUI, showLoginUI, showError};
