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
    this.addEventListener('click', (ev) => ev.preventDefault());

    this.style.height = '200px';
  }
};
customElements.define("analog-clock", analog-clock);

class MyApp extends StacheDefineElement {
  static get view() {
    return ``;
  }

  static get define() {}

  connected() {
    this.addEventListener('click', (ev) => ev.preventDefault());

    this.style.height = '200px';
  }
};
customElements.define("my-app", MyApp);
