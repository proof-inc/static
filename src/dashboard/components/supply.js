import State from '../state';
import UI from '../ui';
import merge from 'deepmerge';
import ProgressBar from 'progressbar.js';

var tokenSupplyBarUI = null;

function init() {
  tokenSupplyBarUI = createTokenSupplyBarUI();
}

function update() {
  updateSupplyBarUI();
}

function updateSupplyBarUI() {
  tokenSupplyBarUI.animate(1 - State.modifierSoldSupply());
}

function createTokenSupplyBarUI() {
  return new ProgressBar.Circle('#token-supply-left-progress', merge(UI.BASE_BAR_CONFIG, {
    color: '#F8BC3F',
    strokeWidth: 10,
    trailWidth: 10,
    easing: 'easeInOut',
    duration: 1400,
    text: {
      autoStyleContainer: true,
      alignToBottom: false,
      className: "dashboard-token-supply-text",
      style: {
        // fontFamily: barTextFont,
        fontSize: '50px',
        fontWeight: "bold",
        color: '#333',
        // textAlign: 'center',
        // transform: null
      }
    },
    from: { color: UI.BAR_PROPERTIES.emptyColor, width: 10 },
    to: { color: UI.BAR_PROPERTIES.fullColor, width: 10 },

    // Set default step function for all animate calls
    step: function(state, circle) {
      circle.path.setAttribute('stroke', state.color);
      circle.path.setAttribute('stroke-width', state.width);
      var value = Math.round(circle.value() * 100);
      circle.setText(value + '%');
    }
  }));
}

export default {init, update};
