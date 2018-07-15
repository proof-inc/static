// register on load
$(function()
{
  // we need to provide the user id to the payment method
	redirectToDashboardOnLogout();

  var paypalIdealForm = $(".paypal-ideal-form");

  // form that is active on both paypal and ideal page
  if (hasPaypalIdealForm()) {
    getPaypalIdealComponent(".hidden-user-id").val(getUserId());
    getPaypalIdealComponent(".paypal-ideal-submit").click(function(){
      var amount = getPaypalIdealComponent(".paypal-ideal-amount").val();
      var url = generatePaypalBunqReceiveUrl(getPaypalIdealType(), amount)
      window.open(url);
    });
  }

  // SEPA & SWIFT
  $("#personal-reference-code").text(getUserId());

  // determine if this is a paypal or ideal page
  function getPaypalIdealType() {
    if (location.pathname.match('dashboard/payment-instructions/paypal')) {
      return "paypal";
    }
    else if (location.pathname.match('dashboard/payment-instructions/ideal')) {
      return "ideal";
    }
    else {
      throw "unsupported payment page!";
    }
  }

  // generate page for bunq or paypal
  function generatePaypalBunqReceiveUrl(type, amount) {
    'https://www.' + type + '.me/proofinc/' + amount;
  }

  function getPaypalIdealComponent(selector) {
    return paypalIdealForm.find(selector);
  }

  function hasPaypalIdealForm() {
    return paypalIdealForm.length > 0;
  }
});
