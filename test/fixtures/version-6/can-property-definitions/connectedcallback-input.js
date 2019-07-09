class analogClock extends StacheDefineElement {
  static get view() {
    return `<canvas this:to="canvasElement" id="analog" width="255" height="255"></canvas>`;
  }

  static get define() {
    return {
      // the canvas element
      canvasElement: HTMLCanvasElement,

      // the canvas 2d context
      get canvas() {
        return this.canvasElement.getContext("2d");
      },

      connectedCallback(element) {
        element.addEventListener('click', (ev) => ev.preventDefault());

        element.style.height = '200px';
      }
    };
  }

  connected() {
    const vmControl = Control.extend({
      '.form click': function (ev) {
        ev.preventDefault();
      }
    });

    new vmControl(this);
  }
};
customElements.define("analog-clock", analog-clock);

class MyApp extends StacheDefineElement {
  static get view() {
    return ``;
  }

  static get define() {}

  connectedCallback(element) {
    element.addEventListener('click', (ev) => ev.preventDefault());

    element.style.height = '200px';
  }
};
customElements.define("my-app", MyApp);
