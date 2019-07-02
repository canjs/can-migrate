
  ```js
  import { Component } from "can";
  // Component
  class FooBar extends StacheDefineElement {
    static get view() {
      return ``;
    }

    static get define() {
      return {};
    }
  };
  customElements.define('foo-bar', FooBar);
  ```

```js
class FooBaz extends StacheDefineElement {
  static get view() {
    return `<h1>HELLO</h1>`;
  }

  static get define() {
    return {};
  }
};
customElements.define('foo-baz', FooBaz);
```