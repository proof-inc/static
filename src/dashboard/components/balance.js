import State from '../state';
import UI from '../ui';
import merge from 'deepmerge';

var tokenShareBarUI = null;

function init() {
  tokenShareBarUI = createTokenShareBarUI();
}

function update() {
  updateTokenBalanceUI();
  updateTokenBonusBalanceUI();
  updateSupplyShareUI();
}

function updateTokenBalanceUI() {
  updateTokenStatBalanceUI('#balance-total', State.numTokenBalance());
}

function updateTokenBonusBalanceUI() {
  updateTokenStatBalanceUI('#bonus-total', State.numTokenBonusBalance());
}

function updateSupplyShareUI() {
  var shareModifier = State.percentSoldSupply(State.numTokenBalance()) / 100;
  tokenShareBarUI.animate(shareModifier || 0);
}

function createTokenShareBarUI() {
  return new ProgressBar.SemiCircle('#progress-share-percentage', merge(UI.BASE_BAR_CONFIG, {
    color: '#333',
    text: {
      value: '',
      alignToBottom: true,
      className: "dashboard-token-share-text",
      style: {
        // textAlign: 'center',
        transform: null
      }
    },
    from: {color: UI.BAR_PROPERTIES.emptyColor},
    to: {color: UI.BAR_PROPERTIES.fullColor},

    // Set default step function for all animate calls
    step: (state, bar) => {
      bar.path.setAttribute('stroke', state.color);
      var value = Math.round(bar.value() * 100);
      if (value > 1) {
        bar.setText(value + '%');
      }
      else {
        bar.setText("0%");
      }

      bar.text.style.color = state.color;
    }
  }));
}

export default {init, update};
