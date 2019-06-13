class FooBar extends StacheDefineElement {
  static get define() {
    return {};
  }
  static get view() {
    return ``;
  }
}
customElements.define('foo-bar', FooBar);

class FooBaz extends StacheDefineElement {
  static get define() {
    return {};
  }
  static get view() {
    return `<h1>HELLO</h1>`;
  }
}
customElements.define('foo-baz', FooBaz);
