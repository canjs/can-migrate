class FooBar extends StacheElement {
  static get view() {
    return ``;
  }

  static get props() {
    return {};
  }
};

customElements.define('foo-bar', FooBar);

class FooBaz extends StacheElement {
  static get view() {
    return `<h1>HELLO</h1>`;
  }

  static get props() {
    return {};
  }
};

customElements.define('foo-baz', FooBaz);

class CustomScroll extends StacheElement {
  static get view() {
    return `
  <h1>HELLO</h1>
  `;
  }

  static get props() {
    return {
      something: {
        type: 'string',
        get (lastSet, resolve) {
          resolve(true);
        }
      }
    };
  }

  connected() {
    const events = {
      inserted () {
        const { viewModel } = this;
      }
    };
  }
}

customElements.define('custom-scroll', CustomScroll);

export default class Whizz extends StacheElement {
  static get view() {
    return `<h1>HELLO</h1>`;
  }

  static get props() {
    return {};
  }
}
customElements.define('whizz', Whizz);