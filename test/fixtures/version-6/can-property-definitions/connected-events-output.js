import { Control, StacheDefineElement } from 'can';

class CustomScroll extends StacheDefineElement {
  connected() {
    const vmControl = Control.extend({
      inserted () {
        const { viewModel } = this;
      },

      '.form click': function (ev) {
        ev.preventDefault();
      }
    });

    new vmControl(this);
  }
}