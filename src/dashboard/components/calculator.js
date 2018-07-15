import State from '../state';
import ionRangeSlider from 'ion-rangeslider';

// TODO: capitalise?
var sliderMinInvestment = 1000;
var sliderSalePhase = 0;

function init() {
  createInvestmentCalcSliderUI();
  createSaleProgressCalcSliderUI();
  registerManualInvestmentAmountListener();
  update();
}

function update() {
  $(".investment-token-result").text("" + calcTokenResult());
  $("#investment-manual-amount").val(sliderMinInvestment);
}

function calcTokenResult() {
  var baseTokenCount = State.euroToTokenAmount(sliderMinInvestment);
  var totalTokensSold = (sliderSalePhase / 100) * BASE_TOKEN_AMOUNT;
  var tokenCount = baseTokenCount + State.tokenBonusAmount(baseTokenCount, totalTokensSold);
  return tokenCount;
}

function registerManualInvestmentAmountListener() {
  $("#investment-manual-amount").change(function(){
    sliderMinInvestment = $(this).val();
    $("#investment-slider")
      .data("ionRangeSlider")
      .update({from: sliderMinInvestment});
    update();
  });
}

function createSaleProgressCalcSliderUI() {
  $("#sale-phase-slider").ionRangeSlider({
    min: 0,
    max: 100,
    from: sliderSalePhase,

    onChange: function (data) {
      sliderSalePhase = data.from;
      update();
    },
  });
}

function createInvestmentCalcSliderUI() {
  $("#investment-slider").ionRangeSlider({
    min: 1000,
    step: 5000,
    grid: true,
    max: tokensSaleAvailable()/4,
    from: sliderMinInvestment,
    prefix: '€',

    onChange: function (data) {
      sliderMinInvestment = data.from;
      update();
    },
  });
}

export default {init, update};
