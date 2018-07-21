import Calculator from './components/calculator';
import Template from './components/template';
import Balance from './components/balance';
import Supply from "./components/supply";
import Referrals from "./components/referrals";

// UI variables
const BAR_PROPERTIES = {
  strokeWidth: 25,
  emptyColor: '#cc0000',
  fullColor: '#26CA7B',
  trailColor: '#CCC',
  barTextFont: '"Raleway", Helvetica, sans-serif'
};

// TODO: max aanpassen wanneer nieuwe investeringen gedaan worden
function initComponents() {
  Balance.init();
  Supply.init();
  Calculator.init();
  Referrals.init();
}

function update() {
  Supply.update();
  Balance.update();
  Template.update();
  Referrals.update();
}

// shared utility function
function updateTokenStatBalanceUI(selector, newValue) {
  if ($(selector).text() != (""+newValue)) {
    $(selector).animateNumber({ number: newValue });
  }
}

var BASE_BAR_CONFIG = {
  strokeWidth: BAR_PROPERTIES.strokeWidth,
  trailColor: BAR_PROPERTIES.trailColor,
  trailWidth: 25,
  easing: 'easeInOut',
  duration: 1400,
  svgStyle: {
    display: 'block',
    width: '100%'
  },
  text: {
    style: {
      fontFamily: BAR_PROPERTIES.barTextFont,
      fontSize: '2rem',
      transform: null,
      textAlign: 'center',
      position: 'absolute'
    }
  }
};

export default {
  initComponents,
  update,
  updateTokenStatBalanceUI,
  BASE_BAR_CONFIG,
  BAR_PROPERTIES
};
