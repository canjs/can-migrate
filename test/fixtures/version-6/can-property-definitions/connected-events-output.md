```js
import { Control, StacheElement } from 'can';

class CustomScroll extends StacheElement {
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
```

```js
import { Control, StacheElement } from 'can';

class MyScroll extends StacheElement {
  connected() {
    const vmControl = Control.extend({
      '.form click': function (ev) {
        ev.preventDefault();
      }
    });

    new vmControl(this);
  }
}
```