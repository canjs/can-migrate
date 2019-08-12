```js
import { StacheElement } from 'can';

class CustomScroll extends StacheElement {
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
import { StacheElement } from 'can';

class MyScroll extends StacheElement {
  connected() {
    const events = {
      '.form click': function (ev) {
        ev.preventDefault();
      }
    };
  }
}
```