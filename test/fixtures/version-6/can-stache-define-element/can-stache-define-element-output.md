
  ```js
  import { Component } from "can";
  // Component
  class FooBar extends StacheElement {
    static get view() {
      return ``;
    }

    static get props() {
      return {};
    }
  };
  customElements.define('foo-bar', FooBar);
  ```

```js
class FooBaz extends StacheElement {
  static get view() {
    return `<h1>HELLO</h1>`;
  }

  static get props() {
    return {};
  }
};
customElements.define('foo-baz', FooBaz);
```