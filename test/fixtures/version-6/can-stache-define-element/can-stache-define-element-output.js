class FooBar extends StacheDefineElement {
  static get view() {
    return ``;
  }

  static get define() {
    return {};
  }
};

customElements.define('foo-bar', FooBar);

class FooBaz extends StacheDefineElement {
  static get view() {
    return `<h1>HELLO</h1>`;
  }

  static get define() {
    return {};
  }
};

customElements.define('foo-baz', FooBaz);

class CustomScroll extends StacheDefineElement {
  static get view() {
    return `
  <h1>HELLO</h1>
  `;
  }

  static get define() {
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
