```js
import { StacheDefineElement } from 'can';

class CustomScroll extends StacheDefineElement {
  connected() {
    const events = {
      inserted () {
        const { viewModel } = this;
      },
      '.form click': function (ev) {
        ev.preventDefault();
      }
    };
  }
}
```

```js
import { StacheDefineElement } from 'can';

class MyScroll extends StacheDefineElement {
  connected() {
    const events = {
      '.form click': function (ev) {
        ev.preventDefault();
      }
    };
  }
}
```